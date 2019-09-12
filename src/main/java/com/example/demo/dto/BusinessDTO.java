package com.example.demo.dto;

import com.example.demo.entity.Business;
import com.example.demo.entity.Ojt_Enrollment;
import com.example.demo.entity.Skill;

import java.sql.Date;
import java.util.List;

public class BusinessDTO {
    private String email;
    private String business_address;
    private String business_eng_name;
    private String business_name;
    private String business_overview;
    private String business_phone;
    private String business_website;
    private String logo;
    private String contact;
    private String description;
    private String interest;
    private String interview_process;
    private Date time_post;
    private int views;
    private List<SkillDTO> skillDTOList;
    private String nameSemester;


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBusiness_address() {
        return business_address;
    }

    public void setBusiness_address(String business_address) {
        this.business_address = business_address;
    }

    public String getBusiness_eng_name() {
        return business_eng_name;
    }

    public void setBusiness_eng_name(String business_eng_name) {
        this.business_eng_name = business_eng_name;
    }

    public String getBusiness_name() {
        return business_name;
    }

    public void setBusiness_name(String business_name) {
        this.business_name = business_name;
    }

    public String getBusiness_overview() {
        return business_overview;
    }

    public void setBusiness_overview(String business_overview) {
        this.business_overview = business_overview;
    }

    public String getBusiness_phone() {
        return business_phone;
    }

    public void setBusiness_phone(String business_phone) {
        this.business_phone = business_phone;
    }

    public String getBusiness_website() {
        return business_website;
    }

    public void setBusiness_website(String business_website) {
        this.business_website = business_website;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInterest() {
        return interest;
    }

    public void setInterest(String interest) {
        this.interest = interest;
    }

    public String getInterview_process() {
        return interview_process;
    }

    public void setInterview_process(String interview_process) {
        this.interview_process = interview_process;
    }

    public Date getTime_post() {
        return time_post;
    }

    public void setTime_post(Date time_post) {
        this.time_post = time_post;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public List<SkillDTO> getSkillDTOList() {
        return skillDTOList;
    }

    public void setSkillDTOList(List<SkillDTO> skillDTOList) {
        this.skillDTOList = skillDTOList;
    }

    public String getNameSemester() {
        return nameSemester;
    }

    public void setNameSemester(String nameSemester) {
        this.nameSemester = nameSemester;
    }

    @Override
    public String toString() {
        String str = this.getEmail() + "/" +this.getBusiness_name() + "/" +this.getBusiness_eng_name() + "/" +this.getBusiness_address() + "/" +this.getBusiness_phone();
        return str;
    }
}
