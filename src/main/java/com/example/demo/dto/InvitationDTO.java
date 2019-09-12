package com.example.demo.dto;

import com.example.demo.entity.Business;
import com.example.demo.entity.Invitation;

public class InvitationDTO {
    private Business business;
    private Invitation invitation;

    public InvitationDTO(Business business, Invitation invitation) {
        this.business = business;
        this.invitation = invitation;
    }

    public InvitationDTO() {
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    public Invitation getInvitation() {
        return invitation;
    }

    public void setInvitation(Invitation invitation) {
        this.invitation = invitation;
    }
}
