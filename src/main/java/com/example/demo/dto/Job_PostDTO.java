package com.example.demo.dto;

import com.example.demo.entity.Business;
import com.example.demo.entity.Job_Post;

public class Job_PostDTO {
    private Business business;
    private Job_Post job_post;

    public Job_PostDTO(Business business, Job_Post job_post) {
        this.business = business;
        this.job_post = job_post;
    }

    public Job_PostDTO() {
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
}
