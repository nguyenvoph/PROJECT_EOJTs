package com.example.demo.service;

import com.example.demo.entity.Business_Proposed;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IBusiness_ProposedService {
    List<Business_Proposed> getAll();

    Business_Proposed findById(int id);

    void updateStatusByAdmin(int id, String comment, boolean status, String email) throws Exception;

//    void updateStatusByStartUpRoom(int id, String comment, boolean status, String email) throws Exception;
//
//    void updateStatusByHeadOfTraining(int id, String comment, boolean status, String email) throws Exception;
//
//    void updateStatusByHeadMaster(int id, String comment, boolean status, String email) throws Exception;

    void createInformMessageAndSendMail(boolean status, Business_Proposed business_proposed, String descriptionEvent, String emailHeading, String emailNextHeading, String emailContent) throws Exception;

    void createBusinessPropose(Business_Proposed business_proposed);

    boolean updateBusinessPropose(Business_Proposed business_proposed);

    boolean checkBusinessProposeIsReject(String email);
}
