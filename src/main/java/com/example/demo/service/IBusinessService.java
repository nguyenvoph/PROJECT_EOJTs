package com.example.demo.service;

import com.example.demo.dto.Business_JobPostDTO;
import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.*;
import java.util.List;

public interface IBusinessService {

    void saveBusiness(Business business);

    List<Business> getAllBusiness();

    List<Business> getAllBusinessBySemester();

    Business getBusinessByEmail(String email);

    boolean updateBusiness(String email, Business business);

    Business findBusinessByName(String name);

    List<Business> findTop5BusinessByRateAverage();

    List<Student> getSuggestListStudent(String emailBusiness);

    List<Skill> getListSkillBySpecializedOfStudent(List<Skill> skillListOfBusiness, int specialized);

    void updateRateNumber(String email, int rate);

    List<Business_JobPostDTO> getAllJobPostOfBusinesses();

    List<Job_Post> getAllJobPostOfBusiness(String email);

    List<Evaluation> getEvaluationsOfSupervisor(String email);

    PagingDTO pagingBusiness(int currentPage, int rowsPerPage);

    PagingDTO getEvaluationListOfBusiness(int specializedID, String email, int currentPage, int rowsPerPage);
}
