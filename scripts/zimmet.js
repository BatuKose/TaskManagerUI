document.addEventListener("DOMContentLoaded", async () => {
    await ürünListesiGetir();
    await ZimmetDetayTabloDoldur();
});

async function ürünListesiGetir() {
    try {
        const res = await fetch("http://localhost:1000/ZimmetDemirbas/ürün-listesi");
        const data = await res.json();

        const tbody = document.querySelector("#zimmetListesi tbody");
        tbody.innerHTML = "";
        
        data.forEach(x => {
            const tr = document.createElement("tr");
            tr.dataset.dosyaid = x.dosyaid;
            tr.innerHTML = `
                <td>${x.dosyaid}</td>
                <td>${x.urunAd}</td>
                <td>${x.urunKategori}</td>
                <td>${x.urunMarka}</td>
                <td>${x.urunModel}</td>
                <td>${x.unit}</td>
                
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        alert(err.message);
    }
}
let selectedUrunId = null;

document.querySelector("#zimmetListesi tbody").addEventListener("click", e => {
    
    const tr = e.target.closest("tr");
    if (!tr) return;

    document.querySelectorAll("#zimmetListesi tbody tr").forEach(p => {
        p.style.background = "";
    });

    tr.style.background = "#ddd";
    selectedUrunId = tr.dataset.dosyaid;  
});
async function KategorileriGetir(selectId = "categoriCombo") {
    try {
        const res = await fetch("http://localhost:1000/ZimmetDemirbas/GetCategories");
        const data = await res.json();

        const select = document.getElementById(selectId);

        while (select.options.length > 1) {
            select.remove(1);
        }

        const frag = document.createDocumentFragment();

        data.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.id;
            opt.textContent = c.name;
            opt.dataset.desc = c.description || "";
            frag.appendChild(opt);
        });

        select.appendChild(frag);

    } catch (err) {
        alert(err.message);
    }
}

// Kategori modal aç
document.getElementById("btnKategoriEkle").addEventListener("click", async () => {
    await KategorileriGetir("categoriCombo");
    document.getElementById("KategoriInsertModal").style.display = "block";
});

// Kategori combo değişince alanları doldur
document.getElementById("categoriCombo").addEventListener("change", (e) => {
    const val = Number(e.target.value);
    const ad = document.getElementById("txtAdaciklamaInsertKaydet");
    const desc = document.getElementById("txtKategoriaciklamaInsertKaydet");

    if (val === 0) {
        ad.value = "";
        desc.value = "";
        return;
    }

    const opt = e.target.options[e.target.selectedIndex];
    ad.value = opt.textContent;
    desc.value = opt.dataset.desc || "";
});

// Kategori modal iptal
document.getElementById("btnKategoriInsertIptal").addEventListener("click", () => {
    document.getElementById("KategoriInsertModal").style.display = "none";
    document.getElementById("txtAdaciklamaInsertKaydet").value = "";
    document.getElementById("txtKategoriaciklamaInsertKaydet").value = "";
    document.getElementById("categoriCombo").value = "0";
});

// Kategori kaydet
document.getElementById("btnKategoriInsertKaydet").addEventListener("click", async () => {
    const select = document.getElementById("categoriCombo");
    const val = Number(select.value);

    if (val > 0) {
        await updateCategori(val);
        await ürünListesiGetir();
        return;
    }

    await insertCategory();
    document.getElementById("txtAdaciklamaInsertKaydet").value = "";
    document.getElementById("txtKategoriaciklamaInsertKaydet").value = "";
    document.getElementById("categoriCombo").value = "0";
    await ürünListesiGetir();
});

async function insertCategory() {
    const name = document.getElementById("txtAdaciklamaInsertKaydet").value.trim();
    const desc = document.getElementById("txtKategoriaciklamaInsertKaydet").value.trim();

    try {
        const res = await fetch("http://localhost:1000/ZimmetDemirbas/InsertCategory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description: desc })
        });

        const text = await res.text();

        let data;
        try { data = JSON.parse(text); } catch { data = text; }

        if (!res.ok) {
            if (data.errors) {
                let msg = "";
                Object.keys(data.errors).forEach(key => {
                    data.errors[key].forEach(err => { msg += `${key}: ${err}\n`; });
                });
                alert(msg);
                return;
            }
            throw new Error(data?.message || data?.Message || data || "Bilinmeyen hata");
        }

        alert("Kategori eklendi");
        document.getElementById("txtAdaciklamaInsertKaydet").value = "";
        document.getElementById("txtKategoriaciklamaInsertKaydet").value = "";

    } catch (err) {
        alert(err.message);
    }
}

async function updateCategori(val) {
    const name = document.getElementById("txtAdaciklamaInsertKaydet").value.trim();
    const desc = document.getElementById("txtKategoriaciklamaInsertKaydet").value.trim();

    const res = await fetch(`http://localhost:1000/ZimmetDemirbas/UpdateCategory/${val}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: val, name, description: desc })
    });

    const data = await res.text();

    if (!res.ok) throw new Error(data);

    alert("Güncelleme başarılı");
    document.getElementById("txtAdaciklamaInsertKaydet").value = "";
    document.getElementById("txtKategoriaciklamaInsertKaydet").value = "";
    document.getElementById("categoriCombo").value = "0";
    await KategorileriGetir("categoriCombo");
}

// Ürün modal aç
document.getElementById("btnUrunEkle").addEventListener("click", async () => {
    await KategorileriGetir("productCategoriCombo");
    document.getElementById("productInsertModal").style.display = "block";
});

// Ürün modal iptal
document.getElementById("btnUrunInsertIptal").addEventListener("click", () => {
    document.getElementById("productInsertModal").style.display = "none";
    document.getElementById("txtUrunAdı").value = "";
    document.getElementById("txtUrunMarka").value = "";
    document.getElementById("txtUrunModel").value = "";
    document.getElementById("txtUrunAciklama").value = "";
    document.getElementById("txtUrunAdet").value = "";
    document.getElementById("productCategoriCombo").value = "0";
});

// Ürün kaydet
document.getElementById("btnUrunInsertKaydet").addEventListener("click", async () => {
    await insertProduct();
});

async function insertProduct() {
    const categoryId = Number(document.getElementById("productCategoriCombo").value);
    const urunAd = document.getElementById("txtUrunAdı").value;
    const urunMarka = document.getElementById("txtUrunMarka").value;
    const urunModel = document.getElementById("txtUrunModel").value;
    const urunAciklama = document.getElementById("txtUrunAciklama").value;
    const urunAdet = document.getElementById("txtUrunAdet").value;

    if (categoryId === 0) {
        alert("Lütfen kategori seçiniz.");
        return;
    }

    try {
        const istek = await fetch("http://localhost:1000/ZimmetDemirbas/InsertProduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                categoryId,
                name: urunAd,
                brand: urunMarka,
                model: urunModel,
                description: urunAciklama,
                unit: urunAdet
            })
        });

        const data = await istek.text();

        if (!istek.ok) {
            throw new Error(data || "Bilinmeyen hata");
        }

        alert(data);
        document.getElementById("productInsertModal").style.display = "none";
        document.getElementById("txtUrunAdı").value = "";
        document.getElementById("txtUrunMarka").value = "";
        document.getElementById("txtUrunModel").value = "";
        document.getElementById("txtUrunAciklama").value = "";
        document.getElementById("txtUrunAdet").value = "";
        document.getElementById("productCategoriCombo").value = "0";
        await ürünListesiGetir();

    } catch (err) {
        alert(err.message);
    }
}
document.getElementById("btnUrunSil").addEventListener("click",async ()=>{
    if(!selectedUrunId) return alert("Ürün seçiniz");
    document.getElementById("UrunSilmeSoruModal").style.display = "block";
    document.getElementById("btnUrunSilHayir").addEventListener("click",()=>{
        selectedUrunId=null;
         document.getElementById("UrunSilmeSoruModal").style.display = "none";
         ürünListesiGetir();
    })
    document.getElementById("btnUrunSilEvet").addEventListener("click",()=>{
        UrunSil();
        document.getElementById("UrunSilmeSoruModal").style.display = "none";
    })

})
async function UrunSil() {
        try{
            const istek= await fetch(`http://localhost:1000/ZimmetDemirbas/soft-delete-product/${selectedUrunId}`,{
                method:"PUT"
            });
            if(!istek.ok)
            {
                const data= await istek.json();
                throw new Error(data.Message ||"Bilinmeyen hata")
            }
            else
            {
                selectedUrunId="";
                alert("Ürün silindi");
                ürünListesiGetir();
                
            }
        }
        catch(err)
        {
            alert(err.message);
        }
       }

