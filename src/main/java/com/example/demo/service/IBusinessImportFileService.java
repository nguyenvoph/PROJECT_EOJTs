package com.example.demo.service;

import com.example.demo.dto.BusinessDTO;

import java.util.List;

public interface IBusinessImportFileService {

    boolean insertBusiness(List<BusinessDTO> businessDTO) throws Exception;
}
