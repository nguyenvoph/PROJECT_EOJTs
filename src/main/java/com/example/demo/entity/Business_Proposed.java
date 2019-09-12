package com.example.demo.entity;

import com.example.demo.config.BusinessProposedStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Check;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "business_proposed")
public class Business_Proposed implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private int id;

    @Column(name = "email")
    private String email;

    @Column(name = "business_name", columnDefinition = "NVARCHAR(250)")
    private String business_name;

    @Column(name = "business_eng_name")
    private String business_eng_name;

    @Column(name = "business_phone")
    private String business_phone;

    @Column(name = "business_address", columnDefinition = "NVARCHAR(250)")
    private String business_address;

    @Column(name = "business_overview", columnDefinition = "NVARCHAR(MAX)")
    private String business_overview;

    @Column(name = "business_website")
    private String business_website;

    @Column(name = "logo")
    private String logo;

    @Column(name = "business_nationality", columnDefinition = "NVARCHAR(255)")
    private String business_nationality; // quốc tịch công ty

    @Column(name = "business_field_of_activity", columnDefinition = "NVARCHAR(255)")
    private String business_field_of_activity; // lĩnh vực hoạt động

    @Column(name = "isAcceptedByAdmin")
    @Enumerated(EnumType.STRING)
    @Check(constraints = "level_task IN ('ACCEPTED' ,'REJECTED', 'PENDING')")
    private BusinessProposedStatus isAcceptedByAdmin = BusinessProposedStatus.PENDING;

//    @Column(name = "isAcceptedByStartupRoom")
//    @Enumerated(EnumType.STRING)
//    @Check(constraints = "level_task IN ('ACCEPTED' ,'REJECTED', 'PENDING')")
//    private BusinessProposedStatus isAcceptedByStartupRoom = BusinessProposedStatus.PENDING; // đc chấp nhận bởi phòng khởi nghiệp?
//
//    @Column(name = "isAcceptedByHeadOfTraining")
//    @Enumerated(EnumType.STRING)
//    @Check(constraints = "level_task IN ('ACCEPTED' ,'REJECTED', 'PENDING')")
//    private BusinessProposedStatus isAcceptedByHeadOfTraining = BusinessProposedStatus.PENDING; // đc chấp nhận bởi trưởng phòng đào tạo?
//
//    @Column(name = "isAcceptedByHeadMaster")
//    @Enumerated(EnumType.STRING)
//    @Check(constraints = "level_task IN ('ACCEPTED' ,'REJECTED', 'PENDING')")
//    private BusinessProposedStatus isAcceptedByHeadMaster = BusinessProposedStatus.PENDING; // đc chấp nhận bởi hiệu trưởng?

    @ManyToOne
    @LazyCollection(LazyCollectionOption.FALSE)
    @JoinColumn(name = "student_proposed_email") // sinh viên đề xuất doanh nghiệp này
    private Student student_proposed;

    @Column(name = "commentAdmin", columnDefinition = "NVARCHAR(255)")
    private String commentAdmin;

//    @Column(name = "commentStartupRoom", columnDefinition = "NVARCHAR(255)")
//    private String commentStartupRoom;
//
//    @Column(name = "commentHeadOfTraining", columnDefinition = "NVARCHAR(255)")
//    private String commentHeadOfTraining;
//
//    @Column(name = "commentHeadOfMaster", columnDefinition = "NVARCHAR(255)")
//    private String commentHeadOfMaster;

    @Column(name = "scale", columnDefinition = "NVARCHAR(150)") // quy mô công ty
    private String scale;

    @Column(name = "contactLink", columnDefinition = "VARCHAR(MAX)") // link tải hợp đồng
    private String contactLink;

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

    public String getBusiness_nationality() {
        return business_nationality;
    }

    public void setBusiness_nationality(String business_nationality) {
        this.business_nationality = business_nationality;
    }

    public String getBusiness_field_of_activity() {
        return business_field_of_activity;
    }

    public void setBusiness_field_of_activity(String business_field_of_activity) {
        this.business_field_of_activity = business_field_of_activity;
    }

    public Student getStudent_proposed() {
        return student_proposed;
    }

    public void setStudent_proposed(Student student_proposed) {
        this.student_proposed = student_proposed;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

//    public String getCommentStartupRoom() {
//        return commentStartupRoom;
//    }
//
//    public void setCommentStartupRoom(String commentStartupRoom) {
//        this.commentStartupRoom = commentStartupRoom;
//    }
//
//    public String getCommentHeadOfTraining() {
//        return commentHeadOfTraining;
//    }
//
//    public void setCommentHeadOfTraining(String commentHeadOfTraining) {
//        this.commentHeadOfTraining = commentHeadOfTraining;
//    }
//
//    public BusinessProposedStatus getIsAcceptedByStartupRoom() {
//        return isAcceptedByStartupRoom;
//    }
//
//    public void setIsAcceptedByStartupRoom(BusinessProposedStatus isAcceptedByStartupRoom) {
//        this.isAcceptedByStartupRoom = isAcceptedByStartupRoom;
//    }
//
//    public BusinessProposedStatus getIsAcceptedByHeadOfTraining() {
//        return isAcceptedByHeadOfTraining;
//    }
//
//    public void setIsAcceptedByHeadOfTraining(BusinessProposedStatus isAcceptedByHeadOfTraining) {
//        this.isAcceptedByHeadOfTraining = isAcceptedByHeadOfTraining;
//    }
//
//    public BusinessProposedStatus getIsAcceptedByHeadMaster() {
//        return isAcceptedByHeadMaster;
//    }
//
//    public void setIsAcceptedByHeadMaster(BusinessProposedStatus isAcceptedByHeadMaster) {
//        this.isAcceptedByHeadMaster = isAcceptedByHeadMaster;
//    }

    public String getScale() {
        return scale;
    }

    public void setScale(String scale) {
        this.scale = scale;
    }

//    public String getCommentHeadOfMaster() {
//        return commentHeadOfMaster;
//    }
//
//    public void setCommentHeadOfMaster(String commentHeadOfMaster) {
//        this.commentHeadOfMaster = commentHeadOfMaster;
//    }

    public String getContactLink() {
        return contactLink;
    }

    public void setContactLink(String contactLink) {
        this.contactLink = contactLink;
    }

    public BusinessProposedStatus getIsAcceptedByAdmin() {
        return isAcceptedByAdmin;
    }

    public void setIsAcceptedByAdmin(BusinessProposedStatus isAcceptedByAdmin) {
        this.isAcceptedByAdmin = isAcceptedByAdmin;
    }

    public String getCommentAdmin() {
        return commentAdmin;
    }

    public void setCommentAdmin(String commentAdmin) {
        this.commentAdmin = commentAdmin;
    }

    @Override
    public String toString() {

        return this.email + "/" +business_name + "/" +business_eng_name + "/" +business_address + "/" +business_phone;
    }
}
