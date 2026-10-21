package com.placify.service;

import com.placify.model.DailyGoal;
import com.placify.repository.DailyGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    private final DailyGoalRepository goalRepository;

    @Autowired
    public GoalService(DailyGoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<DailyGoal> getTodayGoals() {
        LocalDate today = LocalDate.now();
        List<DailyGoal> todayList = goalRepository.findByTargetDateOrderByCompletedAscIdDesc(today);
        // If there are no goals explicitly for today, return the most recent active goals
        if (todayList.isEmpty()) {
            return goalRepository.findAllByOrderByTargetDateDescIdDesc().stream().limit(5).toList();
        }
        return todayList;
    }

    public List<DailyGoal> getAllGoals() {
        return goalRepository.findAllByOrderByTargetDateDescIdDesc();
    }

    public Optional<DailyGoal> getGoalById(Long id) {
        return goalRepository.findById(id);
    }

    public DailyGoal createGoal(DailyGoal goal) {
        if (goal.getTargetDate() == null) {
            goal.setTargetDate(LocalDate.now());
        }
        if (goal.getTargetCount() == null || goal.getTargetCount() <= 0) {
            goal.setTargetCount(1);
        }
        if (goal.getCompletedCount() == null) {
            goal.setCompletedCount(0);
        }
        return goalRepository.save(goal);
    }

    public DailyGoal updateGoal(Long id, DailyGoal updated) {
        DailyGoal existing = goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found with id: " + id));

        existing.setTitle(updated.getTitle());
        existing.setCategory(updated.getCategory());
        existing.setTargetDate(updated.getTargetDate() != null ? updated.getTargetDate() : existing.getTargetDate());
        existing.setTargetCount(updated.getTargetCount());
        existing.setCompletedCount(updated.getCompletedCount());
        existing.setCompleted(updated.isCompleted());

        return goalRepository.save(existing);
    }

    public DailyGoal toggleGoalCompletion(Long id) {
        DailyGoal existing = goalRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Goal not found with id: " + id));

        boolean newStatus = !existing.isCompleted();
        existing.setCompleted(newStatus);
        if (newStatus && (existing.getCompletedCount() == null || existing.getCompletedCount() < existing.getTargetCount())) {
            existing.setCompletedCount(existing.getTargetCount());
        }
        return goalRepository.save(existing);
    }

    public void deleteGoal(Long id) {
        goalRepository.deleteById(id);
    }
}
