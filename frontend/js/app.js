/**
 * Placify – Placement Preparation Tracker
 * Frontend Logic & REST API Client
 */

// Determine API Base URL dynamically
const API_BASE = window.location.origin.includes('localhost:8080')
    ? ''
    : 'http://localhost:8080';

// Global Application State
const state = {
    activities: [],
    goals: [],
    stats: null,
    dbStatus: null,
    activeTab: 'dashboard-tab',
    currentEditingActivityId: null,
    charts: {}
};

// ===================================================================
// Initialization
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initDateDisplay();
    initEventListeners();

    // Initial Data Fetch
    checkDatabaseStatus();
    loadDashboard();
    loadActivities();
    loadGoals();
});

// ===================================================================
// Theme Management
// ===================================================================
function initTheme() {
    const savedTheme = localStorage.getItem('placify-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        updateThemeIcon('light');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        updateThemeIcon('dark');
    }

    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        localStorage.setItem('placify-theme', 'light');
        updateThemeIcon('light');
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.setItem('placify-theme', 'dark');
        updateThemeIcon('dark');
    }
    // Re-render charts with matching colors
    if (state.stats) {
        renderCharts(state.stats);
    }
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.className = theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }
}

// ===================================================================
// Navigation & Tab Switching
// ===================================================================
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    // Dashboard quick jump buttons
    const btnGotoAnalytics = document.getElementById('btn-goto-analytics');
    if (btnGotoAnalytics) {
        btnGotoAnalytics.addEventListener('click', () => switchTab('analytics-tab'));
    }

    const btnViewAllActivities = document.getElementById('btn-view-all-activities');
    if (btnViewAllActivities) {
        btnViewAllActivities.addEventListener('click', () => switchTab('activities-tab'));
    }

    const btnViewAllGoals = document.getElementById('btn-view-all-goals');
    if (btnViewAllGoals) {
        btnViewAllGoals.addEventListener('click', () => switchTab('goals-tab'));
    }
}

function switchTab(tabId) {
    state.activeTab = tabId;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        if (pane.id === tabId) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Specific tab activations
    if (tabId === 'analytics-tab' && state.stats) {
        renderAnalyticsTabCharts(state.stats);
    }
    if (tabId === 'activities-tab') {
        loadActivities();
    }
    if (tabId === 'goals-tab') {
        loadGoals();
    }
    if (tabId === 'dashboard-tab') {
        loadDashboard();
    }
}

function initDateDisplay() {
    const dateEl = document.getElementById('current-date-display');
    if (dateEl) {
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }

    // Set today's date as default in modal date inputs
    const todayISO = new Date().toISOString().split('T')[0];
    const actDateInput = document.getElementById('activity-date');
    if (actDateInput) actDateInput.value = todayISO;

    const goalDateInput = document.getElementById('goal-target-date');
    if (goalDateInput) goalDateInput.value = todayISO;
}

// ===================================================================
// Database & Connection Health Check
// ===================================================================
async function checkDatabaseStatus() {
    const badge = document.getElementById('db-status-badge');
    const text = document.getElementById('db-status-text');

    try {
        const res = await fetch(`${API_BASE}/api/dashboard/db-status`);
        if (!res.ok) throw new Error('API not ok');
        const data = await res.json();
        state.dbStatus = data;

        if (data.connectedToMySQL) {
            badge.className = 'status-badge';
            text.textContent = 'MySQL Connected';
            badge.title = 'Placify is actively persisting data to MySQL (placify_db)';
        } else {
            badge.className = 'status-badge fallback';
            text.textContent = 'In-Memory Fallback';
            badge.title = 'Running with fallback DB. Update application.properties with your MySQL password to connect.';
        }
    } catch (err) {
        if (badge && text) {
            badge.className = 'status-badge fallback';
            text.textContent = 'API Offline';
            badge.title = 'Backend is not running. Start Spring Boot at port 8080.';
        }
    }
}

