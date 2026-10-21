package com.placify.controller;

import com.placify.model.DashboardStats;
import com.placify.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * Get aggregated dashboard statistics:
     * - Total coding questions
     * - Total aptitude questions
     * - Total mock tests
     * - Total activities and study hours
     * - Overall placement readiness progress percentage
     * - Today's goals progress
     * - Category and difficulty breakdowns for charts
     * - 5 most recent activities
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        DashboardStats stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Returns whether the backend is actively connected to MySQL or fallback in-memory database.
     */
    @GetMapping("/db-status")
    public ResponseEntity<java.util.Map<String, Object>> getDatabaseStatus() {
        java.util.Map<String, Object> status = new java.util.HashMap<>();
        status.put("connectedToMySQL", com.placify.config.DataSourceConfig.isConnectedToMySQL);
        status.put("activeDatabase", com.placify.config.DataSourceConfig.activeDatabaseType);
        return ResponseEntity.ok(status);
    }
}