async function getUsers() {
    try
    {
        const istek= await fetch(`http://localhost:1000/ZimmetDemirbas/getuserforzimmet`);
        const data= await istek.json();
        if(!istek.ok)
        {
            throw new Error(data.Message||"Bilinmeyen hata")
        }
       return data;
      console.log(data)
    }
    catch(err)
    {
        alert(err.message);
    }
}
let userId=null;
document.getElementById("btnZimmetEkle").addEventListener("click",async()=>{
    if(!selectedUrunId) return alert("ürün seçiniz");
    document.getElementById("userModal").style.display = "block";
    const users= await getUsers();
    if(!users) return;
    const tbody=document.querySelector("#userListesi tbody");
    tbody.innerHTML="";
    users.forEach(u=>
    {
        const tr=document.createElement("tr");
         
        tr.innerHTML=`
            <td>${u.userId}</td>
            <td>${u.userName}</td>
            <td>${u.userRole}</td>
        `;
        tr.dataset.userId = u.userId;
            tr.addEventListener("click",()=>
            {
                tr.style.background = "#ddd";
               userId=u.userId; 
            })
        tbody.appendChild(tr);    
    })
    document.getElementById("btnZimmetYap").addEventListener("click",async()=>
    {
        const unit=document.getElementById("zimmetInsertUnit").value;
        if(unit<=0) return alert("ürün miktarı giriniz");
        try
        {
            const istek = await fetch(`http://localhost:1000/ZimmetDemirbas/ZimmetKisiler`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: userId,
                procudtId: selectedUrunId,
                unit: unit
                })
            });

            
            if(!istek.ok){
                const data= await istek.json();
                throw new Error(data.Message||"bilinmeyen hata")
            }
            else
            {
                alert("Zimmet işlemi gerçekleşti!")
                ürünListesiGetir();
                
            }
        }
        catch(err)
        {
            alert(err.message)
        }
        finally
        {
            document.getElementById("userModal").style.display = "none";
        }
    })
    document.getElementById("btnZimmetYapma").addEventListener("click",()=>
    {
        userId="";
        procudtId=";"
        document.getElementById("userModal").style.display = "none";
          document.querySelectorAll("#zimmetListesi tbody tr").forEach(p => {
        p.style.background = "";
    });
    })
})