// ===================================================================
// 1. Dashboard Logic
// ===================================================================
async function loadDashboard() {
    try {
        const res = await fetch(`${API_BASE}/api/dashboard/stats`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const stats = await res.json();
        state.stats = stats;

        // Render counters
        renderCounters(stats);

        // Render today's study goals on dashboard
        renderDashboardGoals(stats.todayGoals || []);

        // Render recent activities
        renderDashboardRecentActivities(stats.recentActivities || []);

        // Render mini dashboard charts
        renderCharts(stats);

        // Render benchmarks in Analytics tab
        renderBenchmarks(stats);

    } catch (err) {
        console.error('Failed to load dashboard stats:', err);
    }
}

function renderCounters(stats) {
    // Total Coding Questions
    const codingEl = document.getElementById('stat-coding-questions');
    if (codingEl) codingEl.textContent = stats.totalCodingQuestions || 0;
    const codingBar = document.getElementById('bar-coding');
    if (codingBar) {
        const pct = Math.min(Math.round(((stats.totalCodingQuestions || 0) / 60) * 100), 100);
        codingBar.style.width = `${pct}%`;
    }

    // Total Aptitude Questions
    const aptEl = document.getElementById('stat-aptitude-questions');
    if (aptEl) aptEl.textContent = stats.totalAptitudeQuestions || 0;
    const aptBar = document.getElementById('bar-aptitude');
    if (aptBar) {
        const pct = Math.min(Math.round(((stats.totalAptitudeQuestions || 0) / 50) * 100), 100);
        aptBar.style.width = `${pct}%`;
    }

    // Total Mock Tests
    const mocksEl = document.getElementById('stat-mock-tests');
    if (mocksEl) mocksEl.textContent = stats.totalMockTests || 0;
    const mocksBar = document.getElementById('bar-mocks');
    if (mocksBar) {
        const pct = Math.min(Math.round(((stats.totalMockTests || 0) / 5) * 100), 100);
        mocksBar.style.width = `${pct}%`;
    }

    // Overall Readiness Progress
    const overallEl = document.getElementById('stat-overall-progress');
    const overallBar = document.getElementById('bar-overall');
    const ring = document.getElementById('svg-ring-progress');
    const levelBadge = document.getElementById('stat-readiness-level');

    const progress = stats.overallProgressPercentage || 0;
    if (overallEl) overallEl.textContent = `${progress}%`;
    if (overallBar) overallBar.style.width = `${progress}%`;

    // SVG Ring (circumference: 2 * pi * 18 = ~113.1)
    if (ring) {
        const circumference = 113.1;
        const offset = circumference - (progress / 100) * circumference;
        ring.style.strokeDashoffset = offset;
    }

    if (levelBadge) {
        if (progress >= 80) {
            levelBadge.textContent = 'Placement Ready 🎯';
            levelBadge.style.color = '#34d399';
        } else if (progress >= 50) {
            levelBadge.textContent = 'Good Momentum ⚡';
            levelBadge.style.color = '#818cf8';
        } else {
            levelBadge.textContent = 'Getting Started 🌱';
            levelBadge.style.color = '#fbbf24';
        }
    }

    // Total Study Time
    const timeEl = document.getElementById('total-study-time');
    if (timeEl) {
        const totalMins = stats.totalStudyMinutes || 0;
        const hours = Math.floor(totalMins / 60);
        const mins = totalMins % 60;
        timeEl.textContent = `${hours}h ${mins}m`;
    }
}

function renderDashboardGoals(goals) {
    const list = document.getElementById('dash-today-goals-list');
    const ratioEl = document.getElementById('dash-goals-ratio');
    const percentEl = document.getElementById('dash-goals-percent');
    const fillEl = document.getElementById('dash-goals-fill');

    if (!list) return;

    if (!goals || goals.length === 0) {
        list.innerHTML = `
            <div class="empty-state-mini">
                <p>No goals set for today yet.</p>
            </div>
        `;
        if (ratioEl) ratioEl.textContent = '0 / 0';
        if (percentEl) percentEl.textContent = '0%';
        if (fillEl) fillEl.style.width = '0%';
        return;
    }

    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const pct = Math.round((completed / total) * 100);

    if (ratioEl) ratioEl.textContent = `${completed} / ${total}`;
    if (percentEl) percentEl.textContent = `${pct}%`;
    if (fillEl) fillEl.style.width = `${pct}%`;

    list.innerHTML = goals.map(goal => `
        <div class="goal-item ${goal.completed ? 'completed' : ''}" data-id="${goal.id}">
            <input type="checkbox" class="goal-checkbox" ${goal.completed ? 'checked' : ''} onchange="toggleGoal(${goal.id})">
            <div class="goal-details">
                <div class="goal-title">${escapeHtml(goal.title)}</div>
                <div class="goal-meta">
                    <span class="goal-cat-tag">${escapeHtml(goal.category || 'General')}</span>
                    <span>${goal.completedCount || 0} / ${goal.targetCount || 1} done</span>
                </div>
            </div>
            <button class="goal-delete-btn" onclick="deleteGoal(${goal.id})" title="Delete Goal">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </div>
    `).join('');
}

function renderDashboardRecentActivities(activities) {
    const list = document.getElementById('dash-recent-activities-list');
    if (!list) return;

    if (!activities || activities.length === 0) {
        list.innerHTML = `
            <div class="empty-state-mini">
                <p>No activities logged yet.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = activities.map(act => {
        const catClass = getCategoryBadgeClass(act.category);
        const iconClass = getCategoryIcon(act.category);

        return `
            <div class="recent-item" onclick="openViewActivityModal(${act.id})">
                <div class="recent-main">
                    <div class="recent-cat-badge ${catClass}">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="recent-info">
                        <h4>${escapeHtml(act.title)}</h4>
                        <div class="recent-sub">
                            <span>${act.platform || 'Practice'}</span> • 
                            <span>${act.topic || act.category}</span>
                        </div>
                    </div>
                </div>
                <div class="recent-right">
                    <span class="diff-pill diff-${(act.difficulty || 'medium').toLowerCase()}">${act.difficulty || 'Medium'}</span>
                    <span class="table-date">${formatDate(act.activityDate)}</span>
                </div>
            </div>
        `;
    }).join('');
}

// ===================================================================
// 2. Activities Logic (Full CRUD)
// ===================================================================
async function loadActivities() {
    const category = document.getElementById('filter-category')?.value || 'All';
    const difficulty = document.getElementById('filter-difficulty')?.value || 'All';
    const status = document.getElementById('filter-status')?.value || 'All';
    const search = document.getElementById('filter-search')?.value || '';

    const params = new URLSearchParams();
    if (category !== 'All') params.append('category', category);
    if (difficulty !== 'All') params.append('difficulty', difficulty);
    if (status !== 'All') params.append('status', status);
    if (search.trim() !== '') params.append('search', search.trim());

    try {
        const res = await fetch(`${API_BASE}/api/activities?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch activities');
        const activities = await res.json();
        state.activities = activities;

        renderActivitiesTable(activities);
    } catch (err) {
        console.error('Error loading activities:', err);
    }
}

function renderActivitiesTable(activities) {
    const tbody = document.getElementById('activities-table-body');
    const emptyState = document.getElementById('activities-empty-state');
    const countDisplay = document.getElementById('activities-count-display');

    if (!tbody) return;

    if (!activities || activities.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (countDisplay) countDisplay.textContent = 'Showing 0 activities';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (countDisplay) countDisplay.textContent = `Showing ${activities.length} activit${activities.length === 1 ? 'y' : 'ies'}`;

    tbody.innerHTML = activities.map(act => {
        const catBadgeClass = getCategoryBadgeClass(act.category);
        const diffPillClass = `diff-${(act.difficulty || 'medium').toLowerCase()}`;
        const statusClass = getStatusClass(act.status);

        return `
            <tr>
                <td class="table-date">${formatDate(act.activityDate)}</td>
                <td>
                    <div class="table-title" onclick="openViewActivityModal(${act.id})">${escapeHtml(act.title)}</div>
                    <div class="table-topic">${escapeHtml(act.topic || '-')}</div>
                </td>
                <td>
                    <span class="badge ${catBadgeClass}">${escapeHtml(act.category)}</span>
                </td>
                <td>
                    <span class="text-secondary">${escapeHtml(act.platform || 'Direct')}</span>
                </td>
                <td>
                    <span class="diff-pill ${diffPillClass}">${act.difficulty || 'Medium'}</span>
                </td>
                <td>
                    <strong>${act.questionsSolved || 1}</strong>
                </td>
                <td>
                    <span class="text-secondary">${act.durationMinutes || 30} mins</span>
                </td>
                <td>
                    <span class="status-pill ${statusClass}">
                        <i class="fa-solid fa-circle"></i> ${act.status || 'Completed'}
                    </span>
                </td>
                <td class="text-right">
                    <div class="action-btn-group">
                        <button class="table-btn" onclick="openViewActivityModal(${act.id})" title="View Details">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button class="table-btn btn-edit" onclick="openEditActivityModal(${act.id})" title="Edit Activity">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="table-btn btn-delete" onclick="confirmDeleteActivity(${act.id})" title="Delete Activity">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Activity Modal: Add / Edit
function openAddActivityModal() {
    state.currentEditingActivityId = null;
    document.getElementById('activity-modal-title').textContent = 'Log Preparation Activity';
    document.getElementById('activity-form').reset();
    document.getElementById('activity-id').value = '';
    document.getElementById('activity-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('activity-questions').value = 1;
    document.getElementById('activity-duration').value = 30;

    openModal('activity-modal');
}

function openEditActivityModal(id) {
    const act = state.activities.find(a => a.id === id);
    if (!act) return;

    state.currentEditingActivityId = id;
    document.getElementById('activity-modal-title').textContent = 'Edit Preparation Activity';

    document.getElementById('activity-id').value = act.id;
    document.getElementById('activity-title').value = act.title || '';
    document.getElementById('activity-category').value = act.category || 'Coding';
    document.getElementById('activity-topic').value = act.topic || '';
    document.getElementById('activity-platform').value = act.platform || '';
    document.getElementById('activity-difficulty').value = act.difficulty || 'Medium';
    document.getElementById('activity-status').value = act.status || 'Completed';
    document.getElementById('activity-questions').value = act.questionsSolved || 1;
    document.getElementById('activity-duration').value = act.durationMinutes || 30;
    document.getElementById('activity-date').value = act.activityDate || new Date().toISOString().split('T')[0];
    document.getElementById('activity-notes').value = act.notes || '';

    closeModal('view-activity-modal');
    openModal('activity-modal');
}

async function handleActivityFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('activity-id').value;
    const activityData = {
        title: document.getElementById('activity-title').value.trim(),
        category: document.getElementById('activity-category').value,
        topic: document.getElementById('activity-topic').value.trim(),
        platform: document.getElementById('activity-platform').value.trim(),
        difficulty: document.getElementById('activity-difficulty').value,
        status: document.getElementById('activity-status').value,
        questionsSolved: parseInt(document.getElementById('activity-questions').value, 10) || 1,
        durationMinutes: parseInt(document.getElementById('activity-duration').value, 10) || 30,
        activityDate: document.getElementById('activity-date').value,
        notes: document.getElementById('activity-notes').value.trim()
    };

    if (!activityData.title) {
        showToast('Please enter an activity title.', 'error');
        return;
    }

    try {
        let res;
        if (id) {
            // Update
            res = await fetch(`${API_BASE}/api/activities/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(activityData)
            });
        } else {
            // Create
            res = await fetch(`${API_BASE}/api/activities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(activityData)
            });
        }

        if (!res.ok) throw new Error('Failed to save activity');

        closeModal('activity-modal');
        showToast(id ? 'Activity updated successfully! ✏️' : 'Activity logged successfully! 🎉', 'success');

        // Refresh data
        loadActivities();
        loadDashboard();

    } catch (err) {
        console.error('Error saving activity:', err);
        showToast('Error saving activity. Check backend connection.', 'error');
    }
}

async function confirmDeleteActivity(id) {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
        const res = await fetch(`${API_BASE}/api/activities/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Failed to delete activity');

        showToast('Activity deleted. 🗑️', 'info');
        loadActivities();
        loadDashboard();

    } catch (err) {
        console.error('Error deleting activity:', err);
        showToast('Failed to delete activity.', 'error');
    }
}

// View Activity Modal
function openViewActivityModal(id) {
    const act = state.activities.find(a => a.id === id) || (state.stats?.recentActivities || []).find(a => a.id === id);
    if (!act) return;

    state.currentEditingActivityId = id;

    document.getElementById('view-title').textContent = act.title;
    document.getElementById('view-category-tag').innerHTML = `<i class="fa-solid fa-layer-group"></i> ${escapeHtml(act.category)}`;
    document.getElementById('view-difficulty-tag').innerHTML = `<i class="fa-solid fa-signal"></i> ${escapeHtml(act.difficulty || 'Medium')}`;
    document.getElementById('view-platform-tag').innerHTML = `<i class="fa-solid fa-laptop-code"></i> ${escapeHtml(act.platform || 'Direct')}`;
    document.getElementById('view-date-tag').innerHTML = `<i class="fa-regular fa-calendar"></i> ${formatDate(act.activityDate)}`;

    const statusBadge = document.getElementById('view-status-badge');
    statusBadge.className = `badge ${getStatusBadgeClass(act.status)}`;
    statusBadge.textContent = act.status || 'Completed';

    document.getElementById('view-topic').textContent = act.topic || 'General Practice';
    document.getElementById('view-questions').textContent = act.questionsSolved || 1;
    document.getElementById('view-duration').textContent = `${act.durationMinutes || 30} mins`;
    document.getElementById('view-notes').textContent = act.notes || 'No specific notes recorded for this activity.';

    const editBtn = document.getElementById('btn-view-edit');
    if (editBtn) {
        editBtn.onclick = () => openEditActivityModal(id);
    }

    openModal('view-activity-modal');
}

// ===================================================================
// 3. Daily Goals Logic
// ===================================================================
async function loadGoals() {
    try {
        const res = await fetch(`${API_BASE}/api/goals`);
        if (!res.ok) throw new Error('Failed to fetch goals');
        const goals = await res.json();
        state.goals = goals;

        renderGoalsTab(goals);
    } catch (err) {
        console.error('Error loading goals:', err);
    }
}

function renderGoalsTab(goals) {
    const grid = document.getElementById('all-goals-grid');
    const emptyState = document.getElementById('goals-empty-state');
    const completedStat = document.getElementById('goals-completed-stat');
    const totalStat = document.getElementById('goals-total-stat');
    const gaugePercent = document.getElementById('goals-gauge-percent');

    if (!grid) return;

    if (!goals || goals.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (completedStat) completedStat.textContent = '0';
        if (totalStat) totalStat.textContent = '0';
        if (gaugePercent) gaugePercent.textContent = '0%';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';

    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const pct = Math.round((completed / total) * 100);

    if (completedStat) completedStat.textContent = completed;
    if (totalStat) totalStat.textContent = total;
    if (gaugePercent) gaugePercent.textContent = `${pct}%`;

    grid.innerHTML = goals.map(goal => `
        <div class="goal-card ${goal.completed ? 'completed' : ''}" data-id="${goal.id}">
            <div class="goal-card-top">
                <input type="checkbox" class="goal-checkbox" ${goal.completed ? 'checked' : ''} onchange="toggleGoal(${goal.id})">
                <div>
                    <h4 class="goal-card-title">${escapeHtml(goal.title)}</h4>
                    <span class="badge ${getCategoryBadgeClass(goal.category)} mt-4" style="margin-top: 0.5rem;">${escapeHtml(goal.category || 'General')}</span>
                </div>
            </div>

            <div class="goal-card-footer">
                <span><i class="fa-regular fa-calendar"></i> ${formatDate(goal.targetDate)}</span>
                <span>${goal.completedCount || 0} / ${goal.targetCount || 1} completed</span>
                <div class="action-btn-group">
                    <button class="table-btn btn-delete" onclick="deleteGoal(${goal.id})" title="Delete Goal">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function toggleGoal(id) {
    try {
        const res = await fetch(`${API_BASE}/api/goals/${id}/toggle`, {
            method: 'PATCH'
        });
        if (!res.ok) throw new Error('Failed to toggle goal');

        showToast('Goal progress updated! 🎯', 'success');

        // Refresh both views
        loadGoals();
        loadDashboard();

    } catch (err) {
        console.error('Error toggling goal:', err);
        showToast('Failed to update goal.', 'error');
    }
}

function openAddGoalModal() {
    document.getElementById('goal-form').reset();
    document.getElementById('goal-id').value = '';
    document.getElementById('goal-target-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('goal-target-count').value = 1;
    document.getElementById('goal-completed-count').value = 0;
    document.getElementById('goal-completed').checked = false;

    openModal('goal-modal');
}

async function handleGoalFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('goal-id').value;
    const goalData = {
        title: document.getElementById('goal-title').value.trim(),
        category: document.getElementById('goal-category').value,
        targetDate: document.getElementById('goal-target-date').value,
        targetCount: parseInt(document.getElementById('goal-target-count').value, 10) || 1,
        completedCount: parseInt(document.getElementById('goal-completed-count').value, 10) || 0,
        completed: document.getElementById('goal-completed').checked
    };

    if (!goalData.title) {
        showToast('Please enter a goal title.', 'error');
        return;
    }

    try {
        let res;
        if (id) {
            res = await fetch(`${API_BASE}/api/goals/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goalData)
            });
        } else {
            res = await fetch(`${API_BASE}/api/goals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goalData)
            });
        }

        if (!res.ok) throw new Error('Failed to save goal');

        closeModal('goal-modal');
        showToast('Daily goal saved! 🎯', 'success');

        loadGoals();
        loadDashboard();

    } catch (err) {
        console.error('Error saving goal:', err);
        showToast('Failed to save goal.', 'error');
    }
}

async function deleteGoal(id) {
    if (!confirm('Are you sure you want to delete this study goal?')) return;

    try {
        const res = await fetch(`${API_BASE}/api/goals/${id}`, {
            method: 'DELETE'
        });

        if (!res.ok) throw new Error('Failed to delete goal');

        showToast('Goal removed.', 'info');
        loadGoals();
        loadDashboard();

    } catch (err) {
        console.error('Error deleting goal:', err);
        showToast('Failed to delete goal.', 'error');
    }
}

// ===================================================================
// 4. Charts & Analytics (Chart.js Integration)
// ===================================================================
function renderCharts(stats) {
    renderDashboardCharts(stats);
    renderAnalyticsTabCharts(stats);
}

function renderDashboardCharts(stats) {
    if (typeof Chart === 'undefined') return;

    const isLight = document.body.classList.contains('light-theme');
    const textColor = isLight ? '#475569' : '#94a3b8';
    const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';

    // 1. Dashboard Category Doughnut Chart
    const catCanvas = document.getElementById('dashCategoryChart');
    if (catCanvas) {
        if (state.charts.dashCategory) state.charts.dashCategory.destroy();

        const catData = stats.categoryBreakdown || {};
        const labels = Object.keys(catData);
        const dataValues = Object.values(catData);

        state.charts.dashCategory = new Chart(catCanvas, {
            type: 'doughnut',
            data: {
                labels: labels.length > 0 ? labels : ['No Data'],
                datasets: [{
                    data: dataValues.length > 0 ? dataValues : [1],
                    backgroundColor: [
                        '#6366f1', // Coding
                        '#06b6d4', // Aptitude
                        '#ec4899', // Mock Test
                        '#10b981', // Core CS
                        '#f59e0b'  // HR
                    ],
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 }, boxWidth: 12 }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // 2. Dashboard Difficulty Bar Chart
    const diffCanvas = document.getElementById('dashDifficultyChart');
    if (diffCanvas) {
        if (state.charts.dashDifficulty) state.charts.dashDifficulty.destroy();

        const diffData = stats.difficultyBreakdown || {};

        state.charts.dashDifficulty = new Chart(diffCanvas, {
            type: 'bar',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    label: 'Count',
                    data: [
                        diffData.Easy || 0,
                        diffData.Medium || 0,
                        diffData.Hard || 0
                    ],
                    backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } },
                        grid: { display: false }
                    },
                    y: {
                        ticks: { color: textColor, precision: 0 },
                        grid: { color: gridColor },
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

function renderAnalyticsTabCharts(stats) {
    if (typeof Chart === 'undefined') return;

    const isLight = document.body.classList.contains('light-theme');
    const textColor = isLight ? '#475569' : '#94a3b8';
    const gridColor = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';

    // Detailed Category Chart
    const catCanvas = document.getElementById('chartCategoryDetailed');
    if (catCanvas) {
        if (state.charts.detailedCategory) state.charts.detailedCategory.destroy();

        const catData = stats.categoryBreakdown || {};
        state.charts.detailedCategory = new Chart(catCanvas, {
            type: 'pie',
            data: {
                labels: Object.keys(catData),
                datasets: [{
                    data: Object.values(catData),
                    backgroundColor: ['#6366f1', '#06b6d4', '#ec4899', '#10b981', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Plus Jakarta Sans' } } }
                }
            }
        });
    }

    // Detailed Difficulty Bar Chart
    const diffCanvas = document.getElementById('chartDifficultyDetailed');
    if (diffCanvas) {
        if (state.charts.detailedDifficulty) state.charts.detailedDifficulty.destroy();

        const diffData = stats.difficultyBreakdown || {};
        state.charts.detailedDifficulty = new Chart(diffCanvas, {
            type: 'bar',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    label: 'Activities Count',
                    data: [diffData.Easy || 0, diffData.Medium || 0, diffData.Hard || 0],
                    backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: textColor }, grid: { display: false } },
                    y: { ticks: { color: textColor, precision: 0 }, grid: { color: gridColor }, beginAtZero: true }
                }
            }
        });
    }

    // Detailed Status Polar Area / Doughnut Chart
    const statusCanvas = document.getElementById('chartStatusDetailed');
    if (statusCanvas) {
        if (state.charts.detailedStatus) state.charts.detailedStatus.destroy();

        const statusData = stats.statusBreakdown || {};
        state.charts.detailedStatus = new Chart(statusCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Needs Revision'],
                datasets: [{
                    data: [
                        statusData['Completed'] || 0,
                        statusData['In Progress'] || 0,
                        statusData['Needs Revision'] || 0
                    ],
                    backgroundColor: ['#10b981', '#38bdf8', '#f43f5e'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: textColor, font: { family: 'Plus Jakarta Sans' } } }
                },
                cutout: '65%'
            }
        });
    }
}

function renderBenchmarks(stats) {
    // Coding benchmark: 60 questions
    const codingVal = stats.totalCodingQuestions || 0;
    const codingEl = document.getElementById('bench-coding-val');
    const codingBar = document.getElementById('bench-coding-bar');
    if (codingEl) codingEl.textContent = `${codingVal} / 60`;
    if (codingBar) codingBar.style.width = `${Math.min(Math.round((codingVal / 60) * 100), 100)}%`;

    // Aptitude benchmark: 50 questions
    const aptVal = stats.totalAptitudeQuestions || 0;
    const aptEl = document.getElementById('bench-aptitude-val');
    const aptBar = document.getElementById('bench-aptitude-bar');
    if (aptEl) aptEl.textContent = `${aptVal} / 50`;
    if (aptBar) aptBar.style.width = `${Math.min(Math.round((aptVal / 50) * 100), 100)}%`;

    // Mock benchmark: 5 tests
    const mockVal = stats.totalMockTests || 0;
    const mockEl = document.getElementById('bench-mock-val');
    const mockBar = document.getElementById('bench-mock-bar');
    if (mockEl) mockEl.textContent = `${mockVal} / 5`;
    if (mockBar) mockBar.style.width = `${Math.min(Math.round((mockVal / 5) * 100), 100)}%`;

    // Goal consistency
    const goalPct = stats.todayGoalsPercentage || 0;
    const goalEl = document.getElementById('bench-goal-val');
    const goalBar = document.getElementById('bench-goal-bar');
    if (goalEl) goalEl.textContent = `${goalPct}%`;
    if (goalBar) goalBar.style.width = `${goalPct}%`;
}

// ===================================================================
// Event Listeners Setup
// ===================================================================
function initEventListeners() {
    // Top Bar Log Activity Button
    const btnOpenAdd = document.getElementById('btn-open-add-activity');
    if (btnOpenAdd) btnOpenAdd.addEventListener('click', openAddActivityModal);

    const btnTableAdd = document.getElementById('btn-table-add-activity');
    if (btnTableAdd) btnTableAdd.addEventListener('click', openAddActivityModal);

    const btnEmptyAdd = document.getElementById('btn-empty-add-activity');
    if (btnEmptyAdd) btnEmptyAdd.addEventListener('click', openAddActivityModal);

    const btnDashAdd = document.getElementById('btn-dash-log-activity');
    if (btnDashAdd) btnDashAdd.addEventListener('click', openAddActivityModal);

    // Goal Buttons
    const btnOpenAddGoal = document.getElementById('btn-open-add-goal');
    if (btnOpenAddGoal) btnOpenAddGoal.addEventListener('click', openAddGoalModal);

    const btnQuickAddGoal = document.getElementById('btn-quick-add-goal');
    if (btnQuickAddGoal) btnQuickAddGoal.addEventListener('click', openAddGoalModal);

    const btnEmptyAddGoal = document.getElementById('btn-empty-add-goal');
    if (btnEmptyAddGoal) btnEmptyAddGoal.addEventListener('click', openAddGoalModal);

    // Modal Close Buttons
    document.getElementById('btn-close-activity-modal')?.addEventListener('click', () => closeModal('activity-modal'));
    document.getElementById('btn-cancel-activity')?.addEventListener('click', () => closeModal('activity-modal'));

    document.getElementById('btn-close-goal-modal')?.addEventListener('click', () => closeModal('goal-modal'));
    document.getElementById('btn-cancel-goal')?.addEventListener('click', () => closeModal('goal-modal'));

    document.getElementById('btn-close-view-modal')?.addEventListener('click', () => closeModal('view-activity-modal'));
    document.getElementById('btn-view-close')?.addEventListener('click', () => closeModal('view-activity-modal'));

    // Close on overlay backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay.id);
            }
        });
    });

    // Form Submissions
    document.getElementById('activity-form')?.addEventListener('submit', handleActivityFormSubmit);
    document.getElementById('goal-form')?.addEventListener('submit', handleGoalFormSubmit);

    // Filter Changes
    document.getElementById('filter-category')?.addEventListener('change', loadActivities);
    document.getElementById('filter-difficulty')?.addEventListener('change', loadActivities);
    document.getElementById('filter-status')?.addEventListener('change', loadActivities);

    // Search Input with Debounce
    let searchTimeout;
    const searchInput = document.getElementById('filter-search');
    const clearSearchBtn = document.getElementById('btn-clear-search');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (clearSearchBtn) {
                clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
            }
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(loadActivities, 250);
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            loadActivities();
        });
    }

    // Reset Filters
    document.getElementById('btn-reset-filters')?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        document.getElementById('filter-category').value = 'All';
        document.getElementById('filter-difficulty').value = 'All';
        document.getElementById('filter-status').value = 'All';
        loadActivities();
    });

    // Refresh Analytics Button
    document.getElementById('btn-refresh-analytics')?.addEventListener('click', () => {
        loadDashboard();
        showToast('Analytics refreshed! 📊', 'info');
    });
}

// ===================================================================
// Modal & Toast Helpers
// ===================================================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'fa-solid fa-circle-check';
    if (type === 'error') icon = 'fa-solid fa-circle-exclamation';
    if (type === 'info') icon = 'fa-solid fa-circle-info';

    toast.innerHTML = `<i class="${icon}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Helper: Format Date
function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const [year, month, day] = dateStr.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

// Helper: Category badge styling
function getCategoryBadgeClass(category) {
    if (!category) return 'badge-coding';
    const c = category.toLowerCase();
    if (c.includes('coding')) return 'badge-coding';
    if (c.includes('aptitude')) return 'badge-aptitude';
    if (c.includes('mock')) return 'badge-mock';
    if (c.includes('core')) return 'badge-core';
    return 'badge-hr';
}

function getCategoryIcon(category) {
    if (!category) return 'fa-solid fa-code';
    const c = category.toLowerCase();
    if (c.includes('coding')) return 'fa-solid fa-code';
    if (c.includes('aptitude')) return 'fa-solid fa-brain';
    if (c.includes('mock')) return 'fa-solid fa-file-signature';
    if (c.includes('core')) return 'fa-solid fa-database';
    return 'fa-solid fa-user-tie';
}

function getStatusClass(status) {
    if (!status) return 'status-completed';
    const s = status.toLowerCase();
    if (s.includes('progress')) return 'status-in-progress';
    if (s.includes('revision')) return 'status-revision';
    return 'status-completed';
}

function getStatusBadgeClass(status) {
    if (!status) return 'badge-core';
    const s = status.toLowerCase();
    if (s.includes('progress')) return 'badge-aptitude';
    if (s.includes('revision')) return 'badge-mock';
    return 'badge-core';
}

// XSS Sanitizer
function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
