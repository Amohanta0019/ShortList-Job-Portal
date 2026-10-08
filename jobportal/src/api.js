/**
 * API layer. Expected Spring Boot endpoints:
 *   GET    /api/jobs                    -> Job[]
 *   GET    /api/jobs/search?keyword=x   -> Job[]
 *   GET    /api/jobs/{id}               -> Job
 *   POST   /api/jobs                    -> Job (created)
 *   PUT    /api/jobs/{id}               -> Job (updated)
 *   DELETE /api/jobs/{id}               -> 204
 *
 * Job: { id, title, company, location, jobType, experience, salary,
 *        skills (string[] or "a,b,c"), contactEmail, description, postedDate }
 */

const BASE = import.meta.env.VITE_API_URL ?? "/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const normalize = (j = {}) => {
  const skills = j.skills ?? j.postTechStack ?? [];
  return {
    ...j,
    id: j.id ?? j.postId,
    title: j.title ?? j.postProfile ?? "Untitled job",
    description: j.description ?? j.postDesc ?? "",
    experience: j.experience ?? j.reqExperience ?? "",
    company: j.company ?? "Unknown company",
    location: j.location ?? "Not specified",
    jobType: j.jobType ?? "Full-time",
    salary: j.salary ?? "",
    contactEmail: j.contactEmail ?? "",
    postedDate: j.postedDate ?? null,
    skills: Array.isArray(skills)
      ? skills
      : String(skills)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
  };
};

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    let msg;
    try {
      msg = (await res.json()).message;
    } catch {
      /* no body */
    }
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

/* ---------- sample data for running without a backend ---------- */
const today = (d = 0) =>
  new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);
let mock = [
  {
    id: 1,
    title: "Senior Java Developer",
    company: "Northwind Systems",
    location: "Kolkata",
    jobType: "Full-time",
    experience: "5+ years",
    salary: "₹18–26 LPA",
    skills: ["Java", "Spring Boot", "Kafka", "PostgreSQL"],
    contactEmail: "hr@northwind.example",
    postedDate: today(1),
    description:
      "Own the design of our payments services.\n\nYou will build REST APIs with Spring Boot, mentor two junior developers and take part in on-call rotation.",
  },
  {
    id: 2,
    title: "React Frontend Engineer",
    company: "Lumen Labs",
    location: "Remote",
    jobType: "Remote",
    experience: "3+ years",
    salary: "₹14–20 LPA",
    skills: ["React", "TypeScript", "Vite", "Testing"],
    contactEmail: "jobs@lumen.example",
    postedDate: today(2),
    description:
      "Build the customer dashboard used by 40k teams.\n\nWe care about accessible, fast interfaces and well-tested components.",
  },
  {
    id: 3,
    title: "QA Automation Engineer",
    company: "Paperboat",
    location: "Bengaluru",
    jobType: "Contract",
    experience: "2+ years",
    salary: "₹8–12 LPA",
    skills: ["Selenium", "Java", "CI/CD"],
    contactEmail: "qa@paperboat.example",
    postedDate: today(5),
    description:
      "6-month contract, extendable. Write and maintain end-to-end suites for our booking platform.",
  },
  {
    id: 4,
    title: "Backend Intern",
    company: "Tidewater",
    location: "Kolkata",
    jobType: "Internship",
    experience: "Fresher",
    salary: "₹25k / month",
    skills: ["Java", "SQL", "Git"],
    contactEmail: "campus@tidewater.example",
    postedDate: today(7),
    description:
      "Work alongside our platform team for 3 months and ship your first production feature.",
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "Orchard Analytics",
    location: "Pune",
    jobType: "Part-time",
    experience: "1+ years",
    salary: "₹6–9 LPA",
    skills: ["SQL", "Power BI", "Excel"],
    contactEmail: "people@orchard.example",
    postedDate: today(9),
    description:
      "Part-time (20 hrs/week) role supporting retail clients with weekly reporting and ad-hoc analysis.",
  },
];
const wait = (v) => new Promise((r) => setTimeout(() => r(v), 350));
const toPayload = (j) => {
  const body = {
    title: j.title,
    company: j.company,
    location: j.location,
    jobType: j.jobType,
    experience: j.experience ?? "",
    salary: j.salary ?? "",
    skills: j.skills ?? [],
    contactEmail: j.contactEmail ?? "",
    description: j.description ?? "",
  };
  if (j.id != null) body.id = j.id;
  if (j.postedDate) body.postedDate = j.postedDate;
  return body;
};

/* ---------- public API ---------- */
export async function getJobs() {
  if (USE_MOCK) return wait(mock.map(normalize));
  return (await req("/jobs")).map(normalize);
}
export async function searchJobs(keyword) {
  if (!keyword.trim()) return getJobs();
  if (USE_MOCK) {
    const k = keyword.toLowerCase();
    return wait(
      mock
        .filter((j) =>
          [j.title, j.company, j.location, j.skills.join(" "), j.description]
            .join(" ")
            .toLowerCase()
            .includes(k),
        )
        .map(normalize),
    );
  }
  return (await req(`/jobs/search?keyword=${encodeURIComponent(keyword)}`)).map(
    normalize,
  );
}
export async function getJob(id) {
  if (USE_MOCK) {
    const j = mock.find((x) => x.id === Number(id));
    if (!j) throw new Error("This job no longer exists.");
    return wait(normalize(j));
  }
  return normalize(await req(`/jobs/${id}`));
}
export async function createJob(job) {
  if (USE_MOCK) {
    const created = { ...job, id: Date.now(), postedDate: today() };
    mock = [created, ...mock];
    return normalize(
      await req("/jobs", {
        method: "POST",
        body: JSON.stringify(toPayload(job)),
      }),
    );
  }
  return normalize(
    await req("/jobs", { method: "POST", body: JSON.stringify(job) }),
  );
}
export async function updateJob(id, job) {
  if (USE_MOCK) {
    mock = mock.map((j) =>
      j.id === Number(id) ? { ...j, ...job, id: j.id } : j,
    );
    return normalize(
      await req(`/jobs/${id}`, {
        method: "PUT",
        body: JSON.stringify(toPayload({ ...job, id: Number(id) })),
      }),
    );
  }
  return normalize(
    await req(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(job) }),
  );
}
export async function deleteJob(id) {
  if (USE_MOCK) {
    mock = mock.filter((j) => j.id !== Number(id));
    return wait(null);
  }
  return req(`/jobs/${id}`, { method: "DELETE" });
}
