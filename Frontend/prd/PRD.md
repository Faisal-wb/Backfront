# PRD: LT3 MEDIA TJKT Dynamic Web & Admin Revamp

## Executive Summary & Product Vision

This document outlines the requirements for the "LT3 MEDIA TJKT Dynamic Web & Admin Revamp" project. The primary goal is to modernize the public-facing website and empower school administrators with full content autonomy.

The product vision is to create a more engaging and dynamic digital presence for LT3 MEDIA TJKT. This will be achieved by replacing the static homepage hero with a visually compelling interactive component and implementing a comprehensive, site-wide Content Management System (CMS). This system will eliminate the need for developer intervention for routine content updates, increasing operational efficiency and ensuring the website's content remains current and relevant.

## Problem Statement & Target Users

**Problem Statement:**
1.  The current website's homepage hero section is static and lacks modern user engagement, failing to capture the attention of prospective students and parents effectively.
2.  Content updates across the website (e.g., navigation links, section text, statistics) require direct code changes by a developer, creating a significant bottleneck and preventing timely updates by school staff.

**Target Users:**
*   **Prospective Students & Parents (Public Users):** Visitors to the website seeking information about the school. They require an engaging, informative, and easy-to-navigate experience.
*   **School Administrators (Admin Users):** Non-technical staff responsible for maintaining the website's content. They require a simple, intuitive interface to update text, images, and navigation without any technical knowledge.

## System Scope & User Roles

The scope of this project is limited to two core feature sets: the implementation of an interactive hero section on the homepage and the development of a dynamic content management system within the existing admin panel.

| Role | Description | Permissions |
|:---|:---|:---|
| **Guest** | Any anonymous user visiting the public website. | Read-only access to all public-facing pages and content. Can interact with the hero component. |
| **Administrator** | A logged-in school staff member with full privileges. | Full CRUD access to all existing modules (Teachers, Achievements, etc.) and the new Dynamic Site Content Manager. Can modify navigation, page section content, and site-wide settings. |

## Functional Requirements

**User-Facing (Public Website)**

*   **FR-01: Interactive Hero Section Component**
    *   The static image on the homepage hero section will be replaced with an interactive card stack component.
    *   On desktop, hovering over the component will trigger animations, revealing a stack of cards with images and brief informational text.
    *   The interaction model is `hover_info_cards`: cards animate and separate on hover, displaying distinct content on each.
    *   On touch devices (tablet/mobile), the interaction will be triggered by a tap.
    *   Animations must be smooth (target 60 FPS) using hardware-accelerated CSS transforms.
    *   The component must be fully responsive, adapting its layout and interaction for desktop, tablet, and mobile breakpoints.

*   **FR-02: Dynamic Content Rendering**
    *   All content managed via the new Admin CMS must be fetched from the backend and rendered correctly on the public Next.js site.
    *   This includes navigation bar items, hero section text (title, subtitle), statistics counters, call-to-action button text/links, and content within other designated page sections.
    *   Content updates must be reflected on the public site immediately after an admin saves them, leveraging Next.js's data fetching strategies (e.g., ISR or SSR).

**Admin-Facing (Admin Panel)**

*   **FR-03: Dynamic Site Content Manager Dashboard**
    *   A new section, "Site Content," will be added to the `/admin` dashboard.
    *   This dashboard will provide a centralized interface for managing all dynamic content elements of the public website.

*   **FR-04: Navigation Management**
    *   Admins must be able to add, edit, delete, and reorder main navigation links (e.g., "Beranda", "Tentang").
    *   Admins must be able to edit the text and URL of the primary call-to-action button (e.g., "Daftar PPDB").
    *   Admins must be able to manage social media links displayed in the header/footer.
    *   The interface will support drag-and-drop for reordering.

*   **FR-05: Section Content Editor**
    *   The system will provide a form-based or live-preview interface for editing content blocks on a per-page, per-section basis.
    *   Admins can select a page and section (e.g., "Homepage Hero," "About Us Section") to edit its content.
    *   Editable fields will include plain text, numbers (for stats like "450 Siswa Aktif"), URLs, and image uploads.
    *   For rich text areas, a `TipTap` editor will be integrated to allow for basic formatting (bold, italics, lists).

*   **FR-06: Immediate Content Persistence**
    *   Upon clicking "Save" in the content editor, all changes must be persisted to the MySQL database via an API call to the Laravel backend.
    *   The system will provide immediate visual feedback (e.g., a success toast notification) confirming the save.

*   **FR-07: Section Visibility Control**
    *   Admins must have the ability to toggle the visibility of entire content sections on the public website with a single click (e.g., hide a promotional banner after a campaign ends).

## Non-Functional Requirements

