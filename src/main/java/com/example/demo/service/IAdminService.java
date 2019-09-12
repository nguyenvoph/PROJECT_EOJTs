package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.entity.*;

import java.util.ArrayList;
import java.util.List;

public interface IAdminService {

    Admin findAdminByEmail(String email);

    List<Business_ListJobPostDTO> getJobPostsOfBusinesses();

    List<Business> getSuggestedBusinessListForFail(Student student);

    List<Business> filterListBusinessByStudentSpecialized(int specializedId, List<Business> businessList);

    boolean updateAdmin(Admin admin);

    Businesses_OptionsDTO getBusinesses_OptionDTO();

    Businesses_StudentsDTO getBusinesses_StudentsDTO();

    List<Statistical_EvaluationDTO> getListStatistical_EvaluationDTO();

    List<StatisticalQuestionAnswerDTO> getListStatisticalQuestionAnswerDTO();

    List<Integer> percentStudentMakeSurvey();

    BusinessOptionsBySemesterDTO getBusinessOptionsBySemester(String businessEmail);

    BusinessOptionsBySemesterDTO countStudentInternAtBusinessBySemester(String businessEmail);

    List<Statistical_EvaluationDTO> getListStatistical_EvaluationDTOOfABusiness(String businessEmail);

    List<MonthNumberTaskDTO> numberTaskOfStudent(Business business);

    Students_TasksDTO getStudentsAndTasksOfSupervisor(String email);

    Students_TasksDoneDTO getStudentAndTasksDoneOfSupervisor(String email);

    List<Statistical_EvaluationDTO> getListStatistical_EvaluationOfSupervisorDTO(String email);

    StatisticalStudentInSemesterDTO getStatisticalStudentInSemester(String semesterName);

}
