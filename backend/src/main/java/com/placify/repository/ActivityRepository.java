package com.placify.repository;

import com.placify.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    // Retrieve all activities sorted by most recent date first
    List<Activity> findAllByOrderByActivityDateDescIdDesc();

    // Retrieve the 5 most recent activities for the dashboard
    List<Activity> findTop5ByOrderByActivityDateDescIdDesc();

    // Filter by category
    List<Activity> findByCategoryIgnoreCaseOrderByActivityDateDesc(String category);

    // Filter by status
    List<Activity> findByStatusIgnoreCaseOrderByActivityDateDesc(String status);

    // Filter by difficulty
    List<Activity> findByDifficultyIgnoreCaseOrderByActivityDateDesc(String difficulty);

    // Count activities by category
    long countByCategoryIgnoreCase(String category);

    // Sum questions solved for a given category (e.g. Coding or Aptitude)
    @Query("SELECT COALESCE(SUM(a.questionsSolved), 0) FROM Activity a WHERE LOWER(a.category) = LOWER(:category)")
    long sumQuestionsSolvedByCategory(String category);

    // Sum total study minutes across all activities
    @Query("SELECT COALESCE(SUM(a.durationMinutes), 0) FROM Activity a")
    long sumTotalDurationMinutes();
}
