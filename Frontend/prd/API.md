# API.md: LT3 MEDIA TJKT Dynamic Web & Admin Revamp

## Authentication & Authorization

The API utilizes token-based authentication for administrative endpoints. Public-facing content retrieval endpoints do not require authentication.

*   **Method:** Bearer Token
*   **Header Format:** `Authorization: Bearer {YOUR_AUTH_TOKEN}`
*   **Token Acquisition:** Admin users obtain a token upon successful login to the `/admin` panel, typically via a dedicated login endpoint (not detailed here as it's standard boilerplate). This token should be securely stored (e.g., in `localStorage` or `httpOnly` cookies) and sent with all subsequent authenticated requests.

## Standard Response & Pagination Formats

All API responses will adhere to a consistent JSON structure.

### Success Response

```json
{
  "success": true,
  "data": {
    // Primary response data
  },
  "message": "Optional success message"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "A unique error code (e.g., VALIDATION_ERROR, NOT_FOUND)",
    "message": "A human-readable error description",
    "details": {
      // Optional: specific validation errors, e.g., field-level messages
    }
  }
}
```

### Pagination Format

For endpoints returning collections of resources, pagination metadata will be included.

```json
{
  "success": true,
  "data": [
    // Array of resource objects
  ],
  "meta": {
    "total": 100,
    "per_page": 10,
    "current_page": 1,
    "last_page": 10,
    "from": 1,
    "to": 10,
    "path": "/api/v1/resources"
  }
}
```

## API Endpoints

### 1. Retrieve Page Content

Retrieves all dynamic content blocks associated with a specific page slug for public display.

*   **Method:** `GET`
*   **Path:** `/api/v1/content/{pageSlug}`
*   **Description:** Fetches an array of content blocks (e.g., hero title, subtitle, statistics, images) for a given page (e.g., `homepage`, `about-us`).
*   **Auth Level:** Public (No authentication required)
*   **Request Body:** None
*   **Response Body (JSON):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": 1,
          "page_slug": "homepage",
          "section_identifier": "hero_title",
          "type": "text",
          "value": "Selamat Datang di LT3 MEDIA TJKT",
          "image_url": null,
          "link_url": null,
          "is_visible": true,
          "order": 1
        },
        {
          "id": 2,
          "page_slug": "homepage",
          "section_identifier": "hero_subtitle",
          "type": "text",
          "value": "Mencetak Generasi Unggul di Bidang Teknologi Informasi",
          "image_url": null,
          "link_url": null,
          "is_visible": true,
          "order": 2
        },
        {
          "id": 3,
          "page_slug": "homepage",
          "section_identifier": "stats_siswa_aktif",
          "type": "number",
          "value": "450",
          "image_url": null,
          "link_url": null,
          "is_visible": true,
          "order": 3
        },
        {
          "id": 4,
          "page_slug": "homepage",
          "section_identifier": "hero_cta_button",
          "type": "button",
          "value": "Daftar PPDB",
          "image_url": null,
          "link_url": "/ppdb",
          "is_visible": true,
          "order": 4
        }
      ]
    }
    ```
*   **Status Codes:**
    *   `200 OK`: Content successfully retrieved.
    *   `404 Not Found`: Page slug does not exist.

### 2. Update Content Block

Updates a specific dynamic content block by its ID.

*   **Method:** `PUT`
*   **Path:** `/api/v1/admin/content/{contentId}`
*   **Description:** Allows administrators to modify the value, type, image URL, link URL, or visibility of a single content block.
*   **Auth Level:** Admin (Requires `Authorization` header)
*   **Request Body (JSON):**
    ```json
    {
      "value": "New title for the hero section",
      "type": "text",
      "image_url": null,
      "link_url": null,
      "is_visible": true,
      "order": 1
    }
    ```
*   **Response Body (JSON):**
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "page_slug": "homepage",
        "section_identifier": "hero_title",
        "type": "text",
        "value": "New title for the hero section",
        "image_url": null,
        "link_url": null,
        "is_visible": true,
        "order": 1
      },
      "message": "Content block updated successfully."
    }
    ```
*   **Status Codes:**
    *   `200 OK`: Content block updated.
    *   `401 Unauthorized`: Missing or invalid authentication token.
    *   `403 Forbidden`: Authenticated user does not have permission.
    *   `404 Not Found`: Content block ID does not exist.
    *   `422 Unprocessable Entity`: Validation error (e.g., missing required fields).

