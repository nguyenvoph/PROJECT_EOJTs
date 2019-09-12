package com.example.demo.dto;

import com.example.demo.entity.Business;
import com.example.demo.entity.Supervisor;

public class SupervisorDTO {
    private Supervisor supervisor;
    private Business business;

    public SupervisorDTO(Supervisor supervisor, Business business) {
        this.supervisor = supervisor;
        this.business = business;
    }

    public SupervisorDTO() {
    }

    public Supervisor getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Supervisor supervisor) {
        this.supervisor = supervisor;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }
}
