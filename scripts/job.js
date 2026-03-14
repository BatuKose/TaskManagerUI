let gelUserId = null;

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("authToken");
    gelUserId = getUserIdFromToken(token);

    await BütünIsleriGetirAsync(true); 

    document.getElementById("chkPasif").addEventListener("change", e => {
        const bitenGoster = e.target.checked; 
        BütünIsleriGetirAsync(bitenGoster);   
    });
    kendiIsleriniGetir()
    aktifCalisanlariGetir(token);
});

function getUserIdFromToken(token) {
    if (!token) return null;
    

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
  
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    const payload = JSON.parse(atob(padded));
    return payload.UserId;
}



// function getUserIdFromToken(token) {
//     if (!token) return null;
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.UserId;
// }

async function BütünIsleriGetirAsync(bitenGoster = true) {
    try {
        const istek = await fetch(`http://localhost:1000/api/Job/BütünisBaslık?bitmisMi=${bitenGoster}`);
        const data = await istek.json();

        if (!istek.ok) {
            throw new Error(data.Message || data.message || "Bilinmeyen hata");
        }
        fillTableJobAll(data);
        console.log(data)
    } catch (err) {
        alert(err.message);
    }
}



function fillTableJobAll(data) {
    const tablo = document.querySelector("#BütünIsler tbody");
    tablo.innerHTML = "";
    data.forEach(job => {
        let durum=null;
        if(job.status==1)
        {
            durum="Bekleniyor"
        }else if(job.status==2)
        {
            durum="Karşılandı"
        }
        else if(job.status==3)
        {
            durum="Tamamlandı"
        }
        else if(job.status==4)
        {
            durum="iptal"
        }
        else if(job.status==5)
        {
            durum="Cezalı"
        }
        else
        {
            durum="tanımsız"
        }
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
            <td>${durum}</td>
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
        const silincekid = selectedJobId ? selectedJobId : selectedKendiJobId;

        if (!silincekid) return alert("Lütfen bir iş seçin");
        const istek=await fetch(`http://localhost:1000/api/Job/iş başlık?id=${silincekid}`,{
        method:"DELETE"
        });
       
        if(!istek.ok)
        {
            const data=await istek.json();
            throw new Error(data.Message||"Bilinmeyen hata");
        }
         alert("İş başlık silindi")
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
        fillTableKendiislerim(data)
        return data;
    }
    catch (err) {
        alert(err.message);   
    }
}
function fillTableKendiislerim(data) {
    const tablo = document.querySelector("#kendiIsler tbody");
    tablo.innerHTML = "";
    data.forEach(job => {
        let durum=null;
        if(job.status==1)
        {
            durum="Bekleniyor"
        }else if(job.status==2)
        {
            durum="Karşılandı"
        }
        else if(job.status==3)
        {
            durum="Tamamlandı"
        }
        else if(job.status==4)
        {
            durum="iptal"
        }
        else if(job.status==5)
        {
            durum="Cezalı"
        }
        else
        {
            durum="tanımsız"
        }
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
            <td>${durum}</td>
        `; 
        tablo.appendChild(tr);
    });
}
let selectedKendiJobId=null;
document.querySelector("#kendiIsler tbody").addEventListener("click",(e)=>
{
    const tr=e.target.closest("tr");
    if(!tr) return;
    document.querySelectorAll("#kendiIsler tbody tr").forEach(j=>
    {
        j.style.background="";
    });
    tr.style.background="#ddd";
    selectedKendiJobId=tr.dataset.dosyaId;   
});
document.getElementById("isKarsila").addEventListener("click",()=>
{
    if(!gelUserId) return alert("Hata sistem yöneticise başvurun");
    if(!selectedJobId) return alert("İş seçiniz");
    console.log(selectedJobId)
    console.log(gelUserId)
    isKarsila()
})

 async function isKarsila() {
  try
  {
    debugger;
      const istek=  await fetch(`http://localhost:1000/api/Job/karsila?userId=${gelUserId}&jobId=${selectedJobId}`,
        {
            method:"POST",
            body: JSON.stringify({
                 
                userId: gelUserId, 
                jobId:selectedJobId
                })
        });
    const data=await istek.json(); 
    if (!istek.ok) {
       throw new Error(data.message || data.Message || "Bilinmeyen hata");
    }
    console.log(data)
    
  }
  catch(err)
  {
    alert(err.message)
  }   
  kendiIsleriniGetir()
  BütünIsleriGetirAsync()
}

async function aktifCalisanlariGetir(token) {
    try {
        const istek = await fetch(`http://localhost:1000/api/users/calisanlar`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        const data = await istek.json();

        if (!istek.ok) {
            throw new Error(data.Message || data.message || "Bilinmeyen hata");
        }
        console.log(data);
        return data;
        
    }
    catch (err) {
        alert(err.message);
    }
}
document.getElementById("isBaslikGuncelle").addEventListener("click", async () =>
{
    if (!selectedJobId) return alert("güncellencek işi seciniz.");
    document.getElementById("isBaslikUpdateModal").style.display = "block";
    
    const token = localStorage.getItem("authToken");
    const calisanlar = await aktifCalisanlariGetir(token); 

    const select = document.getElementById("calisanlar");
    select.innerHTML = "";
    calisanlar.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.userName;
        select.appendChild(option);
    });
});