package com.example.demo.service;

import com.example.demo.entity.Job_Post;
import com.example.demo.entity.Ojt_Enrollment;
import java.util.List;

public interface IJob_PostService {

    void saveJobPost(Job_Post job_post);

    Job_Post findJob_PostById(int id);

    int getViewOfJobPost(int id);

    void updateViewOfJobPost(int id, int views);

    boolean updateInforJobPost(Job_Post job_post);

    List<Job_Post> getAllJobPost();

    List<Job_Post> getAllJobPostOfBusiness(Ojt_Enrollment ojt_enrollment);

    boolean createJob_Post(String emailBusiness, Job_Post job_post);
}