async function DetayliZimmetListesiGetir() {
    try
    {
        const istek= await fetch(`http://localhost:1000/ZimmetDemirbas/ZimmetDetayListesi`);
        const data= await istek.json();
        if(!istek.ok)
        {
            throw new Error(data.Message ||"Bilinmeyen hata");
        }
        else
        {
            return data;
        }   
    }
    catch(err)
    {
        alert(err.message)
    }
}

async function ZimmetDetayTabloDoldur()
{
    const detay = await DetayliZimmetListesiGetir();
    const tbody = document.querySelector("#detayliZimmetListesi tbody");
    
    tbody.innerHTML = ""
    
    detay.forEach(d =>  
    {
        let durumUi=null;
        if(d.durum==1)
        {
            durumUi="Bekliyor"
        }
        else if(d.durum==2)
        { 
            durumUi="Onaylandı"
        }
          else if(d.durum==3)
        { 
            durumUi="İptal"
        }
        else
        {
            durumUi="Tanımsız"
        }
        const tr = document.createElement("tr");
        tr.dataset.detayid = d.dosyaId; 
        tr.innerHTML = `
            <td>${d.dosyaId}</td>
            <td>${d.zimmetKisiAd}</td>
            <td>${d.zimmetKisiEmail}</td>
            <td>${d.kisiRol}</td>
            <td>${d.urunAd}</td>
            <td>${d.model}</td>
            <td>${d.urunKategoriAd}</td>
            <td>${d.zimmetMiktar}</td>
            <td>${d.zimmetTarih}</td>
            <td>${durumUi}</td>
        `;
        tbody.append(tr);
    });
}
let selectedDetayId;

