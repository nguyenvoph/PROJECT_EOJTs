package com.example.demo.utils;

import com.example.demo.dto.PagingDTO;
import com.example.demo.entity.Specialized;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class Utils<T>{

    //so sanh ty le giong nhau 2 chuoi
    public static double similarity(String s1, String s2) {
        String longer = s1, shorter = s2;
        if (s1.length() < s2.length()) {
            longer = s2;
            shorter = s1;
        }
        int longerLength = longer.length();
        if (longerLength == 0) {
            return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / (double) longerLength;

    }

    public static int editDistance(String s1, String s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        int[] costs = new int[s2.length() + 1];
        for (int i = 0; i <= s1.length(); i++) {
            int lastValue = i;
            for (int j = 0; j <= s2.length(); j++) {
                if (i == 0) {
                    costs[j] = j;
                } else {
                    if (j > 0) {
                        int newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue),
                                    costs[j]) + 1;
                        }
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) {
                costs[s2.length()] = lastValue;
            }
        }
        return costs[s2.length()];
    }

    public static boolean aDateBetweenTwoDate(String minDate, String maxDate) {
        Date min = Date.valueOf(minDate);

        Date max = Date.valueOf(maxDate);

        Date current = new Date(Calendar.getInstance().getTime().getTime());

        return current.after(min) && current.before(max);
    }

    public  PagingDTO<T> paging(List<T> list, int currentPage, int rowsPerPage) {
        int pageNumber = (int) Math.ceil((double) list.size() / (double) rowsPerPage); // ra tong so page

        int nextPageNumber = (currentPage + 1) * rowsPerPage;

        int currentPageNumber = (currentPage * rowsPerPage);

        List<T> listPagination = new ArrayList<>();

        for (int i = 0; i < list.size(); i++) {
            if (i >= currentPageNumber && i < nextPageNumber) {
                listPagination.add(list.get(i));
            }
        }

        PagingDTO pagingDTO = new PagingDTO();
        pagingDTO.setPageNumber(pageNumber);
        pagingDTO.setListData(listPagination);

        return pagingDTO;
    }
}
