document.addEventListener("DOMContentLoaded", async () => {
    await BütünIsleriGetirAsync(true); 

    document.getElementById("chkPasif").addEventListener("change", e => {
        const bitenGoster = e.target.checked; 
        BütünIsleriGetirAsync(bitenGoster);   
    });
});

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