package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "business")
public class Business implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "business_name", columnDefinition = "NVARCHAR(500)")
    private String business_name;

    @Column(name = "business_eng_name")
    private String business_eng_name;

    @Column(name = "business_phone")
    private String business_phone;

    @Column(name = "business_address", columnDefinition = "NVARCHAR(MAX)")
    private String business_address;

    @Column(name = "business_overview", columnDefinition = "NVARCHAR(MAX)")
    private String business_overview;

    @Column(name = "business_website")
    private String business_website;

    @Column(name = "logo")
    private String logo;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    private List<Ojt_Enrollment> ojt_enrollments;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Event> events;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    @JsonIgnore
    private List<Invitation> invitations;

    @Column(name = "rate_count")
    private int rateCount = 0;

    @Column(name = "rate_average")
    private float rateAverage = 0f;


    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL)
    @LazyCollection(LazyCollectionOption.FALSE)
    private List<Supervisor> supervisors;

    public Business() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBusiness_name() {
        return business_name;
    }

    public void setBusiness_name(String business_name) {
        this.business_name = business_name;
    }

    public String getBusiness_eng_name() {
        return business_eng_name;
    }

    public void setBusiness_eng_name(String business_eng_name) {
        this.business_eng_name = business_eng_name;
    }

    public String getBusiness_phone() {
        return business_phone;
    }

    public void setBusiness_phone(String business_phone) {
        this.business_phone = business_phone;
    }

    public String getBusiness_address() {
        return business_address;
    }

    public void setBusiness_address(String business_address) {
        this.business_address = business_address;
    }

    public String getBusiness_overview() {
        return business_overview;
    }

    public void setBusiness_overview(String business_overview) {
        this.business_overview = business_overview;
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

    public List<Ojt_Enrollment> getOjt_enrollments() {
        return ojt_enrollments;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    public List<Invitation> getInvitations() {
        return invitations;
    }

    public void setInvitations(List<Invitation> invitations) {
        this.invitations = invitations;
    }

    public void setOjt_enrollments(List<Ojt_Enrollment> ojt_enrollments) {
        this.ojt_enrollments = ojt_enrollments;
    }

    public Business(String email, String business_name, String business_eng_name, String business_phone, String business_address, String business_overview, String business_website, String logo) {
        this.email = email;
        this.business_name = business_name;
        this.business_eng_name = business_eng_name;
        this.business_phone = business_phone;
        this.business_address = business_address;
        this.business_overview = business_overview;
        this.business_website = business_website;
        this.logo = logo;
    }

    public int getRateCount() {
        return rateCount;
    }

    public void setRateCount(int rateCount) {
        this.rateCount = rateCount;
    }

    public float getRateAverage() {
        return rateAverage;
    }

    public void setRateAverage(float rateAverage) {
        this.rateAverage = rateAverage;
    }


    public List<Supervisor> getSupervisors() {
        return supervisors;
    }

    public void setSupervisors(List<Supervisor> supervisors) {
        this.supervisors = supervisors;
    }
}
