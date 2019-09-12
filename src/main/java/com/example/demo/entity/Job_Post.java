package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "job_post")
public class Job_Post implements Comparable<Job_Post>, Serializable {

    private static final long serialVersionUID = 7156526077883281624L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private int id;

//    @Column(name = "title", columnDefinition = "NVARCHAR(150)")
//    private String title;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "time_post")
    private Date timePost;

    @Column(name = "views")
    private int views;

    @Column(name = "contact", columnDefinition = "NVARCHAR(500)")
    private String contact;

    @Column(name = "interview_process", columnDefinition = "NVARCHAR(MAX)")
    private String interview_process;

    @Column(name = "interest", columnDefinition = "NVARCHAR(MAX)")
    private String interest;

    @ManyToOne(cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    @JoinColumn(name = "ojt_enrollment_id")
    private Ojt_Enrollment ojt_enrollment;

//    @ManyToMany
//    @LazyCollection(LazyCollectionOption.FALSE)
//    @JoinTable(
//            name = "job_post_skill",
//            joinColumns = {
//                    @JoinColumn(name = "job_post_id")},
//            inverseJoinColumns = {
//                    @JoinColumn(name = "skill_id")}
//    )


    // private List<Skill> skills;

    @OneToMany(mappedBy = "job_post")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Job_Post_Skill> job_post_skills;


    public Job_Post() {
    }

    public Job_Post(int id, String description, Date timePost, int views, String contact, String interview_process, String interest, Ojt_Enrollment ojt_enrollment) {
        this.id = id;
        this.description = description;
        this.timePost = timePost;
        this.views = views;
        this.contact = contact;
        this.interview_process = interview_process;
        this.interest = interest;
        this.ojt_enrollment = ojt_enrollment;
    }

    public Job_Post(String description, Date timePost, int views, String contact, String interview_process, String interest) {
        this.description = description;
        this.timePost = timePost;
        this.views = views;
        this.contact = contact;
        this.interview_process = interview_process;
        this.interest = interest;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

//    public String getTitle() {
//        return title;
//    }
//
//    public void setTitle(String title) {
//        this.title = title;
//    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getTimePost() {
        return timePost;
    }

    public void setTimePost(Date timePost) {
        this.timePost = timePost;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getInterview_process() {
        return interview_process;
    }

    public void setInterview_process(String interview_process) {
        this.interview_process = interview_process;
    }

    public String getInterest() {
        return interest;
    }

    public void setInterest(String interest) {
        this.interest = interest;
    }

    public Ojt_Enrollment getOjt_enrollment() {
        return ojt_enrollment;
    }

    public void setOjt_enrollment(Ojt_Enrollment ojt_enrollment) {
        this.ojt_enrollment = ojt_enrollment;
    }

    public List<Job_Post_Skill> getJob_post_skills() {
        return job_post_skills;
    }

    public void setJob_post_skills(List<Job_Post_Skill> job_post_skills) {
        this.job_post_skills = job_post_skills;
    }

    @Override
    public int compareTo(Job_Post job_post) {
        return job_post.getTimePost().compareTo(getTimePost());
    }
}
