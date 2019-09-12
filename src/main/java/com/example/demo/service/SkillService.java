package com.example.demo.service;

import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.ISkillRepository;
import com.example.demo.utils.Utils;
import org.hibernate.search.jpa.FullTextEntityManager;
import org.hibernate.search.jpa.Search;
import org.hibernate.search.query.dsl.QueryBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

@Service
public class SkillService implements ISkillService {
    @Autowired
    ISkillRepository ISkillRepository;

    @Autowired
    HibernateSearchService hibernateSearchService;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private RedisTemplate<Object, Object> template;

    @Autowired
    ISpecializedService iSpecializedService;

    @Override
    public int fullTextSearch(String skillName) {
        int skillId = 0;
        hibernateSearchService.initializeHibernateSearch();

        FullTextEntityManager fullTextEntityManager = Search.getFullTextEntityManager(entityManager);

        QueryBuilder queryBuilder = fullTextEntityManager.getSearchFactory()
                .buildQueryBuilder()
                .forEntity(Skill.class)
                .get();

        org.apache.lucene.search.Query query = queryBuilder
                .keyword()
                .onFields("name")
                .matching(skillName)
                .createQuery();

        org.hibernate.search.jpa.FullTextQuery jpaQuery
                = fullTextEntityManager.createFullTextQuery(query, Skill.class);

        try {
            Skill skill = (Skill) jpaQuery.getSingleResult();
            skillId = skill.getId();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return skillId;
    }

    @Override
    public List<Skill> getListSkillBySpecialized(int specializedId) {
        return ISkillRepository.findBySpecializedId(specializedId);
    }

    @Override
    public List<Skill> getListSkillBySpecializedOrSoftSkillIsTrue(int specializedId) {
        return ISkillRepository.findBySpecializedIdOrIsSoftSkillTrue(specializedId);
    }

    @Override
    public List<Skill> getAllSkill() {
        ValueOperations values = template.opsForValue();
        List<Skill> skills = (List<Skill>) values.get("skills");

        if (skills == null) {
            List<Skill> list;
            list = ISkillRepository.findAll();
            List<Skill> skillListResult = new ArrayList<>();
            for (int i = 0; i < list.size(); i++) {
                if (list.get(i).getSpecialized() != null) {
                    skillListResult.add(list.get(i));
                }
            }
            if (skillListResult != null) {
                values.set("skills", skillListResult);
                return skillListResult;
            }
        } else {
            return skills;
        }
        return null;
    }

    @Override
    public boolean  createSkill(Skill skill) {
        ValueOperations values = template.opsForValue();
        List<Skill> skillList = (List<Skill>) values.get("skills");
        try {
            Specialized specialized = iSpecializedService.getSpecializedById(skill.getSpecialized().getId());
            skill.setSpecialized(specialized);
            skill.setSoftSkill(false);
            ISkillRepository.save(skill);
            if (skillList != null) {
                Skill isAddDB=getSkillByName(skill.getName());
                skillList.add(isAddDB);
                values.set("skills", skillList);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateSkill(Skill skill) {
        ValueOperations values = template.opsForValue();
        List<Skill> skillList = (List<Skill>) values.get("skills");

        Skill skillFound = ISkillRepository.findSkillById(skill.getId());
        if (skillList != null) {
            int position = findPositionSkillInList(skillList, skillFound);
            skillList.remove(position);
            skill.setSoftSkill(false);
            Specialized specialized = iSpecializedService.getSpecializedById(skill.getSpecialized().getId());
            skill.setSpecialized(specialized);
            skillList.add(position, skill);
            values.set("skills", skillList);
        }

        if (skillFound != null) {
            ISkillRepository.save(skill);
            return true;
        }
        return false;
    }

    @Override
    public boolean updateStatusSkill(int skillId, boolean status) {
        ValueOperations values = template.opsForValue();
        List<Skill> skillList = (List<Skill>) values.get("skills");

        Skill skillFound = ISkillRepository.findSkillById(skillId);

        if (skillList != null) {
            int position = findPositionSkillInList(skillList, skillFound);
            skillList.remove(position);
            skillFound.setStatus(status);
            skillList.add(position, skillFound);
            values.set("skills", skillList);
        }

        if (skillFound != null) {
            skillFound.setStatus(status);
            ISkillRepository.save(skillFound);
            return true;
        }
        return false;
    }

    public int findPositionSkillInList(List<Skill> skills, Skill skill) {
        for (int i = 0; i < skills.size(); i++) {
            Skill skillInList = skills.get(i);
            if (skillInList.getId() == skill.getId()) {
                return i;
            }
        }
        return -1;
    }

    @Override
    public Skill getSkillById(int id) {
        Skill skill = ISkillRepository.findSkillById(id);
        if (skill != null) {
            return skill;
        } else {
            return null;
        }
    }

    @Override
    public List<Skill> getListSkillJobPost(Job_Post job_post) {

        List<Job_Post_Skill> job_post_skills = job_post.getJob_post_skills();
        List<Skill> skillList = new ArrayList<>();

        for (int i = 0; i < job_post_skills.size(); i++) {
            skillList.add(job_post_skills.get(i).getSkill());
        }
        return skillList;
    }

    @Override
    public Skill getSkillByName(String name) {
        Skill skill = ISkillRepository.findSkillByName(name);
        if (skill != null) {
            return skill;
        }
        return null;
    }

    @Override
    public void saveSkill(Skill skill) {
        if (skill != null) {
            ISkillRepository.save(skill);
        }
    }

    @Override
    public PagingDTO pagingSkill(int currentPage, int rowsPerPage) {
        List<Skill> skillList = getAllSkill();
        Utils<Skill> skillUtils = new Utils<>();
        return skillUtils.paging(skillList, currentPage, rowsPerPage);
    }
}
