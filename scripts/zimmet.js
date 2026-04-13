document.addEventListener("DOMContentLoaded", async () => {
    await ürünListesiGetir();
});

async function ürünListesiGetir() {
    try {
        const res = await fetch("http://localhost:1000/ZimmetDemirbas/ürün-listesi");
        const data = await res.json();

        const tbody = document.querySelector("#zimmetListesi tbody");
        tbody.innerHTML = "";

        data.forEach(x => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${x.dosyaid}</td>
                <td>${x.urunAd}</td>
                <td>${x.urunKategori}</td>
                <td>${x.urunMarka}</td>
                <td>${x.urunModel}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        alert(err.message);
    }
}

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