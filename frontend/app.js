// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Navigation
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    // Load data for the section
    loadSectionData(sectionName);
}

// Load section-specific data
function loadSectionData(sectionName) {
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'projects':
            loadProjects();
            break;
        case 'objectives':
            loadObjectives();
            break;
        case 'activities':
            loadActivities();
            break;
        case 'beneficiaries':
            loadBeneficiaries();
            break;
        case 'results':
            loadResults();
            break;
        case 'kpis':
            loadKPIs();
            break;
    }
}

// Dashboard Data
async function loadDashboardData() {
    try {
        // Load summary statistics
        const projects = await fetch(`${API_BASE_URL}/projects`).then(r => r.json());
        const objectives = await fetch(`${API_BASE_URL}/objectives`).then(r => r.json());
        const activities = await fetch(`${API_BASE_URL}/activities`).then(r => r.json());
        const beneficiaries = await fetch(`${API_BASE_URL}/beneficiaries`).then(r => r.json());
        
        document.getElementById('total-projects').textContent = projects.length;
        document.getElementById('total-objectives').textContent = objectives.length;
        document.getElementById('total-activities').textContent = activities.length;
        document.getElementById('total-beneficiaries').textContent = beneficiaries.length;
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showAlert('Error loading dashboard data', 'danger');
    }
}

// Projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_BASE_URL}/projects`);
        const projects = await response.json();
        
        const tbody = document.getElementById('projects-tbody');
        tbody.innerHTML = '';
        
        projects.forEach(project => {
            const row = `
                <tr>
                    <td><strong>${project.project_code}</strong></td>
                    <td>${project.name}</td>
                    <td><span class="badge bg-${getStatusColor(project.status)}">${project.status}</span></td>
                    <td>${formatDate(project.start_date)}</td>
                    <td>${formatCurrency(project.budget)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="editProject(${project.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteProject(${project.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        showAlert('Error loading projects', 'danger');
    }
}

function showAddProjectModal() {
    const modal = new bootstrap.Modal(document.getElementById('addProjectModal'));
    modal.show();
}

async function saveProject() {
    const projectData = {
        project_code: document.getElementById('project-code').value,
        name: document.getElementById('project-name').value,
        description: document.getElementById('project-description').value,
        start_date: document.getElementById('project-start-date').value,
        end_date: document.getElementById('project-end-date').value,
        budget: document.getElementById('project-budget').value,
        status: 'active',
        program: 'STARS 2025'
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        
        if (response.ok) {
            showAlert('Project created successfully', 'success');
            bootstrap.Modal.getInstance(document.getElementById('addProjectModal')).hide();
            loadProjects();
            document.getElementById('add-project-form').reset();
        } else {
            const error = await response.json();
            showAlert(error.error || 'Error creating project', 'danger');
        }
    } catch (error) {
        console.error('Error saving project:', error);
        showAlert('Error saving project', 'danger');
    }
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showAlert('Project deleted successfully', 'success');
            loadProjects();
        } else {
            showAlert('Error deleting project', 'danger');
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        showAlert('Error deleting project', 'danger');
    }
}

// Objectives
async function loadObjectives() {
    try {
        const response = await fetch(`${API_BASE_URL}/objectives`);
        const objectives = await response.json();
        
        const container = document.getElementById('objectives-list');
        container.innerHTML = '<div class="loading">Loading objectives...</div>';
        
        if (objectives.length === 0) {
            container.innerHTML = '<p class="text-muted">No objectives found. Add your first objective!</p>';
            return;
        }
        
        let html = '<div class="row g-3">';
        objectives.forEach(obj => {
            html += `
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${obj.title}</h5>
                            <p class="card-text">${obj.description || ''}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="badge bg-${getStatusColor(obj.status)}">${obj.status}</span>
                                <small class="text-muted">${obj.current_value || 0} / ${obj.target_value || 0} ${obj.unit || ''}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading objectives:', error);
        document.getElementById('objectives-list').innerHTML = '<p class="text-danger">Error loading objectives</p>';
    }
}

