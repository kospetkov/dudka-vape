# Task: Port ThemeEditor from React to Vanilla JS

## Source Files
Location: `D:\DUDKA\ThemeEditor\`
- ThemeEditor.tsx (main component)
- ThemeEditor.scss (styles)
- ColorPicker/ (color picker component)
- FontInput.tsx (font input)
- utils/generateColorScheme.ts (color generation)
- utils/isLightColor.ts (theme detection)

## Target Output
Create 2 standalone files:
1. `theme-editor.js` - Vanilla JavaScript
2. `theme-editor.css` - Styles

## Requirements

### Core Features to Port:
1. **CSS Variables Manipulation**
   - Read/write CSS custom properties on :root
   - Same variable names as original

2. **Color Picker**
   - Input field with color preview
   - Hex color validation
   - Native color picker integration

3. **Theme Generator**
   - `generateColorScheme(baseColor)` function
   - Creates harmonious color palette from one color
   - Light/dark theme detection

4. **Theme Presets (Swatches)**
   - Predefined color schemes: blue, light, dark
   - Click to apply preset
   - "Yours" swatch for custom theme

5. **Font URL Input**
   - Google Fonts URL validation
   - Live font preview

6. **Export/Import**
   - Export theme as JSON
   - Import theme from JSON file
   - Download as ZIP (optional)

7. **Freeze Background**
   - Checkbox to lock background while changing accent colors

### API (public methods):
```javascript
const editor = new ThemeEditor({
  container: '#theme-editor',  // Where to mount
  target: ':root',             // Element to apply CSS vars
  onChange: (vars) => {},      // Callback on change
  onExport: (theme) => {},     // Callback on export
});

editor.setTheme(themeObject);  // Apply theme
editor.getTheme();             // Get current theme
editor.reset();                // Reset to defaults
editor.destroy();              // Cleanup
```

### CSS Variables to Support:
```css
--body-main              /* Main background */
--bg-main-layouts        /* Layout backgrounds */
--bg-main-elements       /* Element backgrounds */
--borders-color          /* Border color */
--bg-active-gradient     /* Active elements */
--text-active            /* Active text */
--text-lighter           /* Primary text */
--text-default           /* Secondary text */
--text-highlighted       /* Highlighted text */
```

### UI Layout:
```
┌─────────────────────────────┐
│ [Reset] [Close]             │
├─────────────────────────────┤
│ Theme Presets               │
│ [blue] [dark] [light] [yours]│
├─────────────────────────────┤
│ Theme Generator             │
│ [ ] Freeze background       │
│ [Color Picker Input]        │
├─────────────────────────────┤
│ Main background    [picker] │
│ Main elements      [picker] │
│ Sub elements       [picker] │
│ Border             [picker] │
│ Active elements    [picker] │
│ Primary text       [picker] │
│ Secondary text     [picker] │
├─────────────────────────────┤
│ Font URL                    │
│ [Google Fonts URL input]    │
├─────────────────────────────┤
│ [Import JSON] [Export]      │
└─────────────────────────────┘
```

### generateColorScheme Algorithm:
```javascript
function generateColorScheme(baseColor) {
  // 1. Parse base color to HSL
  // 2. Determine if light or dark theme
  // 3. Generate complementary colors:
  //    - Background variations (lighten/darken)
  //    - Text colors (contrast)
  //    - Accent colors (complementary hue)
  //    - Border colors (subtle)
  // 4. Return object with all CSS variable values
}
```

### No Dependencies
- Pure vanilla JavaScript (ES6+)
- No jQuery, no React, no external libs
- Only native browser APIs
- Should work in all modern browsers

### Integration Example:
```html
<link rel="stylesheet" href="theme-editor.css">
<script src="theme-editor.js"></script>

<div id="theme-editor"></div>

<script>
  const editor = new ThemeEditor({
    container: '#theme-editor'
  });
</script>
```

## Output Location
Save to: `D:\DUDKA\vape-shop\landing\theme-editor.js`
Save to: `D:\DUDKA\vape-shop\landing\theme-editor.css`
