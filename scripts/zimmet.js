document.addEventListener("DOMContentLoaded", async()=>{
    ürünListesiGetir();
});

async function ürünListesiGetir() {
    try
    {
        const istek= await fetch(`http://localhost:1000/ZimmetDemirbas/ürün-listesi`);
        const data=await istek.json();
        if(!istek.ok){
            throw new Error(istek.Message ||"Bilinmeyen hata oluştu");
        }
        console.log(data);
        fillUrünListesiTablosu(data);
    }
    catch(err)
    {
        alert(err.message);
    }
}
let ürünid="";
function fillUrünListesiTablosu(data)
{
    const tablo=document.querySelector("#zimmetListesi tbody");
    tablo.innerHTML="";
    data.forEach(z=> {
        const tr=document.createElement("tr");
        tr.dataset.dosyaid=z.dosyaid;
        tr.innerHTML=`
        <td>${z.dosyaid}</td>
        <td>${z.urunAd}</td>
        <td>${z.urunKategori}</td>
        <td>${z.urunMarka}</td>
        <td>${z.urunModel}</td>`;
        ürünid=z.dosyaid;
        tablo.appendChild(tr);
    });
}