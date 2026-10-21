package com.placify.model;

import java.util.List;
import java.util.Map;

/**
 * Data Transfer Object (DTO) for conveying all aggregated statistics
 * required by the Placify Dashboard.
 */
public class DashboardStats {

    private long totalCodingQuestions;
    private long totalAptitudeQuestions;
    private long totalMockTests;
    private long totalActivities;
    private long totalStudyMinutes;
    private int overallProgressPercentage;

    private int todayGoalsCompleted;
    private int todayGoalsTotal;
    private int todayGoalsPercentage;

    private Map<String, Long> categoryBreakdown;
    private Map<String, Long> difficultyBreakdown;
    private Map<String, Long> statusBreakdown;

    private List<Activity> recentActivities;
    private List<DailyGoal> todayGoals;

    public DashboardStats() {
    }

    public long getTotalCodingQuestions() {
        return totalCodingQuestions;
    }

    public void setTotalCodingQuestions(long totalCodingQuestions) {
        this.totalCodingQuestions = totalCodingQuestions;
    }

    public long getTotalAptitudeQuestions() {
        return totalAptitudeQuestions;
    }

    public void setTotalAptitudeQuestions(long totalAptitudeQuestions) {
        this.totalAptitudeQuestions = totalAptitudeQuestions;
    }

    public long getTotalMockTests() {
        return totalMockTests;
    }

    public void setTotalMockTests(long totalMockTests) {
        this.totalMockTests = totalMockTests;
    }

    public long getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(long totalActivities) {
        this.totalActivities = totalActivities;
    }

    public long getTotalStudyMinutes() {
        return totalStudyMinutes;
    }

    public void setTotalStudyMinutes(long totalStudyMinutes) {
        this.totalStudyMinutes = totalStudyMinutes;
    }

    public int getOverallProgressPercentage() {
        return overallProgressPercentage;
    }

    public void setOverallProgressPercentage(int overallProgressPercentage) {
        this.overallProgressPercentage = overallProgressPercentage;
    }

    public int getTodayGoalsCompleted() {
        return todayGoalsCompleted;
    }

    public void setTodayGoalsCompleted(int todayGoalsCompleted) {
        this.todayGoalsCompleted = todayGoalsCompleted;
    }

    public int getTodayGoalsTotal() {
        return todayGoalsTotal;
    }

    public void setTodayGoalsTotal(int todayGoalsTotal) {
        this.todayGoalsTotal = todayGoalsTotal;
    }

    public int getTodayGoalsPercentage() {
        return todayGoalsPercentage;
    }

    public void setTodayGoalsPercentage(int todayGoalsPercentage) {
        this.todayGoalsPercentage = todayGoalsPercentage;
    }

    public Map<String, Long> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(Map<String, Long> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public Map<String, Long> getDifficultyBreakdown() {
        return difficultyBreakdown;
    }

    public void setDifficultyBreakdown(Map<String, Long> difficultyBreakdown) {
        this.difficultyBreakdown = difficultyBreakdown;
    }

    public Map<String, Long> getStatusBreakdown() {
        return statusBreakdown;
    }

    public void setStatusBreakdown(Map<String, Long> statusBreakdown) {
        this.statusBreakdown = statusBreakdown;
    }

    public List<Activity> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(List<Activity> recentActivities) {
        this.recentActivities = recentActivities;
    }

    public List<DailyGoal> getTodayGoals() {
        return todayGoals;
    }

    public void setTodayGoals(List<DailyGoal> todayGoals) {
        this.todayGoals = todayGoals;
    }
}
