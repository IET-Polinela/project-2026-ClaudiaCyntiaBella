function setupLoginForm() {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.log("Form login tidak ditemukan");
        return;
    }

    loginForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        console.log("Tombol login diklik");

        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await requestAPI("/api/token/", "POST", {
                username: username,
                password: password
            });

            console.log("Response login:", response);

            if (response.status === 200) {
                localStorage.setItem("access_token", response.data.access);
                localStorage.setItem("refresh_token", response.data.refresh);

                alert("Login berhasil!");
                window.location.hash = "#dashboard";
            } else {
                alert("Login gagal: " + JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("Error login:", error);
            alert("Terjadi error. Cek Console.");
        }
    });
}
