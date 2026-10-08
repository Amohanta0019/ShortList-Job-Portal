package com.telusko.JobApp.Model;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class JobPost {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@JsonProperty("id")
	private Integer postId; // was: int

	@JsonProperty("experience")
	private String reqExperience; // was: int
	@JsonProperty("title")
	private String postProfile;

	@JsonProperty("description")
	@Column(length = 4000)
	private String postDesc;

	@JsonProperty("skills")
	@ElementCollection
	private List<String> postTechStack;

	// new fields the UI uses
	private String company;
	private String location;
	private String jobType; // Full-time, Part-time, Contract, Internship, Remote
	private String salary;
	private String contactEmail;
	private LocalDate postedDate = LocalDate.now();

}