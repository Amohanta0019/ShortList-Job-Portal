package com.telusko.JobApp.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.telusko.JobApp.Model.JobPost;
import com.telusko.JobApp.repository.JobRepo;

@Service
public class JobService {

    @Autowired
    private JobRepo repo;

    @Transactional(readOnly = true)
    public List<JobPost> getAllJobs() {
        return repo.findAll();
    }

    @Transactional(readOnly = true)
    public JobPost getJob(int postId) {
        return repo.findById(postId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job " + postId + " was not found."));
    }

    @Transactional
    public JobPost addJob(JobPost jobPost) {
        jobPost.setPostId(null); // force an insert, never an overwrite
        if (jobPost.getPostedDate() == null) {
            jobPost.setPostedDate(LocalDate.now());
        }
        return repo.save(jobPost);
    }

    @Transactional
    public JobPost updateJob(JobPost incoming) {
        JobPost existing = getJob(incoming.getPostId()); // 404 if it doesn't exist
        if (incoming.getPostedDate() == null) {
            incoming.setPostedDate(existing.getPostedDate());
        }
        return repo.save(incoming);
    }

    @Transactional
    public void deleteJob(int postId) {
        if (!repo.existsById(postId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Job " + postId + " was not found.");
        }
        repo.deleteById(postId);
    }

    @Transactional(readOnly = true)
    public List<JobPost> searchByKeyword(String keyword) {
        return repo.search(keyword.trim());
    }

    /**
     * Inserts sample jobs. Used on first startup (when the table is empty) and by
     * GET /api/jobs/load.
     */
    @Transactional
    public void load() {
        repo.saveAll(List.of(
                seed("Java Developer", "Northwind Systems", "Kolkata", "Full-time", "2+ years", "₹10–15 LPA",
                        "Must have good experience in core Java and advanced Java. You will build REST APIs with Spring Boot.",
                        "Core Java", "J2EE", "Spring Boot", "Hibernate"),
                seed("Frontend Developer", "Lumen Labs", "Remote", "Remote", "3+ years", "₹12–18 LPA",
                        "Experience building responsive web applications using React.",
                        "HTML", "CSS", "JavaScript", "React"),
                seed("Data Scientist", "Orchard Analytics", "Pune", "Full-time", "4+ years", "₹18–25 LPA",
                        "Strong background in machine learning and data analysis.",
                        "Python", "Machine Learning", "Data Analysis"),
                seed("Network Engineer", "Tidewater", "Bengaluru", "Contract", "5+ years", "₹14–20 LPA",
                        "Design and implement computer networks for efficient data communication.",
                        "Networking", "Cisco", "Routing", "Switching"),
                seed("Mobile App Developer", "Paperboat", "Kolkata", "Part-time", "3+ years", "₹8–12 LPA",
                        "Experience in mobile app development for iOS and Android.",
                        "iOS Development", "Android Development", "Mobile App")));
    }

    @Transactional(readOnly = true)
    public boolean isEmpty() {
        return repo.count() == 0;
    }

    private JobPost seed(String title, String company, String location, String type, String exp,
            String salary, String desc, String... skills) {
        JobPost j = new JobPost(); // needs a no-args constructor + setters
        j.setPostProfile(title);
        j.setCompany(company);
        j.setLocation(location);
        j.setJobType(type);
        j.setReqExperience(exp);
        j.setSalary(salary);
        j.setPostDesc(desc);
        j.setPostTechStack(List.of(skills));
        j.setContactEmail("hr@" + company.toLowerCase().replaceAll("\\W", "") + ".example");
        j.setPostedDate(LocalDate.now());
        return j;
    }
}