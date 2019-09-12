package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.IJob_PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
@CacheConfig(cacheNames = "jobpost")
public class Job_PostService implements IJob_PostService {
    @Autowired
    IJob_PostRepository IJob_postRepository;

    @Autowired
    IBusinessService businessService;

    @Autowired
    IOjt_EnrollmentService ojt_enrollmentService;

    @Autowired
    IJob_Post_SkillService job_post_skillService;

    @Autowired
    ISemesterService semesterService;

    @Autowired
    private RedisTemplate<Object, Object> template;

    @Override
    public void saveJobPost(Job_Post job_post) {
        if (job_post != null) {
            IJob_postRepository.save(job_post);
        }
    }

    @Override
    public Job_Post findJob_PostById(int id) {
        Job_Post job_post = IJob_postRepository.findJob_PostById(id);
        if (job_post != null) {
            return job_post;
        }
        return null;
    }

    @Override
    public int getViewOfJobPost(int id) {
        Job_Post job_post = IJob_postRepository.findJob_PostById(id);
        if (job_post != null) {
            return job_post.getViews();
        }
        return 0;
    }

    @Override
    public void updateViewOfJobPost(int id, int views) {
        Job_Post job_post = IJob_postRepository.findJob_PostById(id);
        if (job_post != null) {
            job_post.setViews(views);
            IJob_postRepository.save(job_post);
        }
    }

    @Override
    public boolean updateInforJobPost(Job_Post job_post) {
        Job_Post job_postIsExisted = IJob_postRepository.findJob_PostById(job_post.getId());
        if (job_postIsExisted != null) {
            IJob_postRepository.save(job_post);
            return true;
        }
        return false;
    }

    //check semester //ok

//    @Cacheable(key = "'all'")
    @Override
    public List<Job_Post> getAllJobPost() {

        ValueOperations values = template.opsForValue();
        List<Job_Post> job_postList = (List<Job_Post>) values.get("job_post");
        if (job_postList == null) {

            Semester semester = semesterService.getSemesterCurrent();

            job_postList = IJob_postRepository.findJob_PostsOrderByTimePostDesc();

            List<Job_Post> job_postListCurrentSemester = new ArrayList<>();

            for (int i = 0; i < job_postList.size(); i++) {
                Semester semesterOfJobPost = job_postList.get(i).getOjt_enrollment().getSemester();
                if (semesterOfJobPost != null) {
                    if (semesterOfJobPost.getId() == semester.getId()) {
                        job_postListCurrentSemester.add(job_postList.get(i));
                    }
                }
            }
            if (job_postListCurrentSemester != null) {
                values.set("job_post", job_postList);
                return job_postList;
            }
            return null;
        } else {
            return job_postList;
        }
    }

    @Override
    public List<Job_Post> getAllJobPostOfBusiness(Ojt_Enrollment ojt_enrollment) {
        List<Job_Post> job_postList = IJob_postRepository.findJob_PostByOjt_enrollment(ojt_enrollment);
        if (job_postList != null) {
            return job_postList;
        }
        return null;
    }

    //check semester ok
    //@CachePut(value = "jobposts")
    @Override
    public boolean createJob_Post(String emailBusiness, Job_Post job_post) {
        Semester semesterCurrent = semesterService.getSemesterCurrent();
        Ojt_Enrollment ojt_enrollment =
                ojt_enrollmentService.getOjtEnrollmentByBusinessEmailAndSemesterId(emailBusiness, semesterCurrent.getId());

        List<Job_Post_Skill> job_post_skill = job_post.getJob_post_skills();

        if (job_post != null) {
            Date date = new Date(Calendar.getInstance().getTime().getTime());
            job_post.setTimePost(date);
            job_post.setOjt_enrollment(ojt_enrollment);

            for (int i = 0; i < job_post_skill.size(); i++) {
                job_post_skill.get(i).setJob_post(job_post);
                job_post_skillService.saveJobPostSkill(job_post_skill.get(i));
            }

            IJob_postRepository.save(job_post);

            return true;
        }
        return false;
    }
}
