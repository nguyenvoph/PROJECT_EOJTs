package com.example.demo.dto;

import com.example.demo.entity.Business;
import com.example.demo.entity.Job_Post;

import java.util.Collections;
import java.util.List;

public class Business_ListJobPostDTO {
    private Business business;
    private List<Job_Post> job_postList;

    public Business_ListJobPostDTO() {
    }

    public Business_ListJobPostDTO(Business business, List<Job_Post> job_postList) {
        this.business = business;
        this.job_postList = job_postList;
    }



    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    public List<Job_Post> getJob_postList() {
        Collections.sort(job_postList);
        return job_postList;
    }

    public void setJob_postList(List<Job_Post> job_postList) {
        this.job_postList = job_postList;
    }
}
