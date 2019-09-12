package com.example.demo.dto;

import com.example.demo.entity.Business;

import java.util.List;

public class Businesses_StudentsDTO {
    private List<String> businessListEngName;
    private List<Integer> numberOfStudentInternAtBusiness;

    public List<String> getBusinessListEngName() {
        return businessListEngName;
    }

    public void setBusinessListEngName(List<String> businessListEngName) {
        this.businessListEngName = businessListEngName;
    }

    public List<Integer> getNumberOfStudentInternAtBusiness() {
        return numberOfStudentInternAtBusiness;
    }

    public void setNumberOfStudentInternAtBusiness(List<Integer> numberOfStudentInternAtBusiness) {
        this.numberOfStudentInternAtBusiness = numberOfStudentInternAtBusiness;
    }
}
