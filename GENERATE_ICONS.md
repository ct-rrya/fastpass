# How to Generate PWA Icons

## Quick Method: Use Online Tool

1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload your logo/icon (or use the SVG from `public/icon.svg`)
3. Generate all sizes
4. Download and extract to `public/` folder

## Manual Method: Using Image Editor

### Required Sizes:
- **192x192** - Standard icon
- **512x512** - High-res icon

### Steps:
1. Create/open your logo in Photoshop, GIMP, or Figma
2. Export as PNG:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)
3. Save to `public/` folder

## Using the Existing SVG

The project already has `public/icon.svg` with a checkmark design. You can:

1. Open it in a browser
2. Take a screenshot
3. Resize to 192x192 and 512x512
4. Save as PNG files

Or use an SVG-to-PNG converter online.

## Quick Fix: Use Placeholder

For development/demo, you can use any PNG images:
- Find any 192x192 and 512x512 PNG images
- Rename them to `icon-192.png` and `icon-512.png`
- Place in `public/` folder

The PWA will work fine even without perfect icons!
