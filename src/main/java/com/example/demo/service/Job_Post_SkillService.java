package com.example.demo.service;

import com.example.demo.entity.Business;
import com.example.demo.entity.Job_Post_Skill;
import com.example.demo.repository.IJob_Post_SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class Job_Post_SkillService implements IJob_Post_SkillService {
    @Autowired
    IJob_Post_SkillRepository IJob_post_skillRepository;


    @Override
    public void saveJobPostSkill(Job_Post_Skill job_post_skill) {
        if (job_post_skill != null) {
            IJob_post_skillRepository.save(job_post_skill);
        }
    }

    @Transactional
    @Override
    public void updateJobPostSkill(Job_Post_Skill job_post_skill) {
        Job_Post_Skill job_post_skill_isExisted = IJob_post_skillRepository.getOne(job_post_skill.getId());
        if (job_post_skill != null) {
            job_post_skill_isExisted.setId(job_post_skill.getId());
            job_post_skill_isExisted.setSkill(job_post_skill.getSkill());
            job_post_skill_isExisted.setNumber(job_post_skill.getNumber());
            job_post_skill_isExisted.setJob_post(job_post_skill.getJob_post());

            //job_post_skillRepository.save(job_post_skill);
            IJob_post_skillRepository.save(job_post_skill);
        }
    }
}
