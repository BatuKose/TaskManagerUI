const txtusername = document.querySelector("#username");
const txtpassword = document.querySelector("#password");
const girisButon = document.querySelector("#girisButon");

async function Login() {
    try {
        const username = txtusername.value;
        const password = txtpassword.value;

        const istek = await fetch("http://localhost:1000/Authentication", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName: username,
                passWord: password
            })
        });

        const data = await istek.json();
        const token=data.token;
        sessionStorage.setItem("authToken",token)
           console.log(data); 
//         if (token) {
//         window.location.href = "SistemYonetimi.html"; 
// }
        if (!istek.ok) {
            throw new Error(data.Message || "Beklenmedik hata oluştu");
        }

     
    } catch (err) {
        alert(err.message);
    }
}

girisButon.addEventListener("click", () => {
    Login();
});