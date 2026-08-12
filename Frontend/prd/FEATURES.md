# FEATURES.md: LT3 MEDIA TJKT Dynamic Web & Admin Revamp

## Interactive Hero Section

This section details the features for the enhanced, interactive hero component on the public-facing homepage.

### Feature: Interactive Card Stack Component

This feature replaces the static image in the homepage hero section with a dynamic, engaging card stack.

#### User Stories

*   **As a public website visitor**, I want to see an engaging and dynamic hero section on the homepage so that I am immediately captivated and encouraged to explore the site further.
*   **As a public website visitor**, when I hover over the hero section (desktop) or tap it (mobile), I want to see smooth, interactive card animations revealing different aspects of the school so that I can quickly grasp key information in an engaging way.
*   **As a public website visitor**, I expect the hero section to look and behave consistently well across different devices (desktop, tablet, mobile) so that I have a seamless experience regardless of how I access the site.

#### Acceptance Criteria

*   The homepage hero section displays a stack of visually distinct cards instead of a single static image.
*   On desktop devices, hovering over the interactive component triggers a smooth animation where cards separate, scale, rotate, or layer to reveal distinct content (e.g., images, titles, brief descriptions).
*   On touch-enabled devices (tablet, mobile), a single tap on the component initiates the card reveal animation.
*   Each revealed card within the stack displays unique, relevant content (e.g., a specific program, student achievement, or school value).
*   The component is fully responsive, adapting its layout, card size, and interaction model appropriately for desktop, tablet, and mobile breakpoints.
*   Animations are performant, targeting a consistent 60 frames per second (FPS) on modern browsers.

#### Edge Cases

*   **Rapid Interaction:** The animation system should gracefully handle rapid hover-in/hover-out events or multiple taps, ensuring smooth transitions without visual glitches.
*   **Single Card Configuration:** If only one card is configured for the hero section, it should display prominently, potentially without the stack animation, or with a simplified effect.
*   **Content Loading Failure:** If an image or content for a card fails to load, a predefined fallback (e.g., placeholder image, default text) should be displayed.

## Dynamic Site Content Manager (Admin Panel)

This section outlines the features for the new "Site Content" module within the existing `/admin` dashboard, enabling administrators to manage website content dynamically.

### Feature: Navigation Management

This feature provides administrators with tools to control the website's primary navigation, action buttons, and social media links.

#### User Stories

*   **As an administrator**, I want to easily add new menu items to the main navigation bar so that I can update the site structure without developer intervention.
*   **As an administrator**, I want to be able to reorder navigation links using a drag-and-drop interface so that I can quickly adjust the menu hierarchy.
*   **As an administrator**, I want to edit the text and URL of existing navigation links and primary call-to-action buttons (e.g., "Daftar PPDB") so that I can keep the site's calls to action current.
*   **As an administrator**, I want to manage social media links (e.g., Facebook, Instagram) so that the school's online presence is consistently updated.

#### Acceptance Criteria

*   A dedicated "Navigation" sub-section is accessible within the "Site Content" admin module.
*   Admins can create new navigation items by providing a display label and a target URL.
*   Admins can edit the display label and URL of any existing navigation item.
*   Admins can delete navigation items, with a confirmation prompt to prevent accidental removal.
*   Admins can reorder navigation items using an intuitive drag-and-drop interface.
*   The text and URL for the primary call-to-action button (e.g., "Daftar PPDB") are editable fields.
*   Social media links (e.g., icon selection, URL) can be added, edited, and removed.
*   All changes saved in the admin panel are immediately reflected on the public website's navigation and action buttons.

#### Edge Cases

*   **Invalid URLs:** Client-side validation should prevent saving navigation items with malformed URLs.
*   **Critical Item Deletion:** A warning should be displayed if an admin attempts to delete a commonly used or critical navigation item.
*   **Empty Navigation:** The system should handle scenarios where no navigation items are configured, potentially displaying a default message or a simplified menu.

### Feature: Section Content Editor

