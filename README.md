# 🚀 ShortList-Job Portal

A modern full-stack **Job Portal** built with **React (Vite)** and **Spring Boot**. The application allows users to discover jobs, search and filter listings, create and manage job posts, and save interesting opportunities for later.

The frontend communicates with a Spring Boot REST API and can also run independently in **Demo Mode** with built-in sample data.

---

## ✨ Features

### 🔎 Job Discovery
- Browse all available job listings
- Search jobs by keyword
- Live search as you type
- Filter jobs by job type
- Sort job listings
- Responsive job-listing interface

### 📝 Job Management
- Create a new job post with form validation
- Edit existing job posts using the same form
- View complete job details
- Delete jobs with a confirmation dialog
- Apply to jobs using the listed contact email

### ⭐ Saved Jobs
- Bookmark jobs you are interested in
- View all saved jobs from a dedicated page
- Saved jobs are stored in the browser

### 🎨 User Experience
- Responsive and mobile-friendly layout
- Loading placeholders
- Empty states
- Error states
- Toast notifications
- Clean navigation and reusable components

### 🧪 Demo Mode
- Run the frontend without a backend
- Uses built-in sample job data
- Useful for UI development and demonstrations
- Demo data is kept in browser memory and resets after refresh

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Vite 5 |
| UI | Plain CSS, Lucide React Icons |
| Backend | Spring Boot, Spring Data JPA |
| Server | Embedded Tomcat |
| Database | MySQL / PostgreSQL / H2 or any JPA-supported database |
| API | REST |
| Build Tools | npm, Maven |
| Language | Java, JavaScript |

---

## 📁 Project Structure

```text
job-portal/
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── .env
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── context.jsx
│       ├── styles.css
│       │
│       ├── components/
│       │   └── JobRow.jsx
│       │
│       └── pages/
│           ├── Home.jsx
│           ├── JobDetails.jsx
│           ├── JobForm.jsx
│           └── Saved.jsx
│
└── backend/
    └── Spring Boot application
```

> The exact backend package structure may vary depending on your Spring Boot project organization.

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

- **Node.js 18+**
- **Java 17+**
- **Maven**
- A database supported by Spring Data JPA, if using the real backend
- Git (recommended)

You can verify your installations with:

```bash
node --version
npm --version
java --version
mvn --version
```

---

# 💻 Frontend Setup

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-directory>
```

If the frontend is in a separate directory:

```bash
cd frontend
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Start the Development Server

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🧪 Demo Mode vs Real Backend

The frontend supports two modes through the `.env` file.

### Demo Mode

```env
VITE_USE_MOCK=true
```

This uses built-in sample data and does not require the Spring Boot backend.

### Real Backend Mode

```env
VITE_USE_MOCK=false
```

This makes the frontend call the Spring Boot REST API.

> **Important:** Restart the Vite development server after changing `.env`, because Vite reads environment variables when the development server starts.

---

# ☕ Backend Setup

## 1. Start the Spring Boot Application

Run the backend using your IDE or Maven:

```bash
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

The frontend's Vite development proxy forwards requests beginning with `/api` to the Spring Boot server.

For example:

```text
Frontend
   │
   │ GET /api/jobs
   ▼
Vite Proxy
   │
   │ forwards request
   ▼
Spring Boot
   │
   ▼
Database
```

This means you normally do **not** need to configure CORS during local development.

---

# 🗄️ Database Configuration

Configure your database connection in:

```text
src/main/resources/application.properties
```

Example:

```properties
server.port=8080

spring.jpa.hibernate.ddl-auto=update
server.error.include-message=always
```

For a MySQL database, your configuration can follow this pattern:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/jobportal
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
server.error.include-message=always
```

> Replace the database name, username, and password with your local configuration.

---

# 🔌 REST API

The backend exposes the following endpoints:

