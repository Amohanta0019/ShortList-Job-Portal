package com.telusko.JobApp.controller;

import com.telusko.JobApp.Model.JobPost;
import com.telusko.JobApp.service.JobService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173") // only needed if you don't use the Vite proxy
public class JobController {

    @Autowired
    private JobService service;

    @GetMapping
    public List<JobPost> getAllJobs() {
        return service.getAllJobs();
    }

    @GetMapping("/search")
    public List<JobPost> search(@RequestParam String keyword) {
        return service.searchByKeyword(keyword);
    }

    @GetMapping("/{id}")
    public JobPost getJob(@PathVariable("id") int id) {
        return service.getJob(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobPost addJob(@RequestBody JobPost jobPost) {
        return service.addJob(jobPost);
    }

    @PutMapping("/{id}")
    public JobPost updateJob(@PathVariable("id") int id, @RequestBody JobPost jobPost) {
        jobPost.setPostId(id);
        return service.updateJob(jobPost);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteJob(@PathVariable("id") int id) {
        service.deleteJob(id);
    }

    @GetMapping("/load")
    public String loadData() {
        service.load();
        return "success";
    }
}