document.getElementById("detayliZimmetListesi").addEventListener("click", e =>
{
    const tr = e.target.closest("tr");
    if (!tr) return;

    document.querySelectorAll("#detayliZimmetListesi tbody tr").forEach(x =>  
    {
        x.style.background = "";
    });

    tr.style.background = "#ddd";  
   selectedDetayId = tr.dataset.detayid;
    //console.log(selectedDetayId);
});

document.getElementById("excelExportBtn").addEventListener("click", async () =>
{
    //debugger;
    const istek = await fetch(`http://localhost:1000/ZimmetDemirbas/export-excel-zimmetkisiler`);
    
    if (!istek.ok) return alert("Excel oluşturulamadı!");

    const blob = await istek.blob();
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `Zimmetler_${new Date().toISOString().slice(0,10)}.xlsx`;
    a.click();
    
    URL.revokeObjectURL(url);
});

document.getElementById("btnZimmetIdae").addEventListener("click",()=>{
    if(!selectedDetayId) return alert("İade edilecek zimmeti seçiniz!!");
    document.getElementById("iadeModal").style.display="block";
    document.getElementById("btnİadeIptal").addEventListener("click",()=>{
        selectedDetayId=null;
        document.getElementById("iadeModal").style.display="none";
        document.querySelectorAll("#detayliZimmetListesi tbody tr").forEach(x =>  
    {
        x.style.background = "";
    });
    })
    document.getElementById("btnİadeEvet").addEventListener("click",async ()=>
    {
        try
        {
            let iadeMiktar = parseFloat(document.getElementById("txtİdaeMiktar").value);
            if (isNaN(iadeMiktar) || iadeMiktar <= 0) 
            return alert("İade Miktarı sıfırdan büyük olmalıdır");
        const istek= await fetch(`http://localhost:1000/ZimmetDemirbas/zimmetiade?dosyaid=${selectedDetayId}&miktar=${iadeMiktar}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
        })
        if(!istek.ok)
        {
            const data= await istek.json();
            throw new Error(data.Message ||"Bilinmeyen hata")
        }
        else
        {
            alert("İade Gerçekleşti")
        }
        selectedDetayId=null;
        document.getElementById("iadeModal").style.display="none";
        document.querySelectorAll("#detayliZimmetListesi tbody tr").forEach(x =>  
        {
             x.style.background = "";
        });
        }
        catch(err)
        {
            alert(err.message)
        }
        finally
        {
            await ürünListesiGetir();
             ZimmetDetayTabloDoldur();
        }
    })
})

document.getElementById("btnZimmetDurum").addEventListener("click",async()=>
{
    if(!selectedDetayId) return alert("Zimmet seçiniz");
    document.getElementById("DurumDegisiklikModal").style.display="block";
    document.getElementById("btnDurumHayir").addEventListener("click",()=>{
        document.getElementById("DurumDegisiklikModal").style.display="none";
        selectedDetayId=null;
        document.querySelectorAll("#detayliZimmetListesi tbody tr").forEach(x =>  
        {
            x.style.background = "";
        });
    })

    document.getElementById("btnDurumEvet").addEventListener("click", async ()=>{
        try
        {

        let managerid=5;
        let durum = parseInt(document.getElementById("durumEmum").value);
        const istek= await fetch(`http://localhost:1000/ZimmetDemirbas/zimmetDurumDegisikligi?id=${selectedDetayId}&managerid=${managerid}&durum=${durum}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }
        })

        if(!istek.ok)
        {
            const data= await istek.json();
            throw new Error(data.Message ||"Bilinmeyen hata")
        }
        else
        {
            alert("zimmet durumu değişti");
        }
        document.getElementById
        ("DurumDegisiklikModal").style.display="none";
        selectedDetayId=null;
        document.querySelectorAll("#detayliZimmetListesi tbody tr").forEach(x =>  
        {
            x.style.background = "";
        });
        }
        catch(err)
        {
            alert(err.message)
        }
        finally
        {
            await ürünListesiGetir();
            ZimmetDetayTabloDoldur();
        }
        
    })
})