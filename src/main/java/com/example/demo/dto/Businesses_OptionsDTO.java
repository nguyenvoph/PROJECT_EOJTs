package com.example.demo.dto;

import com.example.demo.entity.Business;

import java.io.Serializable;
import java.util.List;

public class Businesses_OptionsDTO implements Serializable {
    List<String> businessListEngName;
    List<Integer> countStudentRegisterBusiness;

    public List<String> getBusinessListEngName() {
        return businessListEngName;
    }

    public void setBusinessListEngName(List<String> businessListEngName) {
        this.businessListEngName = businessListEngName;
    }

    public List<Integer> getCountStudentRegisterBusiness() {
        return countStudentRegisterBusiness;
    }

    public void setCountStudentRegisterBusiness(List<Integer> countStudentRegisterBusiness) {
        this.countStudentRegisterBusiness = countStudentRegisterBusiness;
    }
}
