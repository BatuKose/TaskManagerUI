let gelUserId = null;

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("authToken");
    gelUserId = getUserIdFromToken(token);
    console.log(gelUserId);
    console.log(token)

    await BütünIsleriGetirAsync(true); 

    document.getElementById("chkPasif").addEventListener("change", e => {
        const bitenGoster = e.target.checked; 
        BütünIsleriGetirAsync(bitenGoster);   
    });
    kendiIsleriniGetir()
});

function getUserIdFromToken(token) {
    if (!token) return null;
    

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
  
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    const payload = JSON.parse(atob(padded));
    return payload.UserId;
}


async function BütünIsleriGetirAsync(bitenGoster) {
    console.log(gelUserId); 
}

function getUserIdFromToken(token) {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.UserId;
}
  console.log(gelUserId);
async function BütünIsleriGetirAsync(bitenGoster = true) {
    try {
        const istek = await fetch(`http://localhost:1000/api/Job/BütünisBaslık?bitmisMi=${bitenGoster}`);
        const data = await istek.json();

        if (!istek.ok) {
            throw new Error(data.Message || data.message || "Bilinmeyen hata");
        }
        console.log(data)
        fillTableJobAll(data);
    } catch (err) {
        alert(err.message);
    }
}



function fillTableJobAll(data) {
    const tablo = document.querySelector("#BütünIsler tbody");
    tablo.innerHTML = "";
    data.forEach(job => {
        const tr = document.createElement("tr");
        tr.dataset.dosyaId = job.dosyaId;
        tr.innerHTML = `
            <td>${job.dosyaId}</td>
            <td>${job.title}</td>
            <td>${job.managerName}</td>
            <td>${job.managerRoleName}</td>
            <td>${job.managerRole}</td>
            <td>${job.assignedUser}</td>
            <td>${job.userRoleName}</td>
            <td>${job.createdDate}</td>
            <td>${job.deadline}</td>
            <td>${job.status}</td>
        `;
        tablo.appendChild(tr);
    });
}

let selectedJobId = null;

document.querySelector("#BütünIsler tbody").addEventListener("click", e => {
    const tr = e.target.closest("tr");  
    if (!tr) return;

    document.querySelectorAll("#BütünIsler tbody tr").forEach(j => {
        j.style.background = ""; 
    });

    tr.style.background = "#ddd"; 
    selectedJobId = tr.dataset.dosyaId;
});
document.getElementById("deleteJobHeader").addEventListener("click",()=>
{
   if(!selectedJobId) return alert("İş başlığı seçin");
   document.getElementById("DeleteconfirmModal").style.display = "block";
  
})
document.querySelector("#DeleteconfirmModal #DeletebtnYes").addEventListener("click", () => {
    IsBaslikSil();
     document.getElementById("DeleteconfirmModal").style.display = "none";
});
document.querySelector("#DeleteconfirmModal #DeletebtnNo").addEventListener("click", () => {
     document.getElementById("DeleteconfirmModal").style.display = "none";
});
async function IsBaslikSil()
{
    try
    {
        const istek=await fetch(`http://localhost:1000/api/Job/iş başlık?id=${selectedJobId}`,{
        method:"DELETE"
        });
        alert("İş başlık silindi")
        if(!istek.ok)
        {
            const data=await istek.json();
            throw new Error(data.Message||"Bilinmeyen hata");
        }
        BütünIsleriGetirAsync();
    }
    catch(err)
    {
        alert(err.message);
    }
}

async function kendiIsleriniGetir() {
    try {
        const istek = await fetch(`http://localhost:1000/api/Job/Kendiİslerim?userId=${gelUserId}`); 
        
        if (!istek.ok) {
            const hata = await istek.json();
            throw new Error(hata.Message || "Bilinmeyen hata");
        }

        const data = await istek.json(); 
        console.log(data);
        console.log(gelUserId)
        return data;
    }
    catch (err) {
        alert(err.message);   
    }

}