# Theme Switching Feature

This frontend application now supports both light and dark themes with a toggle button in the navbar.

## Features

- **Theme Toggle**: Click the sun/moon icon in the top-right corner of the navbar to switch between themes
- **Persistent Storage**: Your theme preference is saved in localStorage and will persist across browser sessions
- **Smooth Transitions**: All theme changes include smooth CSS transitions for a better user experience
- **Responsive Design**: The theme toggle works on all screen sizes
- **Complete Coverage**: All pages (Home, Login, Register, CreateProject, MyProjects, EditProject) support both themes
- **Consistent Styling**: Login and Register pages now match the EditProject page styling

## Implementation Details

### Files Modified/Created:

1. **`src/context/ThemeContext.jsx`** - New theme context for state management
2. **`src/components/Navbar.jsx`** - Added theme toggle button
3. **`src/App.jsx`** - Wrapped with ThemeProvider
4. **`src/index.css`** - Updated with CSS custom properties for theming
5. **`src/pages/Login.jsx`** - Updated to use theme system and match EditProject styling
6. **`src/pages/Register.jsx`** - Updated to use theme system and match EditProject styling
7. **`src/pages/MyProjects.jsx`** - Updated to use theme system
8. **`src/pages/EditProject.jsx`** - Updated to use theme system

### Theme Variables:

The application uses CSS custom properties (variables) to manage colors:

**Dark Theme (Default):**
- Background: `#232136`
- Text: `#fff`
- Cards: Semi-transparent dark backgrounds
- Borders: Light borders with transparency
- Navbar: Dark background with white text

**Light Theme:**
- Background: `#f8f9fa` (Bootstrap light gray)
- Text: `#212529` (Bootstrap dark)
- Cards: Semi-transparent white backgrounds
- Borders: Dark borders with transparency
- Navbar: White background with dark text

### Text Color Fixes:

The following elements now properly adapt to both themes:
- All paragraph text, labels, and form elements
- Alert messages (success/error)
- Button links and hover states
- Card content and descriptions
- Modal content and backdrops
- Progress bars and badges
- Input groups and form text
- Loading states and error messages
- **Navbar text colors** - Fixed for proper contrast in both themes

### Styling Consistency:

**Login and Register Pages:**
- Now use the same container structure as EditProject
- Card header with emoji icons (🔐 Sign In, 📝 Sign Up)
- Proper form layout with required field indicators (*)
- Side-by-side buttons (primary action + secondary action)
- Loading states with spinners
- Dismissible alert messages
- Consistent spacing and typography

### Usage:

The theme toggle button is located in the top-right corner of the navbar and shows:
- ☀️ (sun) when in dark mode (click to switch to light)
- 🌙 (moon) when in light mode (click to switch to dark)

The theme preference is automatically saved and restored when you return to the application.

### Pages Updated:

1. **Home Page**: Campaign cards and donation modal
2. **Login Page**: Form styling, background, and layout matching EditProject
3. **Register Page**: Form styling, background, and layout matching EditProject
4. **MyProjects Page**: Campaign cards and layout
5. **EditProject Page**: Form styling and layout
6. **CreateProject Page**: Uses Material-UI (may need separate theming)

### CSS Classes Used:

- `glass-home-bg`: Main background with theme support
- `glass-card`: Card styling with theme support
- Theme-aware text colors for all elements
- Responsive design maintained across themes
- Navbar text color fixes for light mode

### Recent Updates:

- **Login/Register Styling**: Updated to match EditProject page layout
- **Navbar Text Colors**: Fixed contrast issues in light mode
- **Form Consistency**: All forms now use the same styling patterns
- **Button Layout**: Side-by-side button arrangement for better UX 