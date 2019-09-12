package com.example.demo.service;

import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.Job_Post;
import com.example.demo.entity.Skill;

import java.util.List;

public interface ISkillService {

    int fullTextSearch(String skillName);

    List<Skill> getListSkillBySpecialized(int specializedId);

    List<Skill> getListSkillBySpecializedOrSoftSkillIsTrue(int specializedId);

    List<Skill> getAllSkill();

    boolean createSkill(Skill skill);

    boolean updateSkill(Skill skill);

    boolean updateStatusSkill(int skillId, boolean status);

    Skill getSkillById(int id);

    List<Skill> getListSkillJobPost(Job_Post job_post);

    Skill getSkillByName(String name);

    void saveSkill(Skill skill);

    PagingDTO pagingSkill(int currentPage, int rowsPerPage);
}
