package com.example.demo.dto;

import com.example.demo.entity.Business;

import java.io.Serializable;

public class Business_SuggestScoreDTO implements Serializable {

    private Business business;
    private float suggestScore;

    public Business_SuggestScoreDTO() {

    }

    public Business_SuggestScoreDTO(Business business, float suggestScore) {
        this.business = business;
        this.suggestScore = suggestScore;
    }

    public Business getBusiness() {
        return business;
    }

    public void setBusiness(Business business) {
        this.business = business;
    }

    public float getSuggestScore() {
        return  suggestScore;
    }

    public void setSuggestScore(float suggestScore) {
        this.suggestScore = suggestScore;
    }

}
