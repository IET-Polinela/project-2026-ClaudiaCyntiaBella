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
                    <p class="text-muted small">Kelola laporan kota dengan mudah.</p>
                    <hr>
                    <button class="btn btn-soft-primary w-100 fw-semibold">
                        <i class="bi bi-plus-circle-fill me-1"></i>
                        Buat Laporan
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
                            <h2 class="fw-bold mb-1">Halo, Citizen!</h2>
                            <p class="text-muted mb-0">Selamat datang di Dashboard Smart City Tracker</p>
                        </div>
                    </div>

                    <div class="p-4 rounded-4 mb-4" style="background:#eff6ff;">
                        <h4 class="fw-bold mb-2">Laporkan Masalah Kota</h4>
                        <p class="text-muted mb-0">
                            Warga dapat membuat laporan awal sebagai draft, lalu mengirimkannya
                            agar dapat diproses oleh admin.
                        </p>
                    </div>

                    <div class="row g-3">
                        <div class="col-12 col-md-4">
                            <div class="stat-card p-3 rounded-4 bg-white shadow-sm">
                                <i class="bi bi-file-earmark-text-fill text-primary"></i>
                                <div class="fw-bold mt-2">Draft</div>
                                <small class="text-muted">Laporan awal</small>
                            </div>
                        </div>

                        <div class="col-12 col-md-4">
                            <div class="stat-card p-3 rounded-4 bg-white shadow-sm">
                                <i class="bi bi-send-fill text-primary"></i>
                                <div class="fw-bold mt-2">Reported</div>
                                <small class="text-muted">Dikirim warga</small>
                            </div>
                        </div>

                        <div class="col-12 col-md-4">
                            <div class="stat-card p-3 rounded-4 bg-white shadow-sm">
                                <i class="bi bi-hourglass-split text-primary"></i>
                                <div class="fw-bold mt-2">Progress</div>
                                <small class="text-muted">Diproses admin</small>
                            </div>
                        </div>
                    </div>
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
                        <span>Completed</span>
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
}

window.addEventListener("hashchange", handleRouting);
window.addEventListener("DOMContentLoaded", handleRouting);
