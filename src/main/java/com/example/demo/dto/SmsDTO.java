package com.example.demo.dto;

import java.io.Serializable;

public class SmsDTO implements Serializable {
    private String receiverNumber;
    private String content;

    public String getReceiverNumber() {
        return receiverNumber;
    }

    public void setReceiverNumber(String receiverNumber) {
        this.receiverNumber = receiverNumber;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