// Activities
async function loadActivities() {
    try {
        const response = await fetch(`${API_BASE_URL}/activities`);
        const activities = await response.json();
        
        const container = document.getElementById('activities-list');
        container.innerHTML = '<div class="loading">Loading activities...</div>';
        
        if (activities.length === 0) {
            container.innerHTML = '<p class="text-muted">No activities found.</p>';
            return;
        }
        
        let html = '<div class="list-group">';
        activities.forEach(activity => {
            html += `
                <div class="list-group-item">
                    <div class="d-flex w-100 justify-content-between">
                        <h6 class="mb-1">${activity.title}</h6>
                        <span class="badge bg-${getStatusColor(activity.status)}">${activity.status}</span>
                    </div>
                    <p class="mb-1 text-muted">${activity.description || ''}</p>
                    <small>
                        <i class="bi bi-calendar"></i> ${formatDate(activity.start_date)} - ${formatDate(activity.end_date)}
                        ${activity.responsible ? `| <i class="bi bi-person"></i> ${activity.responsible}` : ''}
                    </small>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading activities:', error);
        document.getElementById('activities-list').innerHTML = '<p class="text-danger">Error loading activities</p>';
    }
}

// Beneficiaries
async function loadBeneficiaries() {
    try {
        const response = await fetch(`${API_BASE_URL}/beneficiaries`);
        const beneficiaries = await response.json();
        
        const container = document.getElementById('beneficiaries-list');
        container.innerHTML = '<div class="loading">Loading beneficiaries...</div>';
        
        if (beneficiaries.length === 0) {
            container.innerHTML = '<p class="text-muted">No beneficiaries found.</p>';
            return;
        }
        
        let html = '<div class="table-responsive"><table class="table table-hover"><thead><tr><th>Name</th><th>Type</th><th>Organization</th><th>Contact</th><th>Status</th></tr></thead><tbody>';
        beneficiaries.forEach(ben => {
            html += `
                <tr>
                    <td><strong>${ben.name}</strong></td>
                    <td>${ben.type || 'N/A'}</td>
                    <td>${ben.organization || 'N/A'}</td>
                    <td>${ben.contact_email || ben.contact_phone || 'N/A'}</td>
                    <td><span class="badge bg-${getStatusColor(ben.status)}">${ben.status}</span></td>
                </tr>
            `;
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading beneficiaries:', error);
        document.getElementById('beneficiaries-list').innerHTML = '<p class="text-danger">Error loading beneficiaries</p>';
    }
}

// Results
async function loadResults() {
    try {
        const response = await fetch(`${API_BASE_URL}/results`);
        const results = await response.json();
        
        const container = document.getElementById('results-list');
        container.innerHTML = '<div class="loading">Loading results...</div>';
        
        if (results.length === 0) {
            container.innerHTML = '<p class="text-muted">No results found.</p>';
            return;
        }
        
        let html = '<div class="row g-3">';
        results.forEach(result => {
            html += `
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title">${result.title}</h6>
                            <p class="card-text small">${result.description || ''}</p>
                            ${result.metric_name ? `
                                <div class="metric">
                                    <strong>${result.metric_name}:</strong> ${result.metric_value} ${result.metric_unit || ''}
                                </div>
                            ` : ''}
                            <small class="text-muted"><i class="bi bi-calendar-check"></i> ${formatDate(result.achievement_date)}</small>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading results:', error);
        document.getElementById('results-list').innerHTML = '<p class="text-danger">Error loading results</p>';
    }
}

// KPIs
async function loadKPIs() {
    try {
        const response = await fetch(`${API_BASE_URL}/kpis/dashboard`);
        const kpis = await response.json();
        
        const container = document.getElementById('kpis-list');
        container.innerHTML = '<div class="loading">Loading KPIs...</div>';
        
        if (kpis.length === 0) {
            container.innerHTML = '<p class="text-muted">No KPIs found.</p>';
            return;
        }
        
        let html = '<div class="row g-3">';
        kpis.forEach(kpi => {
            const progress = kpi.progress_percentage || 0;
            const progressColor = progress >= 80 ? 'success' : progress >= 50 ? 'warning' : 'danger';
            
            html += `
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title">${kpi.name}</h6>
                            <p class="card-text small text-muted">${kpi.description || ''}</p>
                            <div class="progress mb-2" style="height: 25px;">
                                <div class="progress-bar bg-${progressColor}" role="progressbar" 
                                     style="width: ${Math.min(progress, 100)}%"
                                     aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">
                                    ${progress.toFixed(1)}%
                                </div>
                            </div>
                            <div class="d-flex justify-content-between">
                                <small><strong>Current:</strong> ${kpi.current_value} ${kpi.unit || ''}</small>
                                <small><strong>Target:</strong> ${kpi.target_value} ${kpi.unit || ''}</small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading KPIs:', error);
        document.getElementById('kpis-list').innerHTML = '<p class="text-danger">Error loading KPIs</p>';
    }
}

// Export Data
async function exportData() {
    const entity = document.getElementById('export-entity').value;
    const format = document.getElementById('export-format').value;
    
    try {
        const url = `${API_BASE_URL}/export/data?entity=${entity}&format=${format}`;
        
        if (format === 'csv') {
            // Download CSV file
            window.open(url, '_blank');
        } else {
            // Download JSON/Excel
            const response = await fetch(url);
            const data = await response.json();
            
            // Convert to downloadable file
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${entity}_export.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        
        showAlert('Data exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting data:', error);
        showAlert('Error exporting data', 'danger');
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
}

function formatCurrency(amount) {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
}

function getStatusColor(status) {
    const statusColors = {
        'active': 'success',
        'completed': 'primary',
        'pending': 'warning',
        'cancelled': 'danger',
        'planned': 'info',
        'in_progress': 'warning'
    };
    return statusColors[status] || 'secondary';
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
});
