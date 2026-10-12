import Image from "next/image"

import { cn } from "@/lib/utils"

interface BrandMarkProps {
  size?: number
  className?: string
  priority?: boolean
}

export function BrandMark({ size = 32, className, priority = false }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex shrink-0 select-none", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src="/brand/logo.png"
        alt=""
        width={size}
        height={size}
        priority={priority}
        className="h-full w-full dark:hidden"
      />
      <Image
        src="/brand/logo-inverse.png"
        alt=""
        width={size}
        height={size}
        priority={priority}
        className="hidden h-full w-full dark:block"
      />
    </span>
  )
}
