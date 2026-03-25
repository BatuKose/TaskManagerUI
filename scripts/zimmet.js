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
async function insertCategory()
{
    const ad=document.getElementById("txtAdaciklamaInsertKaydet").value;
    const aciklama=document.getElementById("txtKategoriaciklamaInsertKaydet").value;

    try
    {
        const istek= await fetch(`http://localhost:1000/ZimmetDemirbas/InsertCategory`,
        {
            method:"POST",
             headers: {
        "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    name:ad,
                    description:aciklama
                }
            )
        }
        )
       const rawText = await istek.text(); 
    document.getElementById("txtAdaciklamaInsertKaydet").value = "";
    document.getElementById("txtKategoriaciklamaInsertKaydet").value = "";
let data;
try {
    data = JSON.parse(rawText); 
} catch {
    data = rawText;  
}

if (!istek.ok) {
    const hata = data?.message || data?.Message || data || "Bilinmeyen hata";
    throw new Error(hata);
} else {
    const mesaj = data?.message || data?.Message || data;
    alert(mesaj);
}
    }
    catch(err)
    {
        alert(err.message);
    }
}
document.getElementById("btnKategoriEkle").addEventListener("click",async ()=>{
    document.getElementById("KategoriInsertModal").style.display="block";
    document.getElementById("btnKategoriInsertIptal").addEventListener("click",()=>
    {  
        document.getElementById("KategoriInsertModal").style.display="none";
    });
    document.getElementById("btnKategoriInsertKaydet").addEventListener("click",async ()=>
    {
        insertCategory();

    })
    
});