| Method | Endpoint | Description | Response |
|---|---|---|---|
| `GET` | `/api/jobs` | Get all jobs | `200 OK` |
| `GET` | `/api/jobs/search?keyword=java` | Search jobs | `200 OK` |
| `GET` | `/api/jobs/{id}` | Get a job by ID | `200 OK` / `404` |
| `POST` | `/api/jobs` | Create a job | `201 Created` |
| `PUT` | `/api/jobs/{id}` | Update a job | `200 OK` |
| `DELETE` | `/api/jobs/{id}` | Delete a job | `204 No Content` |

### Example Requests

Get all jobs:

```http
GET http://localhost:8080/api/jobs
```

Search for Java jobs:

```http
GET http://localhost:8080/api/jobs/search?keyword=java
```

Get a specific job:

```http
GET http://localhost:8080/api/jobs/1
```

---

# 📦 Job JSON Structure

Example job object:

```json
{
  "id": 1,
  "title": "Senior Java Developer",
  "company": "Northwind Systems",
  "location": "Kolkata",
  "jobType": "Full-time",
  "experience": "5+ years",
  "salary": "₹18–26 LPA",
  "skills": [
    "Java",
    "Spring Boot",
    "PostgreSQL"
  ],
  "contactEmail": "hr@northwind.example",
  "description": "What the role involves.",
  "postedDate": "2026-10-08"
}
```

### Field Description

| Field | Description |
|---|---|
| `id` | Unique job identifier |
| `title` | Job title |
| `company` | Hiring company |
| `location` | Job location |
| `jobType` | Employment type |
| `experience` | Required experience |
| `salary` | Salary information |
| `skills` | Required technical skills |
| `contactEmail` | Application/contact email |
| `description` | Job description |
| `postedDate` | Date the job was posted |

Supported `jobType` values:

```text
Full-time
Part-time
Contract
Internship
Remote
```

`skills` can be represented as a list or as a comma-separated value depending on the frontend/backend normalization.

---

# 🏗️ Backend Model

The frontend expects the following logical job structure.

A corresponding Spring Boot entity can be implemented as:

```java
@Entity
public class JobPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Integer postId;

    @JsonProperty("title")
    private String postProfile;

    @JsonProperty("description")
    @Column(length = 4000)
    private String postDesc;

    @JsonProperty("experience")
    private String reqExperience;

    @JsonProperty("skills")
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> postTechStack;

    private String company;
    private String location;
    private String jobType;
    private String salary;
    private String contactEmail;

    private LocalDate postedDate = LocalDate.now();

    // No-args constructor
    // Getters and setters
}
```

### Why `Integer` instead of `int`?

The ID should use the wrapper type:

```java
Integer
```

rather than:

```java
int
```

This allows the value to be `null` when an entity has not yet been persisted and avoids JSON mapping problems such as:

```text
Cannot map null into type int
```

Similarly, `experience` is represented as text because values such as:

```text
Fresher
1-2 years
5+ years
```

cannot be represented correctly by a numeric type.

---

# 🎯 Controller Structure

The REST controller follows this structure:

```java
@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @GetMapping
    // Get all jobs

    @GetMapping("/search")
    // Search jobs using ?keyword=

    @GetMapping("/{id}")
    // Get one job

    @PostMapping
    // Create a job

    @PutMapping("/{id}")
    // Update a job

    @DeleteMapping("/{id}")
    // Delete a job
}
```

For path-based endpoints, make sure the `@PathVariable` name matches the URL placeholder:

```java
@GetMapping("/{id}")
public JobPost getJob(@PathVariable("id") Integer id) {
    // ...
}
```

---

# 🌱 Sample Data

Sample jobs can be inserted using a `CommandLineRunner`.

The recommended approach is to seed data **only when the database table is empty**.

This prevents deleted jobs from being inserted again every time the application starts or every time `getAllJobs()` is called.

Conceptually:

```text
Application starts
       │
       ▼
Is the job table empty?
       │
   ┌───┴───┐
   │       │
  YES      NO
   │       │
Seed data  Do nothing
```

---

# 🌐 CORS & Production

## Development

When using:

