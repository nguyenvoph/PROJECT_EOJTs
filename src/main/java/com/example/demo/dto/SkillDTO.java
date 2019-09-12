package com.example.demo.dto;

import com.example.demo.entity.Skill;

public class SkillDTO {
   private Skill skill;
   private String name;
   private int number;

    public SkillDTO(Skill skill, String name,  int number) {
        this.skill = skill;
        this.name = name;
        this.number = number;
    }

    public SkillDTO() {
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

