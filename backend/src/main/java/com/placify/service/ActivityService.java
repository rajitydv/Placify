package com.placify.service;

import com.placify.model.Activity;
import com.placify.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    @Autowired
    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    /**
     * Get all activities with optional filters and search keyword.
     */
    public List<Activity> getAllActivities(String category, String status, String difficulty, String search) {
        List<Activity> list = activityRepository.findAllByOrderByActivityDateDescIdDesc();

        return list.stream()
                .filter(a -> category == null || category.equalsIgnoreCase("All") || (a.getCategory() != null && a.getCategory().equalsIgnoreCase(category)))
                .filter(a -> status == null || status.equalsIgnoreCase("All") || (a.getStatus() != null && a.getStatus().equalsIgnoreCase(status)))
                .filter(a -> difficulty == null || difficulty.equalsIgnoreCase("All") || (a.getDifficulty() != null && a.getDifficulty().equalsIgnoreCase(difficulty)))
                .filter(a -> {
                    if (search == null || search.trim().isEmpty()) {
                        return true;
                    }
                    String term = search.toLowerCase();
                    boolean matchTitle = a.getTitle() != null && a.getTitle().toLowerCase().contains(term);
                    boolean matchTopic = a.getTopic() != null && a.getTopic().toLowerCase().contains(term);
                    boolean matchPlatform = a.getPlatform() != null && a.getPlatform().toLowerCase().contains(term);
                    boolean matchNotes = a.getNotes() != null && a.getNotes().toLowerCase().contains(term);
                    return matchTitle || matchTopic || matchPlatform || matchNotes;
                })
                .collect(Collectors.toList());
    }

    public Optional<Activity> getActivityById(Long id) {
        return activityRepository.findById(id);
    }

    public Activity createActivity(Activity activity) {
        if (activity.getActivityDate() == null) {
            activity.setActivityDate(LocalDate.now());
        }
        if (activity.getQuestionsSolved() == null) {
            activity.setQuestionsSolved(1);
        }
        if (activity.getDurationMinutes() == null) {
            activity.setDurationMinutes(30);
        }
        if (activity.getStatus() == null || activity.getStatus().trim().isEmpty()) {
            activity.setStatus("Completed");
        }
        return activityRepository.save(activity);
    }

    public Activity updateActivity(Long id, Activity updated) {
        Activity existing = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found with id: " + id));

        existing.setTitle(updated.getTitle());
        existing.setCategory(updated.getCategory());
        existing.setTopic(updated.getTopic());
        existing.setPlatform(updated.getPlatform());
        existing.setDifficulty(updated.getDifficulty());
        existing.setStatus(updated.getStatus());
        existing.setDurationMinutes(updated.getDurationMinutes());
        existing.setQuestionsSolved(updated.getQuestionsSolved());
        existing.setActivityDate(updated.getActivityDate() != null ? updated.getActivityDate() : existing.getActivityDate());
        existing.setNotes(updated.getNotes());

        return activityRepository.save(existing);
    }

    public void deleteActivity(Long id) {
        activityRepository.deleteById(id);
    }
}