```bash
npm run dev
```

the Vite proxy forwards `/api/*` requests to Spring Boot.

Therefore, CORS configuration is normally unnecessary for local development.

## Separate Frontend and Backend

If the frontend and backend are deployed separately, configure CORS on the backend.

For example:

```java
@CrossOrigin(origins = "http://your-frontend-url")
```

Alternatively, configure CORS globally using `WebMvcConfigurer`.

The frontend can then use a full backend URL such as:

```env
VITE_API_URL=http://localhost:8080/api
```

## Serving React Through Spring Boot

For a single-deployment setup:

1. Build the React application:

```bash
npm run build
```

2. This generates:

```text
dist/
```

3. Copy the contents of `dist/` into:

```text
src/main/resources/static/
```

4. Configure SPA forwarding so routes such as:

```text
/jobs/3
```

return:

```text
index.html
```

instead of a server-side 404.

---

# 🐛 Troubleshooting

| Problem | Possible Cause | Solution |
|---|---|---|
| Jobs disappear after refresh | Mock mode is enabled | Set `VITE_USE_MOCK=false` and restart Vite |
| "Couldn't load jobs" | Backend is not running | Start Spring Boot and verify port `8080` |
| Backend connection fails | Incorrect proxy target | Check `vite.config.js` |
| `Cannot map null into type int` | Primitive `int` used for nullable ID | Change `int` to `Integer` |
| `s is not iterable` | Job contains unexpected/null data | Normalize the response in `api.js` |
| `404` on `/api/jobs/{id}` | Incorrect `@PathVariable` mapping | Use `@PathVariable("id")` |
| CORS/403 error | Frontend and backend are not correctly connected | Use the Vite proxy or configure backend CORS |
| Old jobs show `Unknown company` | Existing rows predate new fields | Remove old rows and allow the updated schema/data to be recreated |

---

# 📜 Available Scripts

Run these commands from the frontend directory.

| Command | Description |
|---|---|
| `npm install` | Install project dependencies |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |

---

# 🔄 Application Flow

The main application flow is:

```text
                ┌──────────────────┐
                │   React Frontend │
                └────────┬─────────┘
                         │
                         │ REST API
                         ▼
                ┌──────────────────┐
                │  Spring Boot API │
                └────────┬─────────┘
                         │
                         │ JPA
                         ▼
                ┌──────────────────┐
                │     Database     │
                └──────────────────┘
```

### Typical Job Search Flow

```text
User enters keyword
        ↓
React search component
        ↓
GET /api/jobs/search?keyword=...
        ↓
Spring Boot Controller
        ↓
Repository / JPA
        ↓
Database
        ↓
JSON response
        ↓
React displays matching jobs
```

---

# 📌 Important Notes

- The frontend uses `/api` as the API prefix.
- Vite development mode expects Spring Boot to run on port `8080`.
- Mock data is temporary and resets when the browser session is refreshed.
- Real job persistence requires the Spring Boot backend and a configured database.
- `server.error.include-message=always` allows the UI to receive useful backend error messages during development.
- Do not commit real database passwords or other secrets to Git.

---

# 🔮 Possible Future Improvements

The current application provides the core job-portal functionality. Possible future enhancements include:

- 🔐 User authentication and authorization
- 👤 Candidate and recruiter profiles
- 📄 Resume upload
- 📊 Recruiter dashboard
- ❤️ Persistent saved jobs per user
- 📩 Application tracking
- 🔔 Job alerts and notifications
- 🏷️ Advanced filtering by salary, location, experience, and skills
- ☁️ Cloud deployment
- 🧪 Automated frontend and backend testing
- 🔍 Improved full-text job search
- 🛡️ Role-based access control

---

# 📄 License

Free to use and modify for **learning and personal projects**.

---

## 👨‍💻 Project

**ShortList-Job Portal** — a full-stack application demonstrating how a React frontend can interact with a Spring Boot REST API and JPA-backed database.

Built for learning, experimentation, and portfolio development.
