// Generates Quizlett brand asset variants from the master mark (public/brand/logo.png).
// Dependency-free PNG codec: decode RGBA, recolor/composite, re-encode.
// Run: node scripts/generate-brand-assets.js
const fs = require("fs")
const path = require("path")
const zlib = require("zlib")

const ROOT = path.join(__dirname, "..")
const MASTER = path.join(ROOT, "public/brand/logo.png")

// ---------- PNG decode ----------
function decodePng(file) {
  const buf = fs.readFileSync(file)
  let pos = 8
  const idat = []
  let width = 0
  let height = 0
  let colorType = 6
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos)
    const type = buf.toString("ascii", pos + 4, pos + 8)
    const data = buf.slice(pos + 8, pos + 8 + len)
    if (type === "IHDR") {
      width = data.readUInt32BE(0)
      height = data.readUInt32BE(4)
      colorType = data[9]
    } else if (type === "IDAT") {
      idat.push(data)
    } else if (type === "IEND") {
      break
    }
    pos += 12 + len
  }
  if (colorType !== 6 && colorType !== 2) {
    throw new Error(`Unsupported PNG color type ${colorType}; expected RGBA(6) or RGB(2)`)
  }
  const channels = colorType === 6 ? 4 : 3
  const stride = width * channels
  const raw = zlib.inflateSync(Buffer.concat(idat))
  const out = Buffer.alloc(height * stride)
  const paeth = (a, b, c) => {
    const p = a + b - c
    const pa = Math.abs(p - a)
    const pb = Math.abs(p - b)
    const pc = Math.abs(p - c)
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c
  }
  let rp = 0
  for (let y = 0; y < height; y++) {
    const filter = raw[rp++]
    const line = out.slice(y * stride, (y + 1) * stride)
    const prev = y > 0 ? out.slice((y - 1) * stride, y * stride) : Buffer.alloc(stride)
    for (let x = 0; x < stride; x++) {
      const rv = raw[rp + x]
      const a = x >= channels ? line[x - channels] : 0
      const b = prev[x]
      const c = x >= channels ? prev[x - channels] : 0
      let v
      switch (filter) {
        case 0: v = rv; break
        case 1: v = rv + a; break
        case 2: v = rv + b; break
        case 3: v = rv + ((a + b) >> 1); break
        case 4: v = rv + paeth(a, b, c); break
        default: v = rv
      }
      line[x] = v & 255
    }
    rp += stride
  }
  // normalize to RGBA
  const rgba = Buffer.alloc(width * height * 4)
  for (let i = 0, j = 0; i < rgba.length; i += 4, j += channels) {
    rgba[i] = out[j]
    rgba[i + 1] = out[j + 1]
    rgba[i + 2] = out[j + 2]
    rgba[i + 3] = channels === 4 ? out[j + 3] : 255
  }
  return { width, height, data: rgba }
}

// ---------- PNG encode ----------
const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()
function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 255] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, "ascii"), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function encodePng(file, width, height, rgba) {
  const stride = width * 4
  const raw = Buffer.alloc(height * (stride + 1))
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ])
  fs.writeFileSync(file, png)
  console.log("wrote", path.relative(ROOT, file), `${width}x${height}`, `${png.length}B`)
}

// ---------- compositing helpers ----------
function canvas(width, height, fill) {
  const data = Buffer.alloc(width * height * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = fill[0]
    data[i + 1] = fill[1]
    data[i + 2] = fill[2]
    data[i + 3] = fill[3]
  }
  return { width, height, data }
}
// straight-alpha "source over"
function paste(dst, src, ox, oy) {
  for (let y = 0; y < src.height; y++) {
    const dy = y + oy
    if (dy < 0 || dy >= dst.height) continue
    for (let x = 0; x < src.width; x++) {
      const dx = x + ox
      if (dx < 0 || dx >= dst.width) continue
      const si = (y * src.width + x) * 4
      const sa = src.data[si + 3] / 255
      if (sa === 0) continue
      const di = (dy * dst.width + dx) * 4
      const da = dst.data[di + 3] / 255
      const oa = sa + da * (1 - sa)
      for (let c = 0; c < 3; c++) {
        dst.data[di + c] = oa === 0 ? 0 : Math.round((src.data[si + c] * sa + dst.data[di + c] * da * (1 - sa)) / oa)
      }
      dst.data[di + 3] = Math.round(oa * 255)
    }
  }
}
function recolor(src, rgb) {
  const data = Buffer.from(src.data)
  for (let i = 0; i < data.length; i += 4) {
    data[i] = rgb[0]
    data[i + 1] = rgb[1]
    data[i + 2] = rgb[2]
  }
  return { width: src.width, height: src.height, data }
}
// anti-aliased rounded-rect coverage mask multiplied into alpha
function roundMask(img, radius) {
  const { width: w, height: h, data } = img
  const hx = w / 2
  const hy = h / 2
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = Math.abs(x + 0.5 - hx) - (hx - radius)
      const py = Math.abs(y + 0.5 - hy) - (hy - radius)
      const d = Math.hypot(Math.max(px, 0), Math.max(py, 0)) + Math.min(Math.max(px, py), 0) - radius
      const coverage = Math.min(1, Math.max(0, 0.5 - d))
      const i = (y * w + x) * 4
      data[i + 3] = Math.round((data[i + 3] / 255) * coverage * 255)
    }
  }
}
// subtle radial ambient glow added behind content (additive, alpha-preserving)
function radialGlow(img, cx, cy, radius, rgb, strength) {
  const { width: w, height: h, data } = img
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const d = Math.hypot(x - cx, y - cy) / radius
      const f = Math.exp(-d * d) * strength
      if (f < 0.004) continue
      const i = (y * w + x) * 4
      for (let c = 0; c < 3; c++) {
        data[i + c] = Math.min(255, Math.round(data[i + c] + rgb[c] * f))
      }
    }
  }
}

// ---------- build variants ----------
const master = decodePng(MASTER)

// 1. inverse mark (white ink) for dark surfaces
encodePng(path.join(ROOT, "public/brand/logo-inverse.png"), master.width, master.height, recolor(master, [255, 255, 255]).data)

// 2. favicon + apple touch icon: light rounded tile with the black mark, padded
const TILE = 640
const tile = canvas(TILE, TILE, [248, 250, 252, 255])
roundMask(tile, Math.round(TILE * 0.225))
paste(tile, master, (TILE - master.width) / 2, (TILE - master.height) / 2)
encodePng(path.join(ROOT, "app/icon.png"), TILE, TILE, tile.data)
encodePng(path.join(ROOT, "app/apple-icon.png"), TILE, TILE, Buffer.from(tile.data))

// 3. social cards: dark brand canvas, ambient indigo glow, inverse mark centered
const inverse = recolor(master, [255, 255, 255])
const OG_W = 1200
const OG_H = 630
const og = canvas(OG_W, OG_H, [7, 10, 18, 255])
radialGlow(og, OG_W / 2, OG_H / 2, 420, [124, 131, 255], 0.16)
paste(og, inverse, (OG_W - inverse.width) / 2, (OG_H - inverse.height) / 2)
encodePng(path.join(ROOT, "app/opengraph-image.png"), OG_W, OG_H, og.data)
encodePng(path.join(ROOT, "app/twitter-image.png"), OG_W, OG_H, Buffer.from(og.data))

console.log("brand assets generated")
