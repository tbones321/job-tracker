package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Job;
import com.example.demo.repository.JobRepository;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {
    private final JobRepository repo;

    public JobController(JobRepository repo) { this.repo = repo; }

    @GetMapping
    public List<Job> list() { return repo.findAll(); }

    @PostMapping
    public Job create(@RequestBody Job job) { return repo.save(job); }

    @PutMapping("/{id}")
    public Job update(@PathVariable Long id, @RequestBody Job job) {
        return repo.findById(id).map(existing -> {
            if (job.getTitle() != null) existing.setTitle(job.getTitle());
            if (job.getCompany() != null) existing.setCompany(job.getCompany());
            if (job.getStatus() != null) existing.setStatus(job.getStatus());
            if (job.getNotes() != null) existing.setNotes(job.getNotes());
            return repo.save(existing);
        }).orElseThrow(() -> new RuntimeException("Job not found"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
