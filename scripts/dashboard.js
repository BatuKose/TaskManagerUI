  if (!localStorage.getItem("authToken")) {
        window.location.href = "login.html";
    }

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("authToken");
        window.location.href = "login.html";
    });
