package com.placify.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entity representing a daily placement preparation goal or checklist item.
 */
@Entity
@Table(name = "daily_goals")
public class DailyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String category; // Coding, Aptitude, Mock Test, Core CS, General

    private LocalDate targetDate;

    private Integer targetCount; // e.g. 3 questions or 60 minutes

    private Integer completedCount; // e.g. 3 completed

    private boolean completed;

    // Default constructor
    public DailyGoal() {
    }

    public DailyGoal(String title, String category, LocalDate targetDate, Integer targetCount, Integer completedCount, boolean completed) {
        this.title = title;
        this.category = category;
        this.targetDate = targetDate;
        this.targetCount = targetCount;
        this.completedCount = completedCount;
        this.completed = completed;
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

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }

    public Integer getTargetCount() {
        return targetCount;
    }

    public void setTargetCount(Integer targetCount) {
        this.targetCount = targetCount;
    }

    public Integer getCompletedCount() {
        return completedCount;
    }

    public void setCompletedCount(Integer completedCount) {
        this.completedCount = completedCount;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
