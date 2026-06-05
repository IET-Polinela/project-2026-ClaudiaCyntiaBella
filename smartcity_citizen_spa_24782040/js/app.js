let currentTab = "my_reports";
let currentPage = 1;
let editingReportId = null;

function updateNavMenu() {
    const navMenu = document.getElementById("nav-menu");
    const accessToken = localStorage.getItem("access_token");

    if (!navMenu) return;

    if (accessToken) {
        navMenu.innerHTML = `
            <button class="btn btn-light btn-sm" onclick="logoutUser()">
                <i class="bi bi-box-arrow-right me-1"></i>
                Logout
            </button>
        `;
    } else {
        navMenu.innerHTML = `
            <a href="#login" class="btn btn-light btn-sm">
                <i class="bi bi-box-arrow-in-right me-1"></i>
                Login
            </a>
        `;
    }
}

function logoutUser() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.hash = "#login";
    updateNavMenu();
}

function initializeDashboard() {
    loadDashboardData("my_reports", 1);
    setupReportFormButtons();
}

function switchTab(tab) {
    currentTab = tab;
    currentPage = 1;

    document.getElementById("myReportsTab").classList.toggle("active", tab === "my_reports");
    document.getElementById("feedTab").classList.toggle("active", tab === "feed");

    loadDashboardData(tab, 1);
}

async function loadDashboardData(tab = currentTab, page = currentPage) {
    currentTab = tab;
    currentPage = page;

    const listContainer = document.getElementById("listContainer");
    const paginationContainer = document.getElementById("paginationContainer");

    listContainer.innerHTML = `
        <div class="text-center text-muted py-5">
            <div class="spinner-border text-primary mb-3"></div>
            <p>Memuat data laporan...</p>
        </div>
    `;

    const response = await requestAPI(`/api/reports/?tab=${tab}&page=${page}`, "GET");

    if (response.status === 200) {
        const reports = response.data.results || [];
        renderList(reports, tab);
        renderPagination(response.data, tab, page);
        loadSummaryStats();
    } else {
        listContainer.innerHTML = `
            <div class="alert alert-danger">
                Gagal memuat data laporan.
            </div>
        `;
        paginationContainer.innerHTML = "";
    }
}

function getStatusInfo(status) {
    const map = {
        "DRAFT": {
            label: "Draft",
            progress: 20,
            color: "bg-secondary",
            badge: "bg-secondary"
        },
        "REPORTED": {
            label: "Reported",
            progress: 40,
            color: "bg-primary",
            badge: "bg-primary"
        },
        "VERIFIED": {
            label: "Verified",
            progress: 60,
            color: "bg-info",
            badge: "bg-info"
        },
        "IN_PROGRESS": {
            label: "In Progress",
            progress: 80,
            color: "bg-warning",
            badge: "bg-warning text-dark"
        },
        "RESOLVED": {
            label: "Resolved",
            progress: 100,
            color: "bg-success",
            badge: "bg-success"
        }
    };

    return map[status] || {
        label: status,
        progress: 10,
        color: "bg-secondary",
        badge: "bg-secondary"
    };
}

