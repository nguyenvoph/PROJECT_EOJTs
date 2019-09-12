package com.example.demo.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;
import org.hibernate.search.annotations.Field;
import org.hibernate.search.annotations.Indexed;
import org.hibernate.search.annotations.TermVector;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "skill")
@Indexed
public class Skill implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "name", columnDefinition = "NVARCHAR(100)")
    @Field(termVector = TermVector.YES)
    private String name;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "specialized_id")
//    @JsonIgnore
    private Specialized specialized;

    @ManyToMany(mappedBy = "skills")
    @JsonIgnore
    private List<Student> students;

//    @ManyToMany(mappedBy = "skills")
//    @JsonBackReference
//    private List<Job_Post> job_posts;

    @OneToMany(mappedBy = "skill")
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Job_Post_Skill> job_post_skills;

    @Column(name = "isActive")
    private Boolean status;

    @Column(name = "isSoftSkill")
    private Boolean isSoftSkill=false;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
//    @ManyToOne
////    @JsonBackReference
//    private List<Job_Post> job_posts;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Specialized getSpecialized() {
        return specialized;
    }

    public void setSpecialized(Specialized specialized) {
        this.specialized = specialized;
    }

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

//    public List<Job_Post> getJob_posts() {
//        return job_posts;
//    }
//
//    public void setJob_posts(List<Job_Post> job_posts) {
//        this.job_posts = job_posts;
//    }

    public Skill(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public Skill() {
    }


    public Boolean getSoftSkill() {
        return isSoftSkill;
    }

    public void setSoftSkill(Boolean softSkill) {
        isSoftSkill = softSkill;
    }
}
