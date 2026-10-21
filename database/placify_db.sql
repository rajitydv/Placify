-- =======================================================
-- Placify – Placement Preparation Tracker
-- Database Schema & Sample Data Setup Script
-- Compatible with MySQL 8.0+ / MariaDB
-- =======================================================

-- 1. Create the Placify database if it does not exist
CREATE DATABASE IF NOT EXISTS placify_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE placify_db;

-- 2. Drop existing tables if re-initializing (safe order)
DROP TABLE IF EXISTS daily_goals;
DROP TABLE IF EXISTS activities;

-- 3. Table: activities
-- Stores all preparation logs (coding problems, aptitude sets, mock tests, core CS revisions)
CREATE TABLE activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    topic VARCHAR(150),
    platform VARCHAR(100),
    difficulty VARCHAR(50) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'Completed',
    duration_minutes INT DEFAULT 30,
    questions_solved INT DEFAULT 1,
    activity_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_activity_date (activity_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: daily_goals
-- Stores daily task targets and checklist completion status
CREATE TABLE daily_goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    target_date DATE NOT NULL,
    target_count INT DEFAULT 1,
    completed_count INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_target_date (target_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Seed Data: Realistic Placement Preparation Records
INSERT INTO activities (title, category, topic, platform, difficulty, status, duration_minutes, questions_solved, activity_date, notes) VALUES
('Two Sum & 3Sum - Two Pointer Technique', 'Coding', 'Arrays & Hashing', 'LeetCode', 'Medium', 'Completed', 45, 2, CURDATE(), 'Mastered sorted array two-pointer reduction from O(n^2) to O(n).'),
('Percentages, Profit & Loss Practice Set', 'Aptitude', 'Quantitative Aptitude', 'IndiaBIX', 'Easy', 'Completed', 40, 15, CURDATE(), 'Formula recap: Profit% = (Profit/CP)*100. Solved 15 campus questions.'),
('Full-Length Campus Online Assessment Mock 1', 'Mock Test', 'TCS NQT / Infosys Pattern', 'College Portal', 'Hard', 'Completed', 90, 1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Score: 82%. Needs speed improvement in Logical Reasoning blood relations.'),
('Binary Tree Traversals (Inorder, Preorder, Postorder)', 'Coding', 'Trees & Graphs', 'GeeksforGeeks', 'Medium', 'Completed', 50, 3, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Implemented both recursion and iterative stack approaches.'),
('Operating Systems - Deadlocks & Banker\'s Algorithm', 'Core CS', 'Operating Systems', 'Textbook / Notes', 'Medium', 'Completed', 35, 1, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Memorized the 4 Coffman conditions and safe state matrices.'),
('Blood Relations & Syllogisms Speed Drill', 'Aptitude', 'Logical Reasoning', 'IndiaBIX', 'Medium', 'Completed', 30, 12, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Solved 12 problems in 25 mins using family tree branch diagrams.'),
('DBMS Normalization (1NF, 2NF, 3NF, BCNF) & SQL Joins', 'Core CS', 'Database Systems', 'GFG / Notes', 'Easy', 'Completed', 45, 1, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Understood functional dependencies and decomposition without loss.'),
('Dynamic Programming - 0/1 Knapsack & Subset Sum', 'Coding', 'Dynamic Programming', 'LeetCode', 'Hard', 'Needs Revision', 60, 2, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Struggled with space optimization to 1D array. Review tabulation table.'),
('HR Technical Round: Elevator Pitch & STAR Projects Pitch', 'Resume/HR', 'Behavioral & Projects', 'Mock Interviewer', 'Easy', 'Completed', 30, 1, DATE_SUB(CURDATE(), INTERVAL 4 DAY), 'Formulated STAR stories for final year project and conflict resolution.');

-- 6. Seed Data: Daily Goals
INSERT INTO daily_goals (title, category, target_date, target_count, completed_count, completed) VALUES
('Solve 3 LeetCode Medium (Binary Search / Two Pointers)', 'Coding', CURDATE(), 3, 2, FALSE),
('Complete 15 Aptitude questions on Time & Work', 'Aptitude', CURDATE(), 15, 15, TRUE),
('Revise DBMS ACID Properties and Indexing (B-Tree vs Hash)', 'Core CS', CURDATE(), 1, 1, TRUE),
('Attempt 1 Full Mock Assessment Test', 'Mock Test', CURDATE(), 1, 0, FALSE);

-- Verification Query
SELECT 'Placify Database initialized successfully!' AS Status;
SELECT COUNT(*) AS total_activities FROM activities;
SELECT COUNT(*) AS total_goals FROM daily_goals;
