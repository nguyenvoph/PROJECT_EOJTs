package com.example.demo.dto;

import com.example.demo.entity.Business;
import com.example.demo.entity.Job_Post;

import java.io.Serializable;


public class Business_JobPostDTO implements Comparable<Business_JobPostDTO>, Serializable {
    private Business business;
    private Job_Post job_post;

    private static final long serialVersionUID = 7156526077883281623L;

    public Business_JobPostDTO() {
    }

    public Business_JobPostDTO(Business business, Job_Post job_post) {
        this.business = business;
        this.job_post = job_post;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    public Job_Post getJob_post() {
        return job_post;
    }

    public void setJob_post(Job_Post job_post) {
        this.job_post = job_post;
    }

    @Override
    public int compareTo(Business_JobPostDTO business_jobPostDTO) {
        return this.job_post.compareTo(business_jobPostDTO.getJob_post());
    }
}
