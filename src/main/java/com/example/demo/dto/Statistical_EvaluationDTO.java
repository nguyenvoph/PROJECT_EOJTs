package com.example.demo.dto;

import java.io.Serializable;
import java.util.List;

public class Statistical_EvaluationDTO implements Serializable {
    private String evaluationName;
    private List<Integer> statisticalTypeEvaluation;

    public String getEvaluationName() {
        return evaluationName;
    }

    public void setEvaluationName(String evaluationName) {
        this.evaluationName = evaluationName;
    }

    public List<Integer> getStatisticalTypeEvaluation() {
        return statisticalTypeEvaluation;
    }

    public void setStatisticalTypeEvaluation(List<Integer> statisticalTypeEvaluation) {
        this.statisticalTypeEvaluation = statisticalTypeEvaluation;
    }
}