function renderList(reports, tab) {
    const listContainer = document.getElementById("listContainer");

    if (reports.length === 0) {
        listContainer.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                <p>Belum ada data laporan.</p>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = `
        <div class="row g-4">
            ${reports.map(report => {
                const statusInfo = getStatusInfo(report.status);

                const editButton = report.status === "DRAFT" && report.is_owner ? `
                    <button class="btn btn-sm btn-outline-primary" onclick="editDraft(${report.id})">
                        <i class="bi bi-pencil-square me-1"></i>
                        Edit
                    </button>
                ` : "";

                return `
                    <div class="col-12 col-md-6">
                        <div class="report-grid-card p-4 h-100">
                            <div class="d-flex justify-content-between align-items-start mb-3 position-relative">
                                <div class="report-status-icon">
                                    <i class="bi bi-megaphone-fill"></i>
                                </div>

                                <span class="badge rounded-pill ${statusInfo.badge}">
                                    ${statusInfo.label}
                                </span>
                            </div>

                            <h5 class="fw-bold mb-1 position-relative">
                                ${report.title}
                            </h5>

                            <small class="text-muted position-relative">
                                <i class="bi bi-person-circle me-1"></i>
                                ${report.reporter}
                            </small>

                            <p class="text-muted mt-3 mb-3 position-relative">
                                ${report.description}
                            </p>

                            <div class="small text-muted mb-3 position-relative">
                                <i class="bi bi-tags-fill me-1 text-primary"></i>${report.category}
                                <span class="mx-2">|</span>
                                <i class="bi bi-geo-alt-fill me-1 text-primary"></i>${report.location}
                            </div>

                            <div class="d-flex justify-content-between align-items-center mb-1 position-relative">
                                <small class="fw-semibold text-muted">Progress Status</small>
                                <small class="fw-bold">${statusInfo.progress}%</small>
                            </div>

                            <div class="progress mb-3 position-relative">
                                <div class="progress-bar ${statusInfo.color} progress-bar-striped progress-bar-animated"
                                     style="width: ${statusInfo.progress}%">
                                    ${statusInfo.progress}%
                                </div>
                            </div>

                            <div class="d-flex justify-content-between align-items-center position-relative">
                                <small class="text-muted">
                                    <i class="bi bi-calendar-event me-1"></i>
                                    ${report.updated_at}
                                </small>
                                ${editButton}
                            </div>
                        </div>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function renderPagination(data, tab, page) {
    const paginationContainer = document.getElementById("paginationContainer");

    const hasPrevious = data.previous !== null;
    const hasNext = data.next !== null;

    if (!hasPrevious && !hasNext) {
        paginationContainer.innerHTML = "";
        return;
    }

    paginationContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <button class="btn btn-outline-primary btn-sm"
                    ${!hasPrevious ? "disabled" : ""}
                    onclick="loadDashboardData('${tab}', ${page - 1})">
                <i class="bi bi-chevron-left"></i>
                Sebelumnya
            </button>

            <span class="small text-muted">Halaman ${page}</span>

            <button class="btn btn-outline-primary btn-sm"
                    ${!hasNext ? "disabled" : ""}
                    onclick="loadDashboardData('${tab}', ${page + 1})">
                Selanjutnya
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>
    `;
}

async function loadSummaryStats() {
    const response = await requestAPI("/api/reports/?tab=my_reports&page_size=1000", "GET");

    if (response.status !== 200) return;

    const reports = response.data.results || [];

    const draftCount = reports.filter(report => report.status === "DRAFT").length;
    const progressCount = reports.filter(report =>
        ["REPORTED", "VERIFIED", "IN_PROGRESS"].includes(report.status)
    ).length;
    const doneCount = reports.filter(report => report.status === "RESOLVED").length;

    document.getElementById("draftCount").textContent = draftCount;
    document.getElementById("progressCount").textContent = progressCount;
    document.getElementById("doneCount").textContent = doneCount;
}

function openCreateModal() {
    editingReportId = null;

    document.getElementById("reportModalLabel").innerHTML = `
        <i class="bi bi-file-earmark-plus-fill text-primary me-1"></i>
        Tambah Laporan Baru
    `;

    document.getElementById("reportForm").reset();

    const modal = new bootstrap.Modal(document.getElementById("reportModal"));
    modal.show();
}

async function editDraft(id) {
    const response = await requestAPI(`/api/reports/${id}/`, "GET");

    if (response.status !== 200) {
        alert("Gagal mengambil data laporan.");
        return;
    }

    const report = response.data;
    editingReportId = id;

    document.getElementById("reportModalLabel").innerHTML = `
        <i class="bi bi-pencil-square text-primary me-1"></i>
        Edit Draft Laporan
    `;

    document.getElementById("reportTitle").value = report.title;
    document.getElementById("reportCategory").value = report.category;
    document.getElementById("reportLocation").value = report.location;
    document.getElementById("reportDescription").value = report.description;

    const modal = new bootstrap.Modal(document.getElementById("reportModal"));
    modal.show();
}

function getReportFormData(status) {
    return {
        title: document.getElementById("reportTitle").value,
        category: document.getElementById("reportCategory").value,
        location: document.getElementById("reportLocation").value,
        description: document.getElementById("reportDescription").value,
        status: status
    };
}

function setupReportFormButtons() {
    const saveDraftBtn = document.getElementById("saveDraftBtn");
    const submitReportBtn = document.getElementById("submitReportBtn");

    if (!saveDraftBtn || !submitReportBtn) return;

    saveDraftBtn.onclick = function() {
        submitReportForm("DRAFT");
    };

    submitReportBtn.onclick = function() {
        submitReportForm("REPORTED");
    };
}

async function submitReportForm(status) {
    const bodyData = getReportFormData(status);

    let endpoint = "/api/reports/";
    let method = "POST";

    if (editingReportId !== null) {
        endpoint = `/api/reports/${editingReportId}/`;
        method = "PUT";
    }

    const response = await requestAPI(endpoint, method, bodyData);

    if (response.status === 201 || response.status === 200) {
        const modalElement = document.getElementById("reportModal");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();

        document.getElementById("reportForm").reset();
        editingReportId = null;

        await loadDashboardData(currentTab, currentPage);

        alert("Laporan berhasil disimpan.");
    } else {
        alert("Gagal menyimpan laporan.");
        console.log(response.data);
    }
}
