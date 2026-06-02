function updateNavMenu() {
    const navMenu = document.getElementById("nav-menu");
    const accessToken = localStorage.getItem("access_token");

    if (!navMenu) {
        return;
    }

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
