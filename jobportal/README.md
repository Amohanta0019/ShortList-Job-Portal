# Shortlist – Job portal UI (React + Vite)

## Run
```bash
npm install
npm run dev        # http://localhost:5173
```
It starts with built-in sample data (`VITE_USE_MOCK=true` in `.env`).
When your Spring Boot API is ready, set `VITE_USE_MOCK=false` and restart.
Vite proxies `/api/*` to `http://localhost:8080` (edit `vite.config.js` if your port/context path differs).

## Pages
- `/` home: hero search (debounced), type filter, sorting, job list
- `/jobs/new` add job · `/jobs/:id` details + delete · `/jobs/:id/edit` edit job
- `/saved` bookmarked jobs (stored in the browser)

## Endpoints the UI calls
| Method | URL | Purpose |
|---|---|---|
| GET | /api/jobs | list all |
| GET | /api/jobs/search?keyword=java | search |
| GET | /api/jobs/{id} | one job |
| POST | /api/jobs | create |
| PUT | /api/jobs/{id} | update |
| DELETE | /api/jobs/{id} | delete (204) |

JSON shape: `id, title, company, location, jobType, experience, salary, skills (string[]), contactEmail, description, postedDate (yyyy-MM-dd)`.
If your entity stores skills as one comma-separated String, that works too – the UI converts it when reading.

## Spring Boot side (suggested)
```java
@Entity
public class Job {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  private String title, company, location, jobType, experience, salary, contactEmail;
  @ElementCollection private List<String> skills;
  @Column(length = 4000) private String description;
  private LocalDate postedDate = LocalDate.now();
  // getters/setters
}

// Repository
List<Job> findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCaseOrLocationContainingIgnoreCase(String t, String c, String l);

// Controller
@RestController @RequestMapping("/api/jobs")
public class JobController { /* GET, GET /search, GET /{id}, POST, PUT, DELETE */ }
```
Without the Vite proxy (e.g. production on Tomcat), enable CORS:
```java
@Bean WebMvcConfigurer cors() {
  return new WebMvcConfigurer() {
    public void addCorsMappings(CorsRegistry r) {
      r.addMapping("/api/**").allowedOrigins("http://localhost:5173").allowedMethods("GET","POST","PUT","DELETE");
    }
  };
}
```
To serve the UI from Tomcat itself: `npm run build`, then copy `dist/` into Spring Boot's `src/main/resources/static/` and set `VITE_API_URL=/api`.
