# Placify – Placement Preparation Tracker 🎓🚀

A modern, responsive, and beginner-friendly web application designed for college students and aspirants to plan, track, and analyze their campus placement preparation across **Coding (DSA)**, **Aptitude Practice**, **Full-Length Mock Assessments**, and **Core CS Subjects**.

---

## 🌟 Key Features

1. **Comprehensive Dashboard**:
   - Live metric cards showing total coding questions solved, aptitude problems practiced, and mock tests attempted.
   - **Placement Readiness Progress Meter**: A weighted readiness score (0–100%) computed dynamically from your preparation volume and consistency.
   - Total study time counter formatted in hours and minutes.
2. **Activity Management (Full CRUD)**:
   - Log, view, edit, and delete activities across categories: `Coding`, `Aptitude`, `Mock Test`, `Core CS`, and `Resume/HR`.
   - Real-time search and multi-criteria filters (by Category, Difficulty, and Status).
   - Detailed modal view displaying solution approaches, key formulas, time/space complexity, and notes.
3. **Daily Study Goals & Accountability Checklist**:
   - Plan daily targets (e.g., "Solve 3 LeetCode Mediums", "Revise OS Banker's Algorithm").
   - 1-click interactive checkbox toggle that instantly updates completion status in the database.
   - Real-time daily goal completion percentage bar.
4. **Interactive Progress Charts & Analytics**:
   - Visual category distribution chart (Doughnut).
   - Difficulty breakdown (Bar chart: Easy vs. Medium vs. Hard).
   - Status distribution (Completed vs. In Progress vs. Needs Revision).
   - Campus benchmark comparisons (Target 60 DSA problems, 50 Aptitude drills, 5 Mock tests).
5. **Robust Database Storage**:
   - Persistent MySQL storage with Spring Data JPA.
   - **Resilient Fallback**: If MySQL credentials differ or the MySQL service is temporarily paused, Placify automatically uses an in-memory database so the app can be demoed without crashing, while indicating database status live on the navbar.
6. **Polished Modern UI**:
   - Clean dark/light theme with smooth toggle.
   - Glassmorphic card surfaces, gradient accents, and responsive layout for mobile, tablet, and widescreen.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend** | HTML5, Vanilla CSS3, JavaScript (ES6+) | Clean, responsive UI with zero heavy frontend framework bloat; easy to understand for viva. |
| **Icons & Charts** | Font Awesome 6, Chart.js 4 | Crisp vector icons and interactive charts. |
| **Backend** | Java (Spring Boot 4.x / 3.x) | Lightweight REST APIs with Spring Web and Spring Data JPA. |
| **Database** | MySQL 8.0+ | Relational schema (`placify_db`) with indexed tables (`activities`, `daily_goals`). |
| **Build Tool** | Apache Maven (Maven Wrapper included) | No local Maven install required (`mvnw.cmd` runs automatically). |

---

## 📁 Project Folder Structure

```text
Placify/
├── backend/                                # Java Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/placify/
│   │   │   │   ├── config/
│   │   │   │   │   └── DataSourceConfig.java      # Smart MySQL detection & connection
│   │   │   │   ├── controller/
│   │   │   │   │   ├── ActivityController.java    # REST API for Activity CRUD
│   │   │   │   │   ├── GoalController.java        # REST API for Daily Goals
│   │   │   │   │   └── DashboardController.java   # Aggregated metrics & DB status
│   │   │   │   ├── model/
│   │   │   │   │   ├── Activity.java              # JPA Entity for Activities
│   │   │   │   │   ├── DailyGoal.java             # JPA Entity for Goals
│   │   │   │   │   └── DashboardStats.java        # DTO for Dashboard data
│   │   │   │   ├── repository/
│   │   │   │   │   ├── ActivityRepository.java    # Spring Data JPA queries
│   │   │   │   │   └── DailyGoalRepository.java   # Goal queries
│   │   │   │   ├── service/
│   │   │   │   │   ├── ActivityService.java       # Business logic for activities
│   │   │   │   │   ├── GoalService.java           # Business logic for goals
│   │   │   │   │   └── DashboardService.java      # Progress calculation logic
│   │   │   │   └── PlacifyTrackerApplication.java # Spring Boot entry + sample data loader
│   │   │   └── resources/
│   │   │       ├── application.properties         # Database URL, user, password
│   │   │       └── static/                        # Bundled Frontend (served at port 8080)
│   │   │           ├── index.html
│   │   │           ├── css/style.css
│   │   │           └── js/app.js
│   ├── pom.xml                                    # Maven dependencies
│   ├── mvnw & mvnw.cmd                            # Maven Wrapper scripts
│   └── .mvn/
├── frontend/                               # Standalone Frontend (for Live Server)
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── app.js
├── database/                               # Database Scripts
│   ├── placify_db.sql                             # Complete MySQL schema & seed data
│   └── README.md                                  # MySQL setup documentation
├── run.bat                                 # 1-Click Windows execution script
├── .gitignore                              # Clean Git ignores
└── README.md                               # Project documentation
```

