# Environment Variables Setup Guide

This guide explains how to set up environment variables for the Quizlett application, both for local development and Vercel deployment.

## 📋 Current Environment Variables

The application currently uses the following environment variables:

| Variable | Description | Required | Default | Where to Set |
|----------|-------------|----------|---------|--------------|
| `NEXT_PUBLIC_APP_NAME` | Application name displayed in UI | No | "Quizlett" | `.env.local`, Vercel |
| `NEXT_PUBLIC_APP_URL` | Base URL of the application | No | "http://localhost:3000" | `.env.local`, Vercel |
| `NODE_ENV` | Environment mode | No | "development" | `.env.local`, Vercel |

## 🚀 Local Development Setup

### 1. Environment Files Created

The following files have been created for you:

- **`.env.example`** - Template with all available variables (safe to commit)
- **`.env.local`** - Your local development variables (git-ignored)

### 2. Using Environment Variables in Code

```typescript
// Access environment variables in your components
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Quizlett';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Example usage in the app
<h1 className="text-2xl font-bold">{appName}</h1>
```

## 🌐 Vercel Deployment Setup

### Step 1: Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Navigate to your project dashboard
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Environment Variables

Click **"Add New"** and add these variables:

#### Production Environment Variables
```
NODE_ENV=production
```

#### Optional Customization Variables
```
NEXT_PUBLIC_APP_NAME=Quizlett
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Step 3: Redeploy
After adding environment variables, redeploy your application:
- Go to **Deployments** tab
- Click the **"..."** menu on your latest deployment
- Select **"Redeploy"**

## 🔧 Adding New Environment Variables

### 1. For Local Development
1. Add to `.env.example` (for documentation)
2. Add to `.env.local` (for your local use)
3. Use in code: `process.env.YOUR_VARIABLE_NAME`

### 2. For Vercel Production
1. Add to Vercel dashboard (Settings → Environment Variables)
2. Redeploy the application
3. Variables are automatically available in production

## 📝 Example Environment Variable Usage

```typescript
// In app/layout.tsx or any component
export default function Layout({ children }: { children: React.ReactNode }) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Quizlett';

  return (
    <html lang="en">
      <head>
        <title>{appName}</title>
        <meta name="description" content={`${appName} - Test your knowledge`} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

## 🔒 Security Best Practices

- ✅ **Client-side variables**: Use `NEXT_PUBLIC_` prefix
- ✅ **Sensitive data**: Keep API keys server-side only (no `NEXT_PUBLIC_` prefix)
- ✅ **Local files**: Never commit `.env.local` to git
- ✅ **Production**: Set variables in Vercel dashboard, not in code

## 🆘 Troubleshooting

### Environment Variables Not Working?
1. **Local development**: Make sure `.env.local` exists and is in project root
2. **Vercel**: Check if variables are set in the correct environment (Production/Preview)
3. **Restart**: Restart your development server after adding new variables
4. **Redeploy**: Redeploy on Vercel after adding new variables

### Common Issues
- **Build errors**: Check if required variables are set
- **Runtime errors**: Verify variable names match exactly
- **TypeScript errors**: Environment variables are strings, may need type conversion

## 📞 Need Help?

If you encounter issues with environment variables:
1. Check the Vercel documentation: https://vercel.com/docs/concepts/projects/environment-variables
2. Verify your `.env.local` file exists and has correct syntax
3. Ensure variable names match exactly in your code
4. Check the browser console for any runtime errors
