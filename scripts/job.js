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
async function BütünIsleriGetirAsync () {
    try
    {
        const istek= await fetch(`http://localhost:1000/api/Job/Bütünisler`);
    const data= await istek.json();
    console.log(data);
    if(!istek.ok)
    {
       throw new Error(await data.text());
    }
    }
    catch(err)
    {
        alert(err.message)
    }
}