### 3. Retrieve Navigation Items

Retrieves all navigation items, including main menu links, CTA buttons, and social media links.

*   **Method:** `GET`
*   **Path:** `/api/v1/navigation`
*   **Description:** Fetches the structured list of navigation items for rendering the website's menu, action buttons, and social links.
*   **Auth Level:** Public (No authentication required)
*   **Request Body:** None
*   **Response Body (JSON):**
    ```json
    {
      "success": true,
      "data": {
        "main_menu": [
          {"id": 1, "label": "Beranda", "url": "/", "order": 1, "is_visible": true},
          {"id": 2, "label": "Tentang", "url": "/tentang", "order": 2, "is_visible": true},
          {"id": 3, "label": "Kompetensi", "url": "/kompetensi", "order": 3, "is_visible": true}
        ],
        "action_button": {
          "id": 10,
          "label": "Daftar PPDB",
          "url": "/ppdb",
          "is_visible": true
        },
        "social_links": [
          {"id": 20, "platform": "facebook", "url": "https://facebook.com/lt3media", "icon_class": "fab fa-facebook", "is_visible": true},
          {"id": 21, "platform": "instagram", "url": "https://instagram.com/lt3media", "icon_class": "fab fa-instagram", "is_visible": true}
        ]
      }
    }
    ```
*   **Status Codes:**
    *   `200 OK`: Navigation items successfully retrieved.

### 4. Update Navigation Structure

Updates the entire navigation structure, including main menu items, action button, and social links.

*   **Method:** `PUT`
*   **Path:** `/api/v1/admin/navigation`
*   **Description:** Allows administrators to add, edit, remove, and reorder navigation items. The request body represents the complete desired state of the navigation.
*   **Auth Level:** Admin (Requires `Authorization` header)
*   **Request Body (JSON):**
    ```json
    {
      "main_menu": [
        {"id": 1, "label": "Beranda", "url": "/", "order": 1, "is_visible": true},
        {"id": 2, "label": "Tentang Kami", "url": "/tentang-kami", "order": 2, "is_visible": true},
        {"label": "Galeri Baru", "url": "/galeri-baru", "order": 4, "is_visible": true} // New item
      ],
      "action_button": {
        "id": 10,
        "label": "Daftar Sekarang!",
        "url": "/ppdb-form",
        "is_visible": true
      },
      "social_links": [
        {"id": 20, "platform": "facebook", "url": "https://facebook.com/lt3media", "icon_class": "fab fa-facebook", "is_visible": true}
      ]
    }
    ```
*   **Response Body (JSON):**
    ```json
    {
      "success": true,
      "data": {
        // Returns the updated navigation structure, similar to GET response
      },
      "message": "Navigation structure updated successfully."
    }
    ```
*   **Status Codes:**
    *   `200 OK`: Navigation structure updated.
    *   `401 Unauthorized`: Missing or invalid authentication token.
    *   `403 Forbidden`: Authenticated user does not have permission.
    *   `422 Unprocessable Entity`: Validation error (e.g., invalid URL format).

### 5. Toggle Content Section Visibility

Toggles the `is_visible` status of a specific content block.

*   **Method:** `PUT`
*   **Path:** `/api/v1/admin/content/{contentId}/visibility`
*   **Description:** Sets the visibility status of a content block on the public website.
*   **Auth Level:** Admin (Requires `Authorization` header)
*   **Request Body (JSON):**
    ```json
    {
      "is_visible": false
    }
    ```
*   **Response Body (JSON):**
    ```json
    {
      "success": true,
      "data": {
        "id": 1,
        "page_slug": "homepage",
        "section_identifier": "hero_title",
        "type": "text",
        "value": "Selamat Datang di LT3 MEDIA TJKT",
        "image_url": null,
        "link_url": null,
        "is_visible": false,
        "order": 1
      },
      "message": "Content block visibility updated successfully."
    }
    ```
*   **Status Codes:**
    *   `200 OK`: Visibility updated.
    *   `401 Unauthorized`: Missing or invalid authentication token.
    *   `403 Forbidden`: Authenticated user does not have permission.
    *   `404 Not Found`: Content block ID does not exist.
    *   `422 Unprocessable Entity`: Validation error (e.g., `is_visible` is not a boolean).