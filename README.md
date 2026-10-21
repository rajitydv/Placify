# Placify – Placement Preparation Tracker 🎓🚀

[![Java](https://img.shields.io/badge/Java-17%20%7C%2021%20%7C%2025-orange.svg?logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.x%20%2F%203.x-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue.svg?logo=mysql)](https://www.mysql.com/)
[![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JS-yellow.svg)](https://developer.mozilla.org/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

A clean, modern, and beginner-friendly web application created for college students and job aspirants to plan, track, and analyze campus placement preparation across **Coding (Data Structures & Algorithms)**, **Aptitude Drills**, **Full-Length Mock Assessments**, and **Core CS Subjects**.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Folder Structure](#-project-folder-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
  - [Method 1: 1-Click Windows Runner](#method-1-1-click-windows-runner-recommended)
  - [Method 2: Command Line (Windows / macOS / Linux)](#method-2-command-line-windows--macos--linux)
- [Database Setup (MySQL)](#-database-setup-mysql)
- [REST API Reference](#-rest-api-reference)
- [Troubleshooting & FAQs](#-troubleshooting--faqs)
- [How to Upload to GitHub](#-how-to-upload-to-github)
- [Final-Year Project Viva & Interview Questions](#-final-year-project-viva--interview-questions)
- [License](#-license)

---

## 🌟 Key Features

1. **Intuitive Dashboard & Analytics**:
   - Real-time counters for **Coding Problems Solved**, **Aptitude Practice Questions**, and **Mock Tests Attempted**.
   - **Placement Readiness Progress Meter**: A weighted readiness score (0–100%) dynamically calculated from your practice volume and daily goal consistency.
   - Total study time tracker formatted in hours and minutes.
2. **Preparation Activity Management (Full CRUD)**:
   - **Create, Read, Update, and Delete** preparation logs across categories: `Coding`, `Aptitude`, `Mock Test`, `Core CS`, and `Resume/HR`.
   - Real-time search by keyword (topics, platforms, problem names, notes) with instant debouncing.
   - Multi-criteria filtering by **Category**, **Difficulty** (Easy, Medium, Hard), and **Status** (Completed, In Progress, Needs Revision).
   - Dedicated modal view detailing solution approaches, formulas, time/space complexity, and external links.
3. **Daily Study Goals & Accountability Checklist**:
   - Set daily targets (e.g., *"Solve 3 LeetCode Mediums"*, *"Revise DBMS ACID Properties"*).
   - 1-click interactive checkbox to instantly toggle completion in the database.
   - Live daily goal completion percentage bar.
4. **Interactive Visual Progress Charts (Chart.js)**:
   - Category Distribution (Doughnut Chart).
   - Difficulty Breakdown (Bar Chart: Easy, Medium, Hard).
   - Status Distribution (Completed, In Progress, Needs Revision).
   - Campus benchmark comparisons (Target: 60 DSA problems, 50 Aptitude drills, 5 Mock tests).
5. **Robust Database Storage with Smart Fallback**:
   - Persistent MySQL storage powered by Spring Data JPA.
   - **Zero-Crash Resiliency**: Includes an intelligent `DataSourceConfig` that detects MySQL at boot time. If MySQL credentials differ or MySQL is temporarily paused, Placify automatically initializes an in-memory database so your application always starts reliably during college vivas and presentations.
6. **Modern, Responsive UI**:
   - Sleek dark theme (default) and clean light theme with smooth toggle.
   - Glassmorphic card surfaces, gradient progress rings, status badges, and floating toast notifications.

---

## 🛠️ Technology Stack

| Layer | Technologies | Role & Purpose |
|---|---|---|
| **Frontend** | HTML5, Vanilla CSS3, JavaScript (ES6+) | Clean, responsive single-page experience without heavy frontend framework bloat (no React/Angular needed). |
| **Styling & Icons** | Vanilla CSS Design System, Font Awesome 6 | Glassmorphic cards, custom progress rings, responsive grid, and vector icons. |
| **Data Visualization** | Chart.js 4 (via CDN) | Lightweight, interactive doughnut, bar, and progress charts. |
| **Backend** | Java (Spring Boot 4.x / 3.x) | Lightweight REST APIs with Spring Web and Spring Data JPA. |
| **Database** | MySQL 8.0+ | Relational schema (`placify_db`) with indexed tables (`activities`, `daily_goals`). |
| **Build & Dependency Management** | Apache Maven (Maven Wrapper included) | Built-in `mvnw` and `mvnw.cmd` scripts; no separate Maven installation required. |

---

## 🏛️ System Architecture

Placify follows the industry-standard **3-Tier Layered Architecture** (Model-View-Controller pattern):

```text
  ┌────────────────────────────────────────────────────────┐
  │                 CLIENT BROWSER (UI)                    │
  │     HTML5  •  Vanilla CSS3  •  JavaScript (ES6+)       │
  │          (Dashboard, Activities, Goals, Charts)        │
  └──────────────────────────┬─────────────────────────────┘
                             │  HTTP / REST (JSON)
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │              SPRING BOOT APPLICATION (PORT 8080)       │
  │                                                        │
  │  [Controller Layer]                                    │
  │    • ActivityController   • GoalController             │
  │    • DashboardController                               │
  │                             │                          │
  │  [Service Layer]            ▼                          │
  │    • ActivityService      • GoalService                │
  │    • DashboardService (Readiness calculations)         │
  │                             │                          │
  │  [Repository Layer]         ▼                          │
  │    • ActivityRepository   • DailyGoalRepository        │
  │      (Spring Data JPA / Hibernate ORM)                 │
  └──────────────────────────┬─────────────────────────────┘
                             │  JDBC Connection
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │                   MYSQL DATABASE                       │
  │               Database: placify_db                     │
  │     Tables: activities  •  daily_goals                 │
  └────────────────────────────────────────────────────────┘
```

---

## 📁 Project Folder Structure

```text
Placify/
├── backend/                                # Java Spring Boot REST API
│   ├── src/main/java/com/placify/
│   │   ├── config/
│   │   │   └── DataSourceConfig.java      # Smart MySQL detection & fallback
│   │   ├── controller/
│   │   │   ├── ActivityController.java    # REST API for Activity CRUD
│   │   │   ├── GoalController.java        # REST API for Daily Goals
│   │   │   └── DashboardController.java   # Aggregated metrics & DB status
│   │   ├── model/
│   │   │   ├── Activity.java              # JPA Entity for Activities
│   │   │   ├── DailyGoal.java             # JPA Entity for Goals
│   │   │   └── DashboardStats.java        # DTO for Dashboard stats
│   │   ├── repository/
│   │   │   ├── ActivityRepository.java    # Spring Data JPA queries
│   │   │   └── DailyGoalRepository.java   # Goal queries
│   │   ├── service/
│   │   │   ├── ActivityService.java       # Business logic for activities
│   │   │   ├── GoalService.java           # Business logic for goals
│   │   │   └── DashboardService.java      # Progress calculation logic
│   │   └── PlacifyTrackerApplication.java # Spring Boot entry + sample seed runner
│   ├── src/main/resources/
│   │   ├── application.properties         # Database connection settings
│   │   └── static/                        # Bundled Frontend (served at port 8080)
│   │       ├── index.html
│   │       ├── css/style.css
│   │       └── js/app.js
│   ├── pom.xml                                    # Maven dependencies
│   ├── mvnw & mvnw.cmd                            # Maven Wrapper (cross-platform)
│   └── .mvn/
├── frontend/                               # Standalone Frontend (for Live Server)
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── database/                               # Database Files
│   ├── placify_db.sql                             # Complete MySQL schema & seed data
│   └── README.md                                  # MySQL setup instructions
├── run.bat                                 # 1-Click Windows execution script
├── .gitignore                              # Clean Git ignores
└── README.md                               # Project documentation
```

---

## 📋 Prerequisites

Before running the project locally, verify you have:

1. **Java Development Kit (JDK) 17 or higher** (JDK 21 or 25 recommended).
   Check your version:
   ```bash
   java -version
   ```
2. **MySQL Server 8.0+** (installed and running).
3. **A modern web browser** (Chrome, Edge, Firefox, or Safari).

*(Note: You do **not** need to install Apache Maven separately; the included Maven Wrapper `mvnw.cmd` / `mvnw` handles everything automatically).*

---

## ⚡ Quick Start Guide

### Method 1: 1-Click Windows Runner (Recommended)

1. Navigate to the project root folder:
   ```text
   Placify/
   ```
2. Double-click the file **`run.bat`**.
3. The script will:
   - Check your Java installation.
   - Start the Spring Boot backend server on port `8080`.
   - Automatically open **`http://localhost:8080`** in your default web browser!

---

### Method 2: Command Line (Windows / macOS / Linux)

#### On Windows (PowerShell or Command Prompt):
```powershell
# Navigate to the backend directory
cd backend

# Run the Spring Boot application using the Maven Wrapper
.\mvnw.cmd spring-boot:run
```

#### On macOS / Linux:
```bash
# Navigate to the backend directory
cd backend

# Grant execute permission to wrapper (first time only)
chmod +x ./mvnw

# Run the application
./mvnw spring-boot:run
```

Once the terminal prints:
```text
Started PlacifyTrackerApplication in X.XXX seconds
```
Open your browser and navigate to:  
👉 **`http://localhost:8080`**

---

## 🗄️ Database Setup (MySQL)

### Step 1: Execute the SQL Schema Script

You can import the database script using any of the following methods:

#### Option A: Using MySQL Command Line Client (Fastest)
1. Open terminal in the `Placify` root directory.
2. Run:
   ```bash
   mysql -u root -p < database/placify_db.sql
   ```
   *(Enter your MySQL root password when prompted).*

#### Option B: Using MySQL Workbench
1. Open **MySQL Workbench** and connect to your local instance (`localhost:3306`).
2. Go to **File** > **Open SQL Script...** (or press `Ctrl + Shift + O`).
3. Select `database/placify_db.sql`.
4. Click the **Execute (Lightning icon)** button to run the script.
5. In the left **Schemas** panel, right-click and click **Refresh All**. You will see `placify_db` with `activities` and `daily_goals` tables.

---

### Step 2: Configure Database Credentials

Open `backend/src/main/resources/application.properties`:

```properties
# MySQL Connection Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/placify_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
# Change 'root' below to your actual local MySQL password:
spring.datasource.password=root
```

> **Smart Fallback Note**: If your MySQL password is not configured yet or the MySQL service is stopped, Placify automatically starts with an in-memory database so the project runs immediately without crashing. The live navbar badge displays whether it is connected to MySQL or fallback.

---

## 📡 REST API Reference

All endpoints accept and return JSON. CORS is enabled (`@CrossOrigin(origins = "*")`).

### Dashboard & Health Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated dashboard metrics, readiness index, and chart datasets |
| `GET` | `/api/dashboard/db-status` | Active database indicator (`MySQL` vs `In-Memory Fallback`) |

### Activities Endpoints (CRUD)

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/activities` | `category`, `difficulty`, `status`, `search` | List all activities with optional filters |
| `GET` | `/api/activities/{id}` | - | Retrieve single activity details |
| `POST` | `/api/activities` | - | Create a new preparation activity |
| `PUT` | `/api/activities/{id}` | - | Update an existing activity |
| `DELETE` | `/api/activities/{id}` | - | Delete an activity |

#### Sample Activity Request Body (`POST /api/activities`):
```json
{
  "title": "Sliding Window Maximum",
  "category": "Coding",
  "topic": "Queues & Sliding Window",
  "platform": "LeetCode",
  "difficulty": "Hard",
  "status": "Completed",
  "questionsSolved": 1,
  "durationMinutes": 45,
  "activityDate": "2026-10-22",
  "notes": "Maintained monotonically decreasing deque of indices. Time: O(n), Space: O(k)."
}
```

### Daily Goals Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/goals` | List all study goals |
| `GET` | `/api/goals/today` | List today's study goals |
| `POST` | `/api/goals` | Create a new daily study goal |
| `PUT` | `/api/goals/{id}` | Update an existing goal |
| `PATCH` | `/api/goals/{id}/toggle` | Quick toggle completion checkbox of a goal |
| `DELETE` | `/api/goals/{id}` | Delete a goal |

#### Sample Goal Request Body (`POST /api/goals`):
```json
{
  "title": "Solve 3 LeetCode Medium (Binary Search)",
  "category": "Coding",
  "targetDate": "2026-10-22",
  "targetCount": 3,
  "completedCount": 0,
  "completed": false
}
```

---

## 🔧 Troubleshooting & FAQs

### Q1: `Web server failed to start. Port 8080 was already in use.`
- **Cause**: Another background process or previous run is already listening on port 8080.
- **Solution (Windows PowerShell)**:
  ```powershell
  # Find the process ID using port 8080
  Get-NetTCPConnection -LocalPort 8080 | Select-Object OwningProcess

  # Stop the process (replace <PID> with the number from above)
  Stop-Process -Id <PID> -Force
  ```
- **Alternative**: You can change the port in `backend/src/main/resources/application.properties`:
  ```properties
  server.port=8081
  ```

---

### Q2: `Access denied for user 'root'@'localhost' (using password: YES)`
- **Cause**: The password configured in `application.properties` does not match your local MySQL root password.
- **Solution**: Open `backend/src/main/resources/application.properties` and update:
  ```properties
  spring.datasource.password=YOUR_ACTUAL_MYSQL_PASSWORD
  ```
  Then restart the backend.

---

### Q3: How do I know if Placify is storing data in MySQL?
- Look at the **status pill** in the top-right corner of the navbar:
  - 🟢 **MySQL Connected**: Data is persisted directly to your MySQL database `placify_db`.
  - 🟡 **In-Memory Fallback**: Placify is running smoothly in memory because MySQL credentials were not matched yet. Update `application.properties` to connect to MySQL.

---

## 📤 How to Upload to GitHub

Follow these steps from the root `Placify` folder:

```bash
# 1. Initialize git (if not already done)
git init -b main

# 2. Stage all project files
git add .

# 3. Create the initial commit
git commit -m "Initial commit: Placify - Placement Preparation Tracker"

# 4. Create a new repository on GitHub (https://github.com/new)
# Leave "Initialize with README" UNCHECKED

# 5. Link your GitHub repository (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/Placify-Placement-Tracker.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🎓 Final-Year Project Viva & Interview Questions

When presenting this project to an examiner or interviewer, use these structured answers:

### 1. What architecture does Placify use?
> *"Placify follows the standard **3-Tier Layered Architecture** adhering to Separation of Concerns:
> - **Controller Layer**: Exposes RESTful endpoints, handles HTTP requests/responses, and enforces CORS policies.
> - **Service Layer**: Contains business logic, including calculating dynamic weighted readiness scores and goal completion percentages.
> - **Repository Layer**: Uses Spring Data JPA interfaces extending `JpaRepository` for clean ORM operations on MySQL without writing error-prone boilerplate SQL.
> - **Model Layer**: Contains JPA entities (`Activity`, `DailyGoal`) and DTOs (`DashboardStats`)."*

### 2. How are the frontend and backend connected?
> *"The frontend is built with semantic HTML5, CSS3, and modern JavaScript. It communicates asynchronously with the Java Spring Boot backend using standard `fetch()` API calls sending and receiving JSON payloads. The Spring Boot backend embeds the compiled static assets, allowing the entire application to be served seamlessly on `http://localhost:8080`."*

### 3. How does the Placement Readiness Score work?
> *"The readiness score is a weighted composite index out of 100% computed in `DashboardService.java`:
> - **40% Weight**: Coding (DSA) volume relative to campus target (60 problems).
> - **25% Weight**: Aptitude practice volume relative to campus target (50 questions).
> - **20% Weight**: Full-length mock assessment completion (5 tests).
> - **15% Weight**: Daily goal completion consistency.*"

### 4. Why use Spring Data JPA over traditional JDBC?
> *"Spring Data JPA provides automatic query generation, built-in transaction management, connection pooling via HikariCP, and eliminates repetitive boilerplate like opening connections, preparing statements, and handling result sets. It also prevents SQL injection through automated parameterized queries."*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) – feel free to use, modify, and distribute it for academic and personal learning purposes.