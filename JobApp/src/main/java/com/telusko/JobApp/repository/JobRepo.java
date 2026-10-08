package com.telusko.JobApp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.telusko.JobApp.Model.JobPost;

public interface JobRepo extends JpaRepository<JobPost, Integer> {

    @Query("""
        SELECT DISTINCT j FROM JobPost j LEFT JOIN j.postTechStack s
        WHERE LOWER(j.postProfile) LIKE LOWER(CONCAT('%', :kw, '%'))
           OR LOWER(j.postDesc)    LIKE LOWER(CONCAT('%', :kw, '%'))
           OR LOWER(j.company)     LIKE LOWER(CONCAT('%', :kw, '%'))
           OR LOWER(j.location)    LIKE LOWER(CONCAT('%', :kw, '%'))
           OR LOWER(s)             LIKE LOWER(CONCAT('%', :kw, '%'))
        """)
    List<JobPost> search(@Param("kw") String keyword);
}