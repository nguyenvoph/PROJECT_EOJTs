package com.example.demo.service;

import com.example.demo.dto.PagingDTO;
import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.Specialized;

import java.util.List;

public interface ISpecializedService {

    int fullTextSearch(String specializedName);

    List<Specialized> getAllSpecialized();

    int getIdByName(String name);

    boolean createSpecialized(Specialized specialized);

    List<Specialized> updateSpecialized(Specialized specialized);

    List<Specialized> updateStatusSpecialized(int specializedId, boolean status);

    Specialized getSpecializedById(int id);

//    List<Specialized> pagingSpecialized(int page, int pageSize);

    PagingDTO pagingSpecialized(int currentPage, int rowsPerPage);

    boolean checkSpecializedIsExisted(String name);
}
