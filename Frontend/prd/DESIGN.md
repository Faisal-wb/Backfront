# DESIGN.md: LT3 MEDIA TJKT Dynamic Web & Admin Revamp

## Brand & Visual Identity
The project aims to evolve the existing LT3 MEDIA TJKT brand, maintaining its educational and professional essence while introducing modern, dynamic elements. The visual direction will be clean, engaging, and user-friendly, reflecting a forward-thinking educational institution. The design will be consistent with the current site's overall aesthetic but enhanced with contemporary UI/UX patterns.

## User Experience Goals
1.  **Enhanced Engagement:** Increase user interaction with the homepage, specifically the hero section, leading to a >15% reduction in homepage bounce rate and a >20% increase in average session duration.
2.  **Intuitive Content Management:** Enable school administrators to update website content efficiently, resulting in >5 content updates per week via the CMS and a <1 developer request per month for content changes.
3.  **Seamless Responsiveness:** Deliver a consistent and optimized user experience across all devices (desktop, tablet, mobile) for both public and admin interfaces, ensuring all interactive components adapt gracefully.

## Color Palette
The color palette is designed to be professional, approachable, and vibrant, suitable for an educational institution.

| Semantic Name | Hex Code | Usage |
|:---|:---|:---|
| Primary Blue | `#0056B3` | Main branding, primary CTAs, active states |
| Secondary Green | `#28A745` | Success messages, secondary CTAs, highlights |
| Accent Orange | `#FFC107` | Interactive elements, warnings, key information |
| Neutral Dark | `#343A40` | Headings, main text, dark backgrounds |
| Neutral Light | `#F8F9FA` | Backgrounds, subtle borders, light text |
| Neutral Gray | `#6C757D` | Secondary text, disabled states, borders |

```css
/* Tailwind CSS Custom Properties / Configuration Snippet */
:root {
  --color-primary: #0056B3;
  --color-secondary: #28A745;
  --color-accent: #FFC107;
  --color-neutral-dark: #343A40;
  --color-neutral-light: #F8F9FA;
  --color-neutral-gray: #6C757D;
}

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        'neutral-dark': 'var(--color-neutral-dark)',
        'neutral-light': 'var(--color-neutral-light)',
        'neutral-gray': 'var(--color-neutral-gray)',
      },
    },
  },
};
```

## Typography
The typography aims for readability and a modern, clean aesthetic.

*   **Headings (H1-H6):**
    *   **Font Family:** `Poppins`, sans-serif (Google Fonts: [https://fonts.google.com/specimen/Poppins](https://fonts.google.com/specimen/Poppins))
    *   **Weights:** 600 (Semi-Bold), 700 (Bold)
*   **Body Text & UI Elements:**
    *   **Font Family:** `Inter`, sans-serif (Google Fonts: [https://fonts.google.com/specimen/Inter](https://fonts.google.com/specimen/Inter))
    *   **Weights:** 400 (Regular), 500 (Medium), 600 (Semi-Bold)

**Font Size Scale (in `rem` based on 16px base):**

| Element | Size (rem) |
|:---|:---|
| H1 | 3.052 |
| H2 | 2.441 |
| H3 | 1.953 |
| H4 | 1.563 |
| H5 | 1.25 |
| H6 | 1.125 |
| Body Large | 1.125 |
| Body Base | 1.0 |
| Body Small | 0.875 |
| Caption | 0.75 |

## UI Components & Spacing
*   **Grid Unit:** All spacing and sizing will be based on an **8px grid unit**. This ensures consistent vertical and horizontal rhythm throughout the design.
*   **Border-Radius Scale:**
    *   `rounded-sm`: 4px (e.g., small buttons, input fields)
    *   `rounded-md`: 8px (e.g., cards, larger buttons)
    *   `rounded-lg`: 12px (e.g., prominent sections, modals)
    *   `rounded-full`: 9999px (e.g., avatars, circular elements)
*   **Standard Spacing Values (based on 8px grid):**
    *   `space-x-1` / `space-y-1`: 4px
    *   `space-x-2` / `space-y-2`: 8px
    *   `space-x-3` / `space-y-3`: 12px
    *   `space-x-4` / `space-y-4`: 16px
    *   `space-x-6` / `space-y-6`: 24px
    *   `space-x-8` / `space-y-8`: 32px
    *   `space-x-12` / `space-y-12`: 48px
    *   `space-x-16` / `space-y-16`: 64px

## Screen Priorities
The following screens are prioritized for design and development due to their impact on user engagement and administrative efficiency.

### Public User (Guest Role)
1.  **Homepage:** Critical for first impressions, featuring the interactive hero section.
2.  **Competency Page:** Details educational programs and offerings.
3.  **About Us Page:** Provides institutional information and values.
4.  **Contact Page:** Essential for inquiries and communication.

### Admin User (Administrator Role)
1.  **Site Content Manager Dashboard:** The central hub for dynamic content editing (Navigation, Section Editor).
2.  **Homepage Section Editor:** Specific interface for managing the Hero section and other homepage content.
3.  **Navigation Management Interface:** For adding, editing, and reordering menu items.
4.  **Existing Modules (e.g., Teachers, Achievements):** Ensuring seamless integration and consistent UI with new CMS features.

## Interaction & Motion
*   **Hero Section (Public Website):**
    *   **Interaction Model:** `hover_info_cards` (desktop), `tap_info_cards` (mobile/tablet).
    *   **Hover/Tap State:** Cards will smoothly separate, scale slightly, and rotate subtly to reveal layered information or images.
    *   **Transitions:** `transform`, `opacity`, `box-shadow` properties will use `ease-out` or `ease-in-out` timing functions.
    *   **Animation Duration:** 300ms for card separation/scaling, 150ms for subtle rotation.
*   **General UI Elements (Public & Admin):**
    *   **Buttons & Links:** Subtle `background-color` or `text-color` changes on hover, with `ease-in-out` transition over 150ms.
    *   **Input Fields:** Border color change on focus, `ease-in-out` over 100ms.
    *   **Modals/Drawers:** Fade-in/slide-in animations with `ease-out` over 200-300ms.
*   **Admin CMS:**
    *   **Drag-and-Drop (Navigation):** Visual feedback (e.g., ghost element, subtle highlight) during drag, smooth reordering animation.
    *   **Save Feedback:** Quick toast notifications for success/error messages, fading out after 3-5 seconds.

## Accessibility
*   **Contrast Ratios:**
    *   Text and interactive elements will meet WCAG 2.1 AA standards (minimum 4.5:1 for normal text, 3:1 for large text and graphical objects).
    *   Key elements will aim for AAA standards where feasible (minimum 7:1 for normal text).
*   **Keyboard Navigation:**
    *   All interactive elements (buttons, links, form fields, navigation items) will be fully navigable using keyboard `Tab` and `Shift+Tab`.
    *   Clear `focus` states (e.g., outline, background change) will be provided for all interactive elements.
    *   The interactive hero component will be accessible via keyboard, allowing users to trigger card reveals without a mouse.
*   **Semantic HTML:** Proper use of HTML5 semantic elements (e.g., `<nav>`, `<main>`, `<aside>`, `<button>`) to ensure screen reader compatibility.
*   **ARIA Attributes:** Appropriate ARIA roles and attributes will be used for complex UI components (e.g., modals, dynamic content areas) to convey their state and purpose to assistive technologies.
*   **Responsive Design:** The layout and content will adapt fluidly to different screen sizes, ensuring content remains readable and interactive elements are easily targetable on touch devices.