package com.placify.controller;

import com.placify.model.DailyGoal;
import com.placify.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    private final GoalService goalService;

    @Autowired
    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    /**
     * Get all daily goals.
     */
    @GetMapping
    public ResponseEntity<List<DailyGoal>> getAllGoals() {
        return ResponseEntity.ok(goalService.getAllGoals());
    }

    /**
     * Get today's daily goals.
     */
    @GetMapping("/today")
    public ResponseEntity<List<DailyGoal>> getTodayGoals() {
        return ResponseEntity.ok(goalService.getTodayGoals());
    }

    /**
     * Create a new daily goal.
     */
    @PostMapping
    public ResponseEntity<DailyGoal> createGoal(@RequestBody DailyGoal goal) {
        DailyGoal saved = goalService.createGoal(goal);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    /**
     * Update an existing goal.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DailyGoal> updateGoal(@PathVariable Long id, @RequestBody DailyGoal goal) {
        try {
            DailyGoal updated = goalService.updateGoal(id, goal);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Quick toggle completion status of a goal (checkbox action from UI).
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<DailyGoal> toggleGoal(@PathVariable Long id) {
        try {
            DailyGoal toggled = goalService.toggleGoalCompletion(id);
            return ResponseEntity.ok(toggled);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete a goal.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable Long id) {
        try {
            goalService.deleteGoal(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