---

## 🚀 How to Run the Project Locally

### Prerequisites
- **Java 17 or higher** (Java 21 / 25 recommended). Verify by opening terminal:
  ```bash
  java -version
  ```
- **MySQL Server 8.0+** (installed and running).

---

### Step 1: Set Up the MySQL Database

1. Open **MySQL Command Line Client** or **MySQL Workbench**.
2. Run the script provided in `database/placify_db.sql`:
   ```sql
   source C:/Users/yadav/OneDrive/Desktop/Placify/database/placify_db.sql;
   ```
   *(Or copy and paste the contents of `database/placify_db.sql` into MySQL Workbench and click Execute).*

3. Verify that `placify_db` database is created with tables `activities` and `daily_goals`.

---

### Step 2: Configure Database Credentials in `application.properties`

Open [`backend/src/main/resources/application.properties`](file:///c:/Users/yadav/OneDrive/Desktop/Placify/backend/src/main/resources/application.properties):

```properties
# MySQL Connection Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/placify_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
# Change 'root' below to your actual local MySQL password:
spring.datasource.password=your_mysql_password
```

> **Note for Evaluators**: If MySQL is not running or the password differs, Placify will automatically boot with its in-memory database so the application runs immediately without crashing!

---

### Step 3: Run the Application

#### Option A: 1-Click Runner (Windows)
Double-click [`run.bat`](file:///c:/Users/yadav/OneDrive/Desktop/Placify/run.bat) in the root directory.  
It will start the Spring Boot server and automatically open `http://localhost:8080` in your browser.

#### Option B: From Command Prompt / PowerShell
Open your terminal in the `Placify/backend` folder and run:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

Once you see:
```text
Started PlacifyTrackerApplication in X.XXX seconds
```
Open your browser and navigate to:
👉 **`http://localhost:8080`**

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Aggregated dashboard metrics, charts breakdown, and recent activities. |
| `GET` | `/api/dashboard/db-status` | Database connection status (MySQL vs In-Memory Fallback). |
| `GET` | `/api/activities` | List all activities (supports filters: `?category=...&difficulty=...&status=...&search=...`). |
| `GET` | `/api/activities/{id}` | Get single activity details by ID. |
| `POST` | `/api/activities` | Create a new preparation activity. |
| `PUT` | `/api/activities/{id}` | Update an existing activity. |
| `DELETE` | `/api/activities/{id}` | Delete an activity by ID. |
| `GET` | `/api/goals` | List all study goals. |
| `GET` | `/api/goals/today` | List today's study goals. |
| `POST` | `/api/goals` | Create a new daily study goal. |
| `PUT` | `/api/goals/{id}` | Update a goal. |
| `PATCH` | `/api/goals/{id}/toggle` | Quick toggle completion checkbox of a goal. |
| `DELETE` | `/api/goals/{id}` | Delete a goal. |

---

## 📤 How to Upload to GitHub

Follow these simple steps in terminal from the root `Placify` directory:

1. Create a new repository on [GitHub](https://github.com/new) (e.g., `Placify-Placement-Tracker`). Leave "Initialize with README" **unchecked**.
2. Open terminal in `C:\Users\yadav\OneDrive\Desktop\Placify` and run:

```bash
# 1. Stage all project files
git add .

# 2. Commit the changes
git commit -m "Initial commit: Placify - Placement Preparation Tracker"

# 3. Rename branch to main
git branch -M main

# 4. Link your remote GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/Placify-Placement-Tracker.git

# 5. Push to GitHub
git push -u origin main
```

---

## 🎓 Final-Year Project Viva / Interview Guide

When explaining this project to an examiner or interviewer, highlight these key design decisions:

1. **Architecture (Layered / Separation of Concerns)**:
   - **Controller Layer** (`ActivityController`, `GoalController`, `DashboardController`): Handles incoming HTTP requests and routes responses with proper HTTP status codes.
   - **Service Layer** (`ActivityService`, `GoalService`, `DashboardService`): Houses all business calculations (e.g. weighted readiness score, goal ratios).
   - **Repository Layer** (`ActivityRepository`, `DailyGoalRepository`): Extends Spring Data JPA for seamless, high-performance database interactions without writing raw JDBC boilerplate.
   - **Model Layer** (`Activity`, `DailyGoal`, `DashboardStats`): Encapsulates entity mappings and data transfer.
2. **CORS Handling**:
   - Each controller includes `@CrossOrigin(origins = "*")`, enabling decoupling so the frontend can run on the embedded server (`localhost:8080`) or via tools like VS Code Live Server (`localhost:5500`).
3. **Smart Database Resiliency**:
   - `DataSourceConfig` dynamically validates the MySQL connection at boot time; if MySQL is unavailable, it gracefully falls back to an embedded H2 database to ensure continuous uptime during demonstrations.
#   P l a c i f y  
 