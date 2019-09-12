package com.example.demo.service;

import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.Student;
import com.example.demo.entity.Supervisor;

import java.util.List;

public interface ISupervisorService {

    Supervisor findByEmail(String email);

    List<Supervisor> getAllSupervisorOfABusiness(String emailBusiness);

    boolean createSupervisor(Supervisor supervisor, String emailBusiness);

    boolean updateStateSupervisor(String email, boolean isActive);

    boolean updateSupervisor(Supervisor supervisor);

    PagingDTO getEvaluationListOfSupervisor(String email, int currentPage, int rowsPerPage);

}
