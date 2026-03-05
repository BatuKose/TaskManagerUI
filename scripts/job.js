function authFetch(url, options = {}) {
    const token = localStorage.getItem("authToken");
    const { headers, ...rest } = options;
    return fetch(url, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...headers
        }
    });
}
document.addEventListener("DOMContentLoaded",async()=>
{
    BütünIsleriGetirAsync () 
});
async function BütünIsleriGetirAsync() {
    try {
        const istek = await fetch(`http://localhost:1000/api/Job/Bütünisler`);
        const data = await istek.json();

       if (!istek.ok) {
    console.log(Object.keys(data));
    throw new Error(data.Message || data.message || "Bilinmeyen hata");
}

        console.log(data);
        fillTableJobAll(data);
    }
    catch (err) {
        alert(err.message);
    }
}
function fillTableJobAll(data)
{
    const tablo=document.querySelector("#BütünIsler tbody");
    tablo.innerHTML="";
    data.forEach(job => {
        const tr=document.createElement("tr");
        tr.innerHTML=`
            <td>${job.jobHeaderId}</td>
            <td>${job.jobHeaderName}</td>
            <td>${job.jobDetayName}</td>
            <td>${job.managerUserName}</td>
            <td>${job.managerRole}</td>
            <td>${job.workerUserName}</td>
            <td>${job.workerRole}</td>
            <td>${job.workCreateTıme}</td>
            <td>${job.deadline}</td>
            <td>${job.jobFinishedTime}</td>
            <td>${job.jobDetayStatus}</td>
            <td>${job.jobHeaderStatus}</td>
        `; 
         tablo.appendChild(tr);  
    });

}