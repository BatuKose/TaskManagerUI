
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
async function KategorileriGetir() {
    try {
        const res = await fetch("http://localhost:1000/ZimmetDemirbas/GetCategories");
        const data = await res.json();

        const select = document.getElementById("categoriCombo");

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

document.getElementById("btnKategoriEkle").addEventListener("click", async () => {

    await KategorileriGetir();

    document.getElementById("KategoriInsertModal").style.display = "block";
});

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

document.getElementById("btnKategoriInsertIptal").addEventListener("click", () => {
    document.getElementById("KategoriInsertModal").style.display = "none";
});

document.getElementById("btnKategoriInsertKaydet").addEventListener("click", async () => {

    const select = document.getElementById("categoriCombo");
    const val = Number(select.value);

    if (val > 0) {
        await updateCategori(val);
        await ürünListesiGetir();
        return;
    }
    await insertCategory();
    alert("Kayıt başarılı");
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
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                description: desc
            })
        });

        const text = await res.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
        if (!res.ok) {

            if (data.errors) {
                let msg = "";

                Object.keys(data.errors).forEach(key => {
                    data.errors[key].forEach(err => {
                        msg += `${key}: ${err}\n`;
                    });
                });

                alert(msg);
                return;
            }

            throw new Error(data?.message || data?.Message || data || "Bilinmeyen hata");
        }

        alert("Kategori eklendi");

        // temizle
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
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: val,
            name: name,
            description: desc
        })
    });

    const data = await res.text();

    if (!res.ok) {
        throw new Error(data);
    }

    alert("Güncelleme başarılı");
    document.getElementById("txtAdaciklamaInsertKaydet").value = "";
    document.getElementById("txtKategoriaciklamaInsertKaydet").value = "";
    document.getElementById("categoriCombo").value = "0";
    KategorileriGetir();
}