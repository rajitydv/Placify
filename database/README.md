# Placify – Database Setup Instructions

This directory contains the SQL script for setting up the MySQL database used by **Placify – Placement Preparation Tracker**.

---

## Quick Setup Guide

### Method 1: Using MySQL Command Line Client (Fastest)

1. Open terminal in the project root directory (`Placify`).
2. Run:

```bash
mysql -u root -p < database/placify_db.sql
```

*(Enter your MySQL root password when prompted).*

Or if you are already inside the MySQL CLI prompt:

```sql
source database/placify_db.sql;
```

---

### Method 2: Using MySQL Workbench

1. Open **MySQL Workbench** and connect to your local MySQL instance (`localhost:3306`).
2. Go to `File` > `Open SQL Script...` (or press `Ctrl + Shift + O`).
3. Select `database/placify_db.sql`.
4. Click the **Execute (Lightning icon)** button to run the script.
5. In the left panel (Schemas), right-click and choose **Refresh All**. You will see `placify_db` with `activities` and `daily_goals` tables.

---

### Method 3: Automatic Auto-Creation via Spring Boot

If your MySQL service is running and credentials in `backend/src/main/resources/application.properties` match your local MySQL configuration:
- Spring Boot and Hibernate will **automatically create `placify_db` and all tables** on first startup!
- Initial realistic placement preparation records are automatically seeded.

---

## Tables Structure

### 1. `activities`
| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT AUTO_INCREMENT` | Primary Key |
| `title` | `VARCHAR(255)` | Activity title (e.g., "Two Sum") |
| `category` | `VARCHAR(100)` | Coding, Aptitude, Mock Test, Core CS, Resume/HR |
| `topic` | `VARCHAR(150)` | Sub-topic (e.g. Arrays, OS, Quantitative) |
| `platform` | `VARCHAR(100)` | LeetCode, GFG, IndiaBIX, etc. |
| `difficulty` | `VARCHAR(50)` | Easy, Medium, Hard |
| `status` | `VARCHAR(50)` | Completed, In Progress, Needs Revision |
| `duration_minutes` | `INT` | Minutes spent studying |
| `questions_solved` | `INT` | Question count or test score |
| `activity_date` | `DATE` | Date activity was performed |
| `notes` | `TEXT` | Solution approach, formulas, or link |

### 2. `daily_goals`
| Column | Type | Description |
|---|---|---|
| `id` | `BIGINT AUTO_INCREMENT` | Primary Key |
| `title` | `VARCHAR(255)` | Goal title (e.g., "Solve 3 LeetCode Mediums") |
| `category` | `VARCHAR(100)` | Coding, Aptitude, Mock Test, Core CS, General |
| `target_date` | `DATE` | Target date |
| `target_count` | `INT` | Target number of items |
| `completed_count` | `INT` | Current count achieved |
| `completed` | `BOOLEAN` | Completion check (true/false) |
