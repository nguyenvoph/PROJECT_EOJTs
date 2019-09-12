package com.example.demo.entity;


import com.example.demo.config.StudentStatus;
import com.fasterxml.jackson.annotation.*;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "Student")
public class Student implements Serializable {

    private static final long serialVersionUID = 7156526077883281623L;

    @Id
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "name", columnDefinition = "NVARCHAR(150)")
    private String name;

    @Column(name = "gpa")
    private float gpa;

    @Column(name = "phone")
    private String phone;

    @Column(name = "address", columnDefinition = "NVARCHAR(150)")
    private String address;

    @Column(name = "objective", columnDefinition = "NVARCHAR(550)")
    private String objective;

    @Column(name = "option1", columnDefinition = "NVARCHAR(150)")
    private String option1;

    @Column(name = "option2", columnDefinition = "NVARCHAR(150)")
    private String option2;

    @Column(name = "isAcceptedOption1")
    private boolean acceptedOption1;

    @Column(name = "isInterviewed1")
    private boolean interviewed1;

    @Column(name = "isAcceptedOption2")
    private boolean acceptedOption2;

    @Column(name = "isInterviewed2")
    private boolean interviewed2;

    @Column(name = "code")
    private String code;

    @Column(name = "avatarLink", columnDefinition = "varchar(MAX)")
    private String avatarLink;

    @Column(name = "resumeLink")
    private String resumeLink;

    @Column(name = "transcriptLink")
    private String transcriptLink;

    @OneToMany(mappedBy = "student")
    @JsonIgnore
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Ojt_Enrollment> ojt_enrollments;

    @ManyToMany
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinTable(
            name = "student_skill",
            joinColumns = {
                    @JoinColumn(name = "student_email")},
            inverseJoinColumns = {
                    @JoinColumn(name = "skill_id")}
    )
    private List<Skill> skills;

//    @ManyToMany(cascade = CascadeType.MERGE)
//    @LazyCollection(LazyCollectionOption.FALSE)
//    @JoinTable(
//            name = "student_event",
//            joinColumns = {
//                    @JoinColumn(name = "student_email")},
//            inverseJoinColumns = {
//                    @JoinColumn(name = "event_id")}
//    )
//
//    @JsonIgnore
//    private List<Event> events;

    @OneToMany(mappedBy = "student")
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    private List<Student_Event> student_events;

    //Add ignore Student - Invitation
    @OneToMany(mappedBy = "student")
    @JsonIgnore
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Invitation> invitations;


    @ManyToOne
//    @JsonBackReference
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "specialized_id")
    private Specialized specialized;

    @Column(name = "token")
    private String token;

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "supervisor_email")
//    @JsonIgnore
    private Supervisor supervisor;

    @Column(name = "dob")
    private Date dob;

    @Column(name = "gender")
    private boolean gender;

    @Enumerated(EnumType.STRING)
    @Check(constraints = "status IN ('NOTSTART' ,'STARTED', 'PASS', 'FAIL')")
    @Column(name = "status")
    private StudentStatus status = StudentStatus.NOTSTART;

    @OneToMany(mappedBy = "student_proposed")
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    private List<Business_Proposed> business_proposeds;

    @OneToMany(mappedBy = "student")
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    private List<Student_Answer> student_answers;

//    @ManyToMany
//    @JsonIgnore
//    @LazyCollection(LazyCollectionOption.FALSE)
//    @JoinTable(
//            name = "student_answer",
//            joinColumns = {
//                    @JoinColumn(name = "student_email")},
//            inverseJoinColumns = {
//                    @JoinColumn(name = "answer_id")}
//    )
//    private List<Answer> answers;

    public Student() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getObjective() {
        return objective;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public String getOption1() {
        return option1;
    }

    public void setOption1(String option1) {
        this.option1 = option1;
    }

    public String getOption2() {
        return option2;
    }

    public void setOption2(String option2) {
        this.option2 = option2;
    }

    public boolean isAcceptedOption1() {
        return acceptedOption1;
    }

    public void setAcceptedOption1(boolean acceptedOption1) {
        this.acceptedOption1 = acceptedOption1;
    }

    public boolean isAcceptedOption2() {
        return acceptedOption2;
    }

    public void setAcceptedOption2(boolean acceptedOption2) {
        this.acceptedOption2 = acceptedOption2;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }


    public List<Ojt_Enrollment> getOjt_enrollments() {
        return ojt_enrollments;
    }

    public void setOjt_enrollments(List<Ojt_Enrollment> ojt_enrollments) {
        this.ojt_enrollments = ojt_enrollments;
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }

//    public List<Event> getEvents() {
//        return events;
//    }
//
//    public void setEvents(List<Event> events) {
//        this.events = events;
//    }

    public List<Invitation> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<Invitation> invitations) {
        this.invitations = invitations;
    }

    public float getGpa() {
        return gpa;
    }

    public void setGpa(float gpa) {
        this.gpa = gpa;
    }

    public Specialized getSpecialized() {
        return specialized;
    }

    public void setSpecialized(Specialized specialized) {
        this.specialized = specialized;
    }

    public String getAvatarLink() {
        return avatarLink;
    }

    public void setAvatarLink(String avatarLink) {
        this.avatarLink = avatarLink;
    }

    public String getResumeLink() {
        return resumeLink;
    }

    public void setResumeLink(String resumeLink) {
        this.resumeLink = resumeLink;
    }

    public boolean isInterviewed1() {
        return interviewed1;
    }

    public void setInterviewed1(boolean interviewed1) {
        this.interviewed1 = interviewed1;
    }

    public boolean isInterviewed2() {
        return interviewed2;
    }

    public void setInterviewed2(boolean interviewed2) {
        this.interviewed2 = interviewed2;
    }

    public String getTranscriptLink() {
        return transcriptLink;
    }

    public void setTranscriptLink(String transcriptLink) {
        this.transcriptLink = transcriptLink;
    }

    public Supervisor getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Supervisor supervisor) {
        this.supervisor = supervisor;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    public boolean isGender() {
        return gender;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

    public StudentStatus getStatus() {
        return status;
    }

    public void setStatus(StudentStatus status) {
        this.status = status;
    }

    public List<Business_Proposed> getBusiness_proposeds() {
        return business_proposeds;
    }

    public void setBusiness_proposeds(List<Business_Proposed> business_proposeds) {
        this.business_proposeds = business_proposeds;
    }

    public List<Student_Answer> getStudent_answers() {
        return student_answers;
    }

    public void setStudent_answers(List<Student_Answer> student_answers) {
        this.student_answers = student_answers;
    }

    public List<Student_Event> getStudent_events() {
        return student_events;
    }

    public void setStudent_events(List<Student_Event> student_events) {
        this.student_events = student_events;
    }
    //    public List<Answer> getAnswers() {
//        return answers;
//    }
//
//    public void setAnswers(List<Answer> answers) {
//        this.answers = answers;
//    }


    @Override
    public String toString() {
        return this.getEmail() + "/" + this.getName() + "/" + this.getCode() + "/" + this.getPhone();
    }
}
