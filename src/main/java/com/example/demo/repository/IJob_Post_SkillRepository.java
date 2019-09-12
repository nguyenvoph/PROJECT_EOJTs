package com.example.demo.repository;

import com.example.demo.entity.Job_Post_Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IJob_Post_SkillRepository extends JpaRepository<Job_Post_Skill,Integer> {

}
