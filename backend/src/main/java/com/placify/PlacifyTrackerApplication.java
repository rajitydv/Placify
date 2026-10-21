package com.placify;

import com.placify.model.Activity;
import com.placify.model.DailyGoal;
import com.placify.repository.ActivityRepository;
import com.placify.repository.DailyGoalRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDate;

@SpringBootApplication
public class PlacifyTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlacifyTrackerApplication.class, args);
	}

	/**
	 * Seeds realistic placement preparation activities and daily goals
	 * on application startup if the database is currently empty.
	 */
	@Bean
	CommandLineRunner initDatabase(ActivityRepository activityRepo, DailyGoalRepository goalRepo) {
		return args -> {
			if (activityRepo.count() == 0) {
				LocalDate today = LocalDate.now();

				activityRepo.save(new Activity(
						"Two Sum & 3Sum - Two Pointer Technique",
						"Coding",
						"Arrays & Hashing",
						"LeetCode",
						"Medium",
						"Completed",
						45,
						2,
						today,
						"Practiced sorting + two pointer approach. Time: O(n log n), Space: O(1)."
				));

				activityRepo.save(new Activity(
						"Percentages, Profit & Loss Practice Set",
						"Aptitude",
						"Quantitative Aptitude",
						"IndiaBIX",
						"Easy",
						"Completed",
						40,
						15,
						today,
						"Formula recap: Profit% = (Profit/CP)*100. Solved 15 previous campus questions."
				));

				activityRepo.save(new Activity(
						"Full-Length Campus Online Assessment Mock 1",
						"Mock Test",
						"TCS NQT / Infosys Pattern",
						"College Portal",
						"Hard",
						"Completed",
						90,
						1,
						today.minusDays(1),
						"Score: 82%. Needs speed improvement in Logical Reasoning puzzles."
				));

				activityRepo.save(new Activity(
						"Binary Tree Inorder, Preorder, Postorder Traversal",
						"Coding",
						"Trees & Graphs",
						"GeeksforGeeks",
						"Medium",
						"Completed",
						50,
						3,
						today.minusDays(1),
						"Implemented recursive and iterative solutions using explicit Stack."
				));

				activityRepo.save(new Activity(
						"Operating Systems - Deadlocks & Banker's Algorithm",
						"Core CS",
						"Operating Systems",
						"Textbook / Notes",
						"Medium",
						"Completed",
						35,
						1,
						today.minusDays(2),
						"Reviewed the 4 Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait."
				));

				activityRepo.save(new Activity(
						"Blood Relations & Syllogisms Speed Drill",
						"Aptitude",
						"Logical Reasoning",
						"IndiaBIX",
						"Medium",
						"Completed",
						30,
						12,
						today.minusDays(2),
						"Draw family trees step by step. Solved 12 problems in 25 mins."
				));

				activityRepo.save(new Activity(
						"DBMS Normalization (1NF, 2NF, 3NF, BCNF) & SQL Joins",
						"Core CS",
						"Database Management Systems",
						"GFG / YouTube",
						"Easy",
						"Completed",
						45,
						1,
						today.minusDays(3),
						"Reviewed functional dependencies and lossy vs lossless decomposition."
				));

				activityRepo.save(new Activity(
						"Dynamic Programming - 0/1 Knapsack & Subset Sum",
						"Coding",
						"Dynamic Programming",
						"LeetCode",
						"Hard",
						"Needs Revision",
						60,
						2,
						today.minusDays(3),
						"Understood 2D DP matrix transitions. Need to practice space optimization to 1D array."
				));

				activityRepo.save(new Activity(
						"HR Technical Round: Tell Me About Yourself & Projects Pitch",
						"Resume/HR",
						"Behavioral & Projects",
						"Mock Interviewer",
						"Easy",
						"Completed",
						30,
						1,
						today.minusDays(4),
						"Structured response using STAR method (Situation, Task, Action, Result)."
				));
			}

			if (goalRepo.count() == 0) {
				LocalDate today = LocalDate.now();

				goalRepo.save(new DailyGoal(
						"Solve 3 LeetCode Medium (Binary Search / Two Pointers)",
						"Coding",
						today,
						3,
						2,
						false
				));

				goalRepo.save(new DailyGoal(
						"Complete 15 Aptitude questions on Time & Work",
						"Aptitude",
						today,
						15,
						15,
						true
				));

				goalRepo.save(new DailyGoal(
						"Revise DBMS ACID Properties and Indexing (B-Tree vs Hash)",
						"Core CS",
						today,
						1,
						1,
						true
				));

				goalRepo.save(new DailyGoal(
						"Attempt 1 Full Mock Assessment Test",
						"Mock Test",
						today,
						1,
						0,
						false
				));
			}
		};
	}
}