| Category | Requirement |
|:---|:---|
| **Performance** | - **Homepage LCP:** < 2.5 seconds. - **Hero Animation:** Must maintain a consistent 60 FPS on modern browsers. - **Admin Panel Load:** < 3 seconds. - **API Response Time:** < 200ms for content retrieval APIs. |
| **Security** | - All admin panel endpoints must be protected by authentication and authorization middleware. - All user-submitted content from the CMS must be sanitized to prevent XSS attacks. - Implement CSRF protection on all forms in the admin panel. |
| **Scalability** | - The frontend on Vercel must handle traffic spikes without performance degradation. - The Laravel backend on Render must handle concurrent read/write operations from multiple admins. |
| **Usability** | - The Admin CMS must be intuitive for non-technical users. - The editing workflow should provide a live preview or a highly representative form to minimize errors. - All interactive elements must have clear affordances (e.g., hover states). |
| **Maintainability** | - Frontend components (especially the hero) and backend services must be modular and decoupled. - Code must adhere to established style guides for React/Laravel. - Environment variables must be used for all configuration and secrets. |

## Technology Stack & Rationale

| Component | Technology | Rationale |
|:---|:---|:---|
| Frontend | Next.js (React) | Provides high performance with SSR/SSG, optimal for a public-facing educational site. Excellent ecosystem and developer experience. Existing technology. |
| Styling | Tailwind CSS | Utility-first framework enables rapid, consistent UI development and easy implementation of the responsive design. Existing technology. |
| Backend API | Laravel (PHP) | Robust, secure, and scalable framework for building the REST API to serve content and handle admin actions. Existing technology. |
| Database | MySQL | Reliable, widely-supported relational database suitable for storing structured content from the CMS and existing application data. Existing technology. |
| Hosting | Vercel & Render | Vercel is optimized for Next.js deployments. Render provides a simple, scalable platform for the Laravel backend and MySQL database. Existing infrastructure. |
| Rich Text Editor | TipTap | A headless, framework-agnostic editor that provides a powerful and customizable rich text editing experience for the CMS without imposing its own styling. |

## Success Metrics & KPIs

| Metric | KPI | Target |
|:---|:---|:---|
| User Engagement | Decrease in Homepage Bounce Rate | > 15% reduction within 3 months post-launch. |
| User Engagement | Increase in Average Session Duration | > 20% increase within 3 months post-launch. |
| Operational Efficiency | Developer Requests for Content Updates | < 1 request per month (95%+ reduction). |
| Admin Adoption | Content Updates via CMS | > 5 updates per week made by administrators. |

## Risk Analysis & Mitigation

| Risk | Impact | Mitigation Strategy |
|:---|:---|:---|
| **Performance Degradation** | Complex hero animations cause jank and slow down the homepage, negatively impacting user experience and SEO. | **High** | Use hardware-accelerated CSS `transform` and `opacity`. Performance profile with Lighthouse/DevTools. Lazy-load off-screen images and assets. |
| **Poor Admin UX** | The CMS is confusing or difficult to use, leading to low adoption by school administrators and a return to developer-led updates. | **High** | Conduct usability testing with target admin users before launch. Implement a live preview feature to build user confidence. Provide simple documentation or a brief training session. |
| **Content Layout Breakage** | Admins enter content (e.g., very long text) that breaks the frontend UI layout. | **Medium** | Implement character limits on input fields. Use CSS properties like `text-overflow: ellipsis` and `overflow: hidden` to gracefully handle content overflow. The live preview should accurately reflect these constraints. |
| **Data Sync/Caching Issues** | Changes made in the admin panel do not appear on the live site due to aggressive caching. | **Medium** | Use Next.js Incremental Static Regeneration (ISR) with a short revalidation time or On-Demand Revalidation triggered by a webhook from the Laravel backend after a save operation. |

## Constraints & Assumptions

**Constraints:**
*   The project must use the existing technology stack: Next.js, Laravel, MySQL, and Tailwind CSS.
*   The new CMS functionality must be integrated into the existing `/admin` dashboard structure and authentication system.
*   The overall design aesthetic should be an evolution of the current site, not a complete visual overhaul.

**Assumptions:**
*   School administrators possess basic computer literacy and are capable of using a web-based form interface.
*   The existing hosting infrastructure on Vercel and Render is sufficient to support the new features.
*   Initial content for the dynamic sections will be populated manually by the admin team post-launch.

## Out of Scope

*   A full website redesign or re-branding.
*   Migration of existing hardcoded content into the new CMS.
*   Development of new top-level modules (e.g., Student Portal, E-learning Platform, PPDB Online Payment Gateway).
*   Advanced CMS features such as content versioning/history, multi-language support, or granular role-based access control (beyond the simple Admin role).
*   SEO optimization beyond performance improvements.