This feature allows administrators to dynamically edit text, numbers, images, and links within various designated content sections across the website.

#### User Stories

*   **As an administrator**, I want to edit text, numbers, and links within any designated section of a page (e.g., Hero title, "About Us" paragraph, statistics counter) so that I can keep the website content fresh and accurate.
*   **As an administrator**, I want to upload images and icons for specific content sections so that I can visually enrich the website without needing a developer.
*   **As an administrator**, I want to use a rich text editor (TipTap) for certain content areas so that I can apply basic formatting like bold, italics, and lists.
*   **As an administrator**, I want to see a live preview or a highly representative form of my content changes before saving so that I can ensure accuracy and prevent layout issues.

#### Acceptance Criteria

*   The "Site Content" dashboard provides an interface to select specific pages and their editable content sections (e.g., "Homepage Hero", "About Us Section", "Contact Info Block").
*   For each selected section, editable fields are presented based on the content type (e.g., single-line text input for titles, multi-line text area for paragraphs, number input for statistics, URL input for links).
*   Text areas designated for rich content (e.g., longer descriptions) integrate the TipTap editor, allowing for basic formatting (bold, italic, underline, lists).
*   A file upload mechanism is available for fields designated for images or icons, allowing admins to upload new media assets.
*   A live preview pane or a highly accurate visual representation of the content changes is displayed alongside the editing fields.
*   Saving changes persists them to the backend database and triggers an immediate update on the public website.
*   Numerical fields (e.g., for "450 Siswa Aktif") only accept valid numbers and are displayed correctly on the frontend.

#### Edge Cases

*   **Excessive Content:** The system should provide character limits or visual indicators for text fields to prevent admins from entering content that would break the frontend layout.
*   **Large Image Uploads:** Backend validation should enforce file size limits for image uploads, and the system should handle image optimization (e.g., resizing, compression) upon successful upload.
*   **Invalid File Types:** The upload mechanism should restrict file types to accepted image formats (e.g., JPG, PNG, SVG).

### Feature: Media Asset Management

This feature provides the underlying capability for administrators to manage visual assets used across the dynamic content sections.

#### User Stories

*   **As an administrator**, I want to upload new images and icons to be used across the website so that I can easily update visual content.
*   **As an administrator**, I want to select from previously uploaded media assets when editing content sections so that I don't have to re-upload the same files repeatedly.

#### Acceptance Criteria

*   When an image/icon field is present in the Section Content Editor, it provides an option to either upload a new file or select from an existing media library.
*   The media library displays a gallery of previously uploaded images and icons.
*   Admins can upload common image file formats (e.g., JPG, PNG, SVG).
*   Uploaded images are stored securely and are accessible for selection in any content section requiring an image.
*   The system automatically generates optimized versions (e.g., thumbnails, web-optimized sizes) of uploaded images for efficient delivery.

#### Edge Cases

*   **Duplicate File Names:** The system should handle duplicate file names gracefully, either by renaming files or providing a unique identifier.
*   **Storage Limits:** The system should provide warnings or prevent uploads if storage limits are approached or exceeded.

### Feature: Section Visibility Control

This feature empowers administrators to toggle the visibility of entire content sections on the public website.

#### User Stories

*   **As an administrator**, I want to be able to hide or show entire content sections on the public website with a single click so that I can quickly manage promotional content or seasonal information without removing it permanently.

#### Acceptance Criteria

*   Each configurable content section within the "Site Content" admin module includes a clear toggle switch (e.g., "Visible / Hidden").
*   Toggling the switch immediately updates the visibility status for that section in the database.
*   When a section is marked as "Hidden," it is not rendered on the public website.
*   When a section is marked as "Visible," it is rendered on the public website.

#### Edge Cases

*   **Critical Section Hiding:** Certain essential sections (e.g., the main navigation, footer) may not have a visibility toggle, or attempts to hide them should trigger a strong warning/confirmation.
*   **Dependency:** If a section's visibility affects other content, the system should ideally provide a warning (e.g., hiding a section that contains links to other pages).