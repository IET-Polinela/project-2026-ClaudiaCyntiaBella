const routes = {
    "#login": `
        <div class="row justify-content-center align-items-center" style="min-height: 78vh;">
            <div class="col-12 col-md-5 col-lg-4">
                <div class="glass-card p-4">
                    <div class="text-center mb-4">
                        <div class="soft-icon floating mb-3">
                            <i class="bi bi-shield-lock-fill"></i>
                        </div>
                        <h2 class="fw-bold mb-1">Login Warga</h2>
                        <p class="text-muted mb-0">Masuk ke Citizen Portal</p>
                    </div>

                    <form id="loginForm">
                        <div class="mb-3">
                            <label class="form-label fw-semibold">Username</label>
                            <div class="input-group">
                                <span class="input-group-text bg-white">
                                    <i class="bi bi-person-fill text-primary"></i>
                                </span>
                                <input type="text" id="loginUsername" class="form-control" required>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-semibold">Password</label>
                            <div class="input-group">
                                <span class="input-group-text bg-white">
                                    <i class="bi bi-key-fill text-primary"></i>
                                </span>
                                <input type="password" id="loginPassword" class="form-control" required>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-soft-primary w-100 py-2 fw-semibold">
                            <i class="bi bi-box-arrow-in-right me-1"></i>
                            Masuk
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `,

    "#dashboard": `
        <div class="row g-4 align-items-stretch">
            <aside class="col-12 col-lg-3">
                <div class="glass-card p-4 h-100">
                    <div class="soft-icon mb-3">
                        <i class="bi bi-list-check"></i>
                    </div>
                    <h4 class="fw-bold">Menu Warga</h4>
                    <p class="text-muted small">Rekap status laporan saya.</p>
                    <hr>

                    <div class="timeline-step">
                        <i class="bi bi-file-earmark-text-fill"></i>
                        <span>Draft</span>
                        <strong class="ms-auto" id="draftCount">0</strong>
                    </div>

                    <div class="timeline-step">
                        <i class="bi bi-hourglass-split"></i>
                        <span>Diproses</span>
                        <strong class="ms-auto" id="progressCount">0</strong>
                    </div>

                    <div class="timeline-step">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Selesai</span>
                        <strong class="ms-auto" id="doneCount">0</strong>
                    </div>

                    <button class="btn btn-soft-primary w-100 fw-semibold mt-3" onclick="openCreateModal()">
                        <i class="bi bi-plus-circle-fill me-1"></i>
                        Tambah Laporan Baru
                    </button>
                </div>
            </aside>

            <section class="col-12 col-lg-6">
                <div class="glass-card p-4 h-100">
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="soft-icon floating">
                            <i class="bi bi-megaphone-fill"></i>
                        </div>
                        <div>
                            <h2 class="fw-bold mb-1">Dashboard Citizen</h2>
                            <p class="text-muted mb-0">Fetching API & API Optimization</p>
                        </div>
                    </div>

                    <ul class="nav nav-pills mb-4">
                        <li class="nav-item">
                            <button class="nav-link active" id="myReportsTab" onclick="switchTab('my_reports')">
                                <i class="bi bi-person-lines-fill me-1"></i>
                                Laporan Saya
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link" id="feedTab" onclick="switchTab('feed')">
                                <i class="bi bi-broadcast-pin me-1"></i>
                                Feed Kota
                            </button>
                        </li>
                    </ul>

                    <div id="listContainer"></div>

                    <div id="paginationContainer" class="mt-4"></div>
                </div>
            </section>

            <aside class="col-12 col-lg-3">
                <div class="glass-card p-4 h-100">
                    <div class="soft-icon mb-3">
                        <i class="bi bi-signpost-split-fill"></i>
                    </div>
                    <h4 class="fw-bold">Alur Status</h4>
                    <p class="text-muted small">Tahapan laporan warga.</p>
                    <hr>

                    <div class="timeline-step">
                        <i class="bi bi-file-earmark-text-fill"></i>
                        <span>Draft</span>
                    </div>

                    <div class="timeline-step">
                        <i class="bi bi-send-fill"></i>
                        <span>Reported</span>
                    </div>

                    <div class="timeline-step">
                        <i class="bi bi-patch-check-fill"></i>
                        <span>Verified</span>
                    </div>

                    <div class="timeline-step">
                        <i class="bi bi-tools"></i>
                        <span>In Progress</span>
                    </div>

                    <div class="timeline-step">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Resolved</span>
                    </div>
                </div>
            </aside>
        </div>
    `
};

function handleRouting() {
    const hash = window.location.hash || "#login";

    document.getElementById("app-content").innerHTML =
        routes[hash] || routes["#login"];

    if (typeof updateNavMenu === "function") {
        updateNavMenu();
    }

    if (hash === "#login" && typeof setupLoginForm === "function") {
        setupLoginForm();
    }

    if (hash === "#dashboard" && typeof initializeDashboard === "function") {
        initializeDashboard();
    }
}

window.addEventListener("hashchange", handleRouting);
window.addEventListener("DOMContentLoaded", handleRouting);
