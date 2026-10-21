package com.placify.repository;

import com.placify.model.DailyGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyGoalRepository extends JpaRepository<DailyGoal, Long> {

    // Retrieve all goals sorted by target date descending
    List<DailyGoal> findAllByOrderByTargetDateDescIdDesc();

    // Retrieve goals for a specific date (e.g., today), uncompleted items first
    List<DailyGoal> findByTargetDateOrderByCompletedAscIdDesc(LocalDate targetDate);

    // Count total goals for a date
    long countByTargetDate(LocalDate targetDate);

    // Count completed goals for a date
    long countByTargetDateAndCompleted(LocalDate targetDate, boolean completed);
}
