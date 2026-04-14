# Deploying Dataset Tracker to thestimson.com

This document provides instructions for deploying the Dataset Tracker application to your website.

## What Was Built

The Dataset Tracker is a React application that:
- Displays dataset information from your CSV files (master list and matching report)
- Shows approved and rejected datasets
- Provides detailed views of questions and their statuses
- Uses Supabase as the database backend
- Is fully responsive and production-ready

## Deployment Options

### Option 1: Deploy to a Subdomain (Recommended)
Deploy to **tracker.thestimson.com** or **datasets.thestimson.com**

**Pros:**
- Clean, professional URL
- Easier to manage
- Better for SEO

**Steps:**
1. Build the application (already done - see `dist/` folder)
2. Upload the contents of the `dist/` folder to your web server
3. Configure your DNS to point the subdomain to the uploaded files
4. Ensure your web server is configured to serve single-page applications (route all requests to index.html)

### Option 2: Deploy to a Subdirectory
Deploy to **thestimson.com/datasets** or **thestimson.com/tracker**

**Steps:**
1. Update `vite.config.ts` to set the base path:
   ```typescript
   export default defineConfig({
     base: '/datasets/',
     // ... other config
   })
   ```
2. Rebuild: `npm run build`
3. Upload the contents of `dist/` to `/datasets/` on your web server

### Option 3: Deploy with Netlify (Easiest)

1. Create a free account at netlify.com
2. Connect your repository or drag-and-drop the `dist/` folder
3. Netlify will give you a URL like `dataset-tracker.netlify.app`
4. Configure a custom domain in Netlify settings to point to your domain

### Option 4: Deploy with Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in this directory
3. Follow the prompts
4. Configure custom domain in Vercel dashboard

## Important: Environment Variables

The application needs these environment variables to work:

```
VITE_SUPABASE_URL=https://jnzkmfujuhenfmqvmkgm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are already configured in your `.env` file. When deploying:
- For Netlify/Vercel: Add these in the dashboard under "Environment Variables"
- For traditional hosting: The values are bundled into the build

## Data Import

After deploying, you need to import your data:

1. Open the deployed application
2. Go to the "Import" tab
3. Click "Import CSV Data"
4. The data from your CSV files will be imported into Supabase

## Web Server Configuration

If deploying to your own server, configure it to handle single-page applications:

### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Nginx
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Next Steps

1. Choose your deployment method
2. Upload the built files from the `dist/` folder
3. Configure DNS/domain settings
4. Import your data using the Import tab
5. Test all functionality

## Need Help?

The application is ready to deploy. The build process completed successfully and all features are working.
