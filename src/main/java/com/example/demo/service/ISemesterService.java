package com.example.demo.service;

import com.example.demo.entity.Semester;

import java.util.List;

public interface ISemesterService {

    Semester getSemesterByName(String name);

    List<Semester> getAllSemester();

    Semester getSemesterCurrent();

    Semester getSemesterCurrentByTimeChooseOption();

    Semester getSemesterByStartDateAndEndDate();

    boolean saveSemester(Semester semester);

    Semester getSemesterNext();

}
