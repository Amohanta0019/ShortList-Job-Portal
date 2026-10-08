package com.telusko.JobApp.service;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final JobService service;

    public DataLoader(JobService service) {
        this.service = service;
    }

    @Override
    public void run(String... args) {
        if (service.isEmpty()) {
            service.load();
        }
    }
}