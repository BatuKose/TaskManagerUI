document.addEventListener("DOMContentLoaded", async () => {
    await ürünListesiGetir();
});

async function ürünListesiGetir() {
    try {
        const res = await fetch("http://localhost:1000/ZimmetDemirbas/ürün-listesi");
        const data = await res.json();

        fillTable(data);

    } catch (err) {
        alert(err.message);
    }
}

function fillTable(data) {
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

            // açıklama taşı
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
    const aciklama = document.getElementById("txtKategoriaciklamaInsertKaydet");

    if (val === 0) {
        ad.value = "";
        aciklama.value = "";
        return;
    }

    const opt = e.target.options[e.target.selectedIndex];

    ad.value = opt.textContent;
    aciklama.value = opt.dataset.desc || "";
});

document.getElementById("btnKategoriInsertIptal").addEventListener("click", () => {
    document.getElementById("KategoriInsertModal").style.display = "none";
});


document.getElementById("btnKategoriInsertKaydet").addEventListener("click", async () => {

    const select = document.getElementById("categoriCombo");
    const val = Number(select.value);

    if (val > 0) {
        alert("update"); // backend yok
        return;
    }

    await insertCategory();
    await ürünListesiGetir();
});


async function insertCategory() {

    const ad = document.getElementById("txtAdaciklamaInsertKaydet").value.trim();
    const aciklama = document.getElementById("txtKategoriaciklamaInsertKaydet").value.trim();

    const res = await fetch("http://localhost:1000/ZimmetDemirbas/InsertCategory", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: ad,
            description: aciklama
        })
    });

    const data = await res.text();


    document.getElementById("txtAdaciklamaInsertKaydet").value = "";
    document.getElementById("txtKategoriaciklamaInsertKaydet").value = "";
}