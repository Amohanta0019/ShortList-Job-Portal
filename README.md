# Shortlist: Job Portal

A modern job portal with a **React (Vite)** frontend and a **Spring Boot** backend running on **Tomcat**. Users can browse and search jobs, post new jobs, edit or delete them, and bookmark the ones they like.

## Features

- **Home page** with a hero search bar, live search as you type, job type filters and sorting
- **Post a job** form with validation
- **Edit job** using the same form, pre-filled
- **Job details** page with Apply by email, Save, Edit and Delete (with a confirmation dialog)
- **Saved jobs** page for bookmarked jobs (stored in the browser)
- Loading placeholders, empty and error states, toast messages, and a mobile-friendly layout
- **Demo mode** with built-in sample data, so the UI runs without a backend

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router 6, Vite 5, lucide-react icons, plain CSS |
| Backend | Spring Boot, Spring Data JPA, Tomcat (embedded) |
| Database | Any JPA-supported database (MySQL, PostgreSQL, H2) |

## Project structure

```
job-portal-ui/
├── index.html
├── vite.config.js        # dev server and /api proxy to Spring Boot
├── .env                  # VITE_USE_MOCK switch
├── package.json
└── src/
    ├── main.jsx          # app entry, router
    ├── App.jsx           # layout, navigation, routes
    ├── api.js            # all backend calls (and demo data)
    ├── context.jsx       # toast messages and saved jobs
    ├── styles.css
    ├── components/
    │   └── JobRow.jsx    # one job in the list
    └── pages/
        ├── Home.jsx      # search, filters, job list
        ├── JobDetails.jsx
        ├── JobForm.jsx   # add and edit
        └── Saved.jsx
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- Java 17 or newer and Maven (for the backend)

### 1. Run the frontend

```bash
npm install
npm run dev
```

Open http://localhost:5173.

### 2. Demo mode vs. real backend

The `.env` file controls where data comes from:

```env
VITE_USE_MOCK=true    # sample data kept in browser memory (resets on refresh)
VITE_USE_MOCK=false   # calls your Spring Boot API
```

Restart `npm run dev` after changing `.env`, because Vite only reads it at startup.

### 3. Run the backend

Start the Spring Boot app (default port **8080**). In development, Vite forwards every `/api/*` request to `http://localhost:8080`, so you don't need to configure CORS. If your port or context path differs, edit the `target` in `vite.config.js`.

## API reference

| Method | URL | Description | Success response |
|---|---|---|---|
| GET | `/api/jobs` | List all jobs | 200, array of jobs |
| GET | `/api/jobs/search?keyword=java` | Search jobs | 200, array of jobs |
| GET | `/api/jobs/{id}` | Get one job | 200, job (404 if missing) |
| POST | `/api/jobs` | Create a job | 201, created job |
| PUT | `/api/jobs/{id}` | Update a job | 200, updated job |
| DELETE | `/api/jobs/{id}` | Delete a job | 204, no body |

### Job JSON

```json
{
  "id": 1,
  "title": "Senior Java Developer",
  "company": "Northwind Systems",
  "location": "Kolkata",
  "jobType": "Full-time",
  "experience": "5+ years",
  "salary": "₹18–26 LPA",
  "skills": ["Java", "Spring Boot", "PostgreSQL"],
  "contactEmail": "hr@northwind.example",
  "description": "What the role involves.",
  "postedDate": "2026-10-08"
}
```

`jobType` is one of `Full-time`, `Part-time`, `Contract`, `Internship`, `Remote`. `skills` can be a list or a comma-separated string. `experience` must be text, not a number.

### Error messages

The UI shows the `message` field of error responses. Add this to `application.properties` so Spring includes it:

```properties
server.error.include-message=always
```

## Backend setup

### Entity

Use wrapper types (`Integer`, not `int`) so `null` values don't break JSON parsing. `@JsonProperty` maps your Java field names to the names the UI uses.

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

    // no-args constructor, getters and setters (or Lombok @Data @NoArgsConstructor)
}
```

### Controller outline

```java
@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @GetMapping                       // list
    @GetMapping("/search")            // ?keyword=
    @GetMapping("/{id}")              // one
    @PostMapping                      // create (201)
    @PutMapping("/{id}")              // update
    @DeleteMapping("/{id}")           // delete (204)
}
```

### application.properties

```properties
server.port=8080
spring.jpa.hibernate.ddl-auto=update
server.error.include-message=always
```

### Sample data

Seed sample jobs once at startup with a `CommandLineRunner` that runs only when the table is empty. Don't re-seed inside `getAllJobs()`, or deleted jobs will keep coming back.

## CORS and production

- **Development:** the Vite proxy handles CORS. Nothing to do.
- **Frontend served separately:** add `@CrossOrigin(origins = "http://your-frontend-url")` to the controller, or a global `WebMvcConfigurer` CORS mapping for `/api/**`, and set `VITE_API_URL` to the full backend URL (for example `http://localhost:8080/api`) before building.
- **Frontend served by Tomcat:**
  1. Run `npm run build`.
  2. Copy the contents of `dist/` into Spring Boot's `src/main/resources/static/`.
  3. Add a forwarding rule so refreshing on `/jobs/3` returns `index.html`.

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Jobs added in the UI vanish after refresh | `VITE_USE_MOCK` is still `true`. Set it to `false` and restart Vite. |
| "Couldn't load jobs" on the home page | Backend isn't running, or the port in `vite.config.js` is wrong. |
| `Cannot map null into type int` in the server log | Entity uses primitive `int`. Switch to `Integer`, and make `reqExperience` a `String`. |
| `s is not iterable` in the browser console | A job has a `null` company. Clear old rows, or make sure `normalize` in `api.js` fills in defaults. |
| 404 on `/api/jobs/{id}` | `@PathVariable` name doesn't match the URL placeholder. Use `@PathVariable("id")`. |
| 403 or CORS error in the browser | Use `npm run dev` with the proxy, or enable CORS on the backend. |
| Old rows show "Unknown company" | They were created before the new columns existed. Delete them and let the seeder re-run. |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server at http://localhost:5173 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## License

Free to use and modify for learning and personal projects.
