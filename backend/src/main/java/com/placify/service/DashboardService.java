package com.placify.service;

import com.placify.model.Activity;
import com.placify.model.DailyGoal;
import com.placify.model.DashboardStats;
import com.placify.repository.ActivityRepository;
import com.placify.repository.DailyGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ActivityRepository activityRepository;
    private final DailyGoalRepository goalRepository;

    @Autowired
    public DashboardService(ActivityRepository activityRepository, DailyGoalRepository goalRepository) {
        this.activityRepository = activityRepository;
        this.goalRepository = goalRepository;
    }

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();

        // 1. Core Metrics
        long codingQuestions = activityRepository.sumQuestionsSolvedByCategory("Coding");
        long aptitudeQuestions = activityRepository.sumQuestionsSolvedByCategory("Aptitude");
        long mockTests = activityRepository.countByCategoryIgnoreCase("Mock Test");
        long totalActivities = activityRepository.count();
        long totalMinutes = activityRepository.sumTotalDurationMinutes();

        stats.setTotalCodingQuestions(codingQuestions);
        stats.setTotalAptitudeQuestions(aptitudeQuestions);
        stats.setTotalMockTests(mockTests);
        stats.setTotalActivities(totalActivities);
        stats.setTotalStudyMinutes(totalMinutes);

        // 2. Goal Statistics
        LocalDate today = LocalDate.now();
        List<DailyGoal> todayGoals = goalRepository.findByTargetDateOrderByCompletedAscIdDesc(today);
        if (todayGoals.isEmpty()) {
            todayGoals = goalRepository.findAllByOrderByTargetDateDescIdDesc().stream().limit(5).collect(Collectors.toList());
        }
        int totalGoals = todayGoals.size();
        int completedGoals = (int) todayGoals.stream().filter(DailyGoal::isCompleted).count();
        int goalsPercentage = totalGoals > 0 ? (int) Math.round(((double) completedGoals / totalGoals) * 100) : 0;

        stats.setTodayGoals(todayGoals);
        stats.setTodayGoalsTotal(totalGoals);
        stats.setTodayGoalsCompleted(completedGoals);
        stats.setTodayGoalsPercentage(goalsPercentage);

        // 3. Overall Readiness Progress calculation (0 to 100%)
        // Placement targets: 60 coding problems, 50 aptitude problems, 5 mock tests, and goal consistency
        double codingScore = Math.min((double) codingQuestions / 60.0, 1.0) * 40.0;
        double aptitudeScore = Math.min((double) aptitudeQuestions / 50.0, 1.0) * 25.0;
        double mockScore = Math.min((double) mockTests / 5.0, 1.0) * 20.0;
        double goalScore = (totalGoals > 0 ? ((double) completedGoals / totalGoals) : 0.5) * 15.0;

        int overall = (int) Math.round(codingScore + aptitudeScore + mockScore + goalScore);
        stats.setOverallProgressPercentage(Math.min(overall, 100));

        // 4. Breakdown distributions
        List<Activity> all = activityRepository.findAll();

        Map<String, Long> categoryMap = new HashMap<>();
        categoryMap.put("Coding", all.stream().filter(a -> "Coding".equalsIgnoreCase(a.getCategory())).count());
        categoryMap.put("Aptitude", all.stream().filter(a -> "Aptitude".equalsIgnoreCase(a.getCategory())).count());
        categoryMap.put("Mock Test", all.stream().filter(a -> "Mock Test".equalsIgnoreCase(a.getCategory())).count());
        categoryMap.put("Core CS", all.stream().filter(a -> "Core CS".equalsIgnoreCase(a.getCategory())).count());
        categoryMap.put("Resume/HR", all.stream().filter(a -> "Resume/HR".equalsIgnoreCase(a.getCategory()) || "Interview".equalsIgnoreCase(a.getCategory())).count());
        stats.setCategoryBreakdown(categoryMap);

        Map<String, Long> difficultyMap = new HashMap<>();
        difficultyMap.put("Easy", all.stream().filter(a -> "Easy".equalsIgnoreCase(a.getDifficulty())).count());
        difficultyMap.put("Medium", all.stream().filter(a -> "Medium".equalsIgnoreCase(a.getDifficulty())).count());
        difficultyMap.put("Hard", all.stream().filter(a -> "Hard".equalsIgnoreCase(a.getDifficulty())).count());
        stats.setDifficultyBreakdown(difficultyMap);

        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put("Completed", all.stream().filter(a -> "Completed".equalsIgnoreCase(a.getStatus())).count());
        statusMap.put("In Progress", all.stream().filter(a -> "In Progress".equalsIgnoreCase(a.getStatus())).count());
        statusMap.put("Needs Revision", all.stream().filter(a -> "Needs Revision".equalsIgnoreCase(a.getStatus())).count());
        stats.setStatusBreakdown(statusMap);

        // 5. Recent 5 activities
        stats.setRecentActivities(activityRepository.findTop5ByOrderByActivityDateDescIdDesc());

        return stats;
    }
}
