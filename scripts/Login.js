const txtusername = document.querySelector("#username");
const txtpassword = document.querySelector("#password");
const girisButon = document.querySelector("#girisButon");


 async function Login() {
    const username = txtusername.value;
    const password = txtpassword.value;
    
    console.log("Login deneniyor:", username, password);

    const istek = await fetch("http://localhost:1000/Authentication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userName: username,
            passWord: password
        })
    });

    console.log("Status:", istek.status);
    
    const data = await istek.json();
    console.log("Response:", data);
    
    localStorage.setItem("authToken", data.token);
    console.log("Kaydedilen token:", localStorage.getItem("authToken"));
    
    window.location.href = "dashboard.html";
}

girisButon.addEventListener("click", Login);