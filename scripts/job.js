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
    isKarsila()
})

 async function isKarsila() {
  try
  {
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

    document.getElementById("isBaslikbtnClose").addEventListener("click",()=>
    {
     document.getElementById("isBaslikUpdateModal").style.display = "none";    
    });
    
    document.getElementById("isBaslikbtnSave").addEventListener("click", async () =>
{
    try
    {
        const text=document.getElementById("UpdateBaslik").value;
        const istek = await fetch(`http://localhost:1000/api/Job/iş başlık?id=${selectedJobId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: text,
                    assignedUserId: document.getElementById("calisanlar").value
                })
            }
        );

        if (!istek.ok)
        {
            const data = await istek.json();
            throw new Error(data.Message || "Bilinmeyen hata");
        }

        alert("seçili iş güncellendi");
        document.getElementById("UpdateBaslik").value = "";
        BütünIsleriGetirAsync(); 
        document.getElementById("isBaslikUpdateModal").style.display = "none";
    }
    catch (err)
    {
        alert(err.message);
    }
});
});
async function aktifYoneticileriGetir(token) {
    try {
        const istek = await fetch(`http://localhost:1000/api/users/yoneticiler`, {
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
        return data;
        
    }
    catch (err) {
        alert(err.message);
    }
}
document.getElementById("isBaslikEkle").addEventListener("click", async ()=>
{
    const token = localStorage.getItem("authToken");
    const calisanlar = await aktifCalisanlariGetir(token); 
    const yoneticiler = await aktifYoneticileriGetir(token);
 
    const select = document.getElementById("Insertcalisanlar");
    select.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = 0;
    defaultOption.textContent = "Atanmadı";
    select.appendChild(defaultOption);
    
    calisanlar.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.userName;
        select.appendChild(option);
    });

    const select2 = document.getElementById("InsertYoneticiler");
    select2.innerHTML = "";
    yoneticiler.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.userName;
        select2.appendChild(option);
    });

    document.getElementById("isBaslikInsertModal").style.display = "block";

    document.getElementById("isBaslikInsertbtnClose").addEventListener("click", function kapat(){
        document.getElementById("isBaslikInsertModal").style.display = "none";
    });

    document.getElementById("isBaslikInsertbtnSave").addEventListener("click", async function ac(){
        const titleText      = document.getElementById("InsertBaslik").value;
        const managerId      = parseInt(document.getElementById("InsertYoneticiler").value);
        const assignedUserId = parseInt(document.getElementById("Insertcalisanlar").value); 
        const deadline       = document.getElementById("InsertDeadline").value;

        try {
            const istek = await fetch(`http://localhost:1000/api/Job/isbaslik`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: titleText,
                    managerId: managerId,
                    assignedUserId: assignedUserId,
                    deadline: new Date(deadline).toISOString()
                })
            });

            

            if (!istek.ok) {
                const data = await istek.json();
                throw new Error(data.Message || data.message || "Bilinmeyen hata");
            }

            alert("İş başlık başarıyla eklendi!");

        } catch (err) {
            alert(err.message);
        } finally {
           
            document.getElementById("InsertBaslik").value = "";
            document.getElementById("InsertDeadline").value = "";
            document.getElementById("Insertcalisanlar").value = 0; 
            document.getElementById("InsertYoneticiler").selectedIndex = 0;
            document.getElementById("isBaslikInsertModal").style.display = "none";
            await BütünIsleriGetirAsync(true);
        }
    });
});

let selectedJobDetailId = null; 

function statusMetni(status) {
    const map = { 1: "Bekliyor", 2: "Devam Ediyor", 3: "Tamamlandı", 4: "İptal" };
    return map[status] || "Bilinmiyor";
}

function tarihFormatla(tarih) {
    if (!tarih || tarih.startsWith("0001")) return "-";
    return new Date(tarih).toLocaleString("tr-TR");
}

function modalOlustur() {
    if (document.getElementById("isDetayModal")) return;

    const overlay = document.createElement("div");
    overlay.id = "isDetayModal";
    overlay.innerHTML = `
        <div id="isDetayModalIcerik">
            <div id="isDetayModalHeader">
                <h2 id="isDetayBaslik"></h2>
                <button id="isDetayKapat">✕</button>
            </div>
            <div id="isDetayMeta"></div>
            <table id="isDetayTablo">
                <thead>
                    <tr>
                        <th>Detay ID</th>
                        <th>Görev Adı</th>
                        <th>Durum</th>
                        <th>Deadline</th>
                        <th>Bitiş Zamanı</th>
                        <th>Atayan</th>
                        <th>Çalışan</th>
                    </tr>
                </thead>
                <tbody id="isDetayBody"></tbody>
            </table>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("isDetayKapat").addEventListener("click", modalKapat);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) modalKapat();
    });
}

function modalKapat() {
    const modal = document.getElementById("isDetayModal");
    if (modal) modal.remove();
}

function modalDoldur(data) {
    const ilk = data[0];

    document.getElementById("isDetayBaslik").textContent = ilk.jobHeaderName;

    document.getElementById("isDetayMeta").innerHTML = `
        <span>İş Durumu: <b>${statusMetni(ilk.jobHeaderStatus)}</b></span>
        <span>Yönetici: <b>${ilk.managerUserName} (${ilk.managerRole})</b></span>
        <span>Oluşturulma: <b>${tarihFormatla(ilk.workCreateTıme)}</b></span>
    `;

    const tbody = document.getElementById("isDetayBody");
    tbody.innerHTML = "";

    data.forEach((item) => {
        const tr = document.createElement("tr");

        
        tr.style.cursor = "pointer";
        tr.addEventListener("click", () => {
         
            tbody.querySelectorAll("tr").forEach(r => r.classList.remove("selected"));
            tr.classList.add("selected");
            selectedJobDetailId = item.jobDetailId;
            console.log("Seçilen jobDetailId:", selectedJobDetailId);
        });

        tr.innerHTML = `
            <td>${item.jobDetailId}</td>
            <td>${item.jobDetayName}</td>
            <td>${statusMetni(item.jobDetayStatus)}</td>
            <td>${tarihFormatla(item.deadline)}</td>
            <td>${tarihFormatla(item.jobFinishedTime)}</td>
            <td>${item.managerUserName}</td>
            <td>${item.workerUserName}</td>
        `;
        tbody.appendChild(tr);
    });
}

async function isDetaylariniGetir() {
    try {
        const jobId = selectedJobId ? selectedJobId : selectedKendiJobId;
        if (!jobId) return alert("İş başlığı seçiniz");

        const istek = await fetch(`http://localhost:1000/api/Job/jobAllDetails?jobHeaderId=${jobId}`);
        const data = await istek.json();

        if (!istek.ok) throw new Error(data.Message || "Bilinmeyen hata");

        selectedJobDetailId = null;
        modalOlustur();
        modalDoldur(data);

    } catch (err) {
        alert(err.message);
    }
}

document.getElementById("isDetaylari").addEventListener("click", () => {
    isDetaylariniGetir();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modalKapat();
});