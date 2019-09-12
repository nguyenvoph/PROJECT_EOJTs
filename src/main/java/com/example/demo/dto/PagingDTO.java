package com.example.demo.dto;

import java.io.Serializable;
import java.util.List;

public class PagingDTO<T> implements Serializable {
    int pageNumber;
    List<T> listData;

    public PagingDTO() {
    }

    public PagingDTO(int pageNumber, List<T> listData) {
        this.pageNumber = pageNumber;
        this.listData = listData;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }

    public List<T> getListData() {
        return listData;
    }

    public void setListData(List<T> listData) {
        this.listData = listData;
    }
}
