package com.placify.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entity representing a placement preparation activity
 * (e.g. Coding question, Aptitude practice set, Mock test, Core CS subject revision).
 */
@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // Coding, Aptitude, Mock Test, Core CS, Resume/HR

    private String topic; // e.g., Dynamic Programming, Quantitative, OS, DBMS

    private String platform; // LeetCode, HackerRank, IndiaBIX, GeeksforGeeks, etc.

    private String difficulty; // Easy, Medium, Hard

    private String status; // Completed, In Progress, Needs Revision

    private Integer durationMinutes; // Study time spent in minutes

    private Integer questionsSolved; // Count of questions solved or score obtained

    private LocalDate activityDate;

    @Column(length = 1000)
    private String notes; // Solution notes, approach, or problem URL

    // Default constructor (required by JPA)
    public Activity() {
    }

    public Activity(String title, String category, String topic, String platform,
                    String difficulty, String status, Integer durationMinutes,
                    Integer questionsSolved, LocalDate activityDate, String notes) {
        this.title = title;
        this.category = category;
        this.topic = topic;
        this.platform = platform;
        this.difficulty = difficulty;
        this.status = status;
        this.durationMinutes = durationMinutes;
        this.questionsSolved = questionsSolved;
        this.activityDate = activityDate;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getQuestionsSolved() {
        return questionsSolved;
    }

    public void setQuestionsSolved(Integer questionsSolved) {
        this.questionsSolved = questionsSolved;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
