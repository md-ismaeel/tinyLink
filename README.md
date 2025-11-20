# 🔗 TinyLink - Modern URL Shortener

TinyLink is a fast, robust, and fully responsive URL shortening service built as a take-home assignment. It allows users to shorten long URLs, optionally use custom short codes, track click statistics, and manage their links through a clean dashboard.

## 🚀 Tech Stack

| Category      | Technology               | Description                                           |
| :------------ | :----------------------- | :---------------------------------------------------- |
| **Framework** | **Next.js** (App Router) | Modern React framework for full-stack development.    |
| **Styling**   | **Tailwind CSS**         | Utility-first CSS framework for rapid UI development. |
| **Database**  | **PostgreSQL** (Neon)    | Scalable, serverless relational database.             |

---

## ✨ Core Features & Functionality

### 1. Link Management

- **Create short links:** Convert long URLs into concise links with optional custom codes.
- **URL Validation:** Validates the URL format before saving.
- **Custom Code Validation:** Codes must follow the pattern `[A-Za-z0-9]{6,8}` and return a **409 Conflict** error if a code already exists.
- **Delete a link:** Users can delete existing links.

### 2. Redirection & Tracking

- **Redirect:** Visiting `/:code` performs an HTTP **302 Redirect** to the original URL.
- **Click Tracking:** Each redirect increments the **total-click count** and updates the **last clicked time**.
- **Post-Deletion:** After deletion, `/:code` must return a **404 Not Found**.

### 3. User Interface (UI/UX) 🖼️

The dashboard provides a clean, responsive interface to manage and view link statistics.

![TinyLink Dashboard Screenshot](/public/img/data-table.png "TinyLink Dashboard Screenshot")

form for generate short code for new link

![TinyLink Create Link Screenshot](/public/img/form.png "TinyLink Create Link Screenshot")

details for one link

![TinyLink Link Details Screenshot](/public/img/details.png "TinyLink Link Details Screenshot")

stats for one link

![TinyLink Stats Screenshot](/public/img/stats-card.png "TinyLink Stats Screenshot")


---

## 💻 API Endpoints (Required for Automated Testing)

The following stable URLs and API endpoints must be correctly implemented to pass automated tests:

### Stable Routes

| Purpose              | Path          | Method | Success Status                            |
| :------------------- | :------------ | :----- | :---------------------------------------- |
| **Dashboard** (List) | `/`           | GET    | 200                                       |
| **Stats Page**       | `/code/:code` | GET    | 200 (or 404)                              |
| **Redirect**         | `/:code`      | GET    | **302** (Redirect) or **404** (Not Found) |
| **Health Check**     | `/healthz`    | GET    | **200**                                   |

### API Endpoints

| Method   | Path               | Action             | Success Status       | Conflict/Error Status            |
| :------- | :----------------- | :----------------- | :------------------- | :------------------------------- |
| `POST`   | `/api/links`       | Create a new link  | `201 Created`        | **`409 Conflict`** (Code Exists) |
| `GET`    | `/api/links`       | List all links     | `200 OK`             | -                                |
| `GET`    | `/api/links/:code` | Stats for one code | `200 OK`             | `404 Not Found`                  |
| `DELETE` | `/api/links/:code` | Delete link        | **`204 No Content`** | `404 Not Found`                  |

### Health Check Response

The `/healthz` endpoint must return the following JSON structure:

```json
{
  "ok": true,
  "version": "1.0"
}
```

### Project Setup and Running Locally

#### Prerequisites

1.  Node.js (LTS recommended)
2.  A PostgreSQL instance (A free instance from Neon is recommended)

```json
  {
    # Clone the repository
    git clone <YOUR_REPOSITORY_URL>
    cd tiny-link

    # Install dependencies
    npm install
  }
```

### Enviroment Variables

```json
{
  # Database Configuration
  # ------------------------------------
  # Connection string for Neon Postgres
  DATABASE_URL=""

  # ------------------------------------
  # Application Configuration
  # ------------------------------------
  # Base URL for generating short links (e.g., http://localhost:3000)
  NEXT_PUBLIC_APP_URL=""
}
```

### Running the Application Locally

```json
{
  # Start the development server
  npm run dev
}
```
