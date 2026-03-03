document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("chkPasif").checked = false;
    await loadUsers(true);
    await UpdateloadRoles();
    await CreateloadRoles();
    await loadRoles();
});

// Pasif kullanıcıları göster/gizle checkbox
document.getElementById("chkPasif").addEventListener("change", e => {
    const pasifGoster = e.target.checked;
    loadUsers(!pasifGoster);
});

// Kullanıcıları yükle
async function loadUsers(aktifMi = true) {
    try {
        const url = `http://localhost:1000/api/users/userDetails?aktifMi=${aktifMi}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        fillTable(data);
    } catch (err) {
        alert(err.message);
    }
}

// Roller dropdownlarını yükle (Update)
async function UpdateloadRoles() {
    try {
        const istek = await fetch("http://localhost:1000/Role/GetRoles");
        const roles = await istek.json();
        if (!istek.ok) throw new Error(roles.Message);
        
        const select = document.getElementById("UpdatecmbRole");
        select.innerHTML = "";
        roles.forEach(role => {
            const option = document.createElement("option");
            option.value = role.id;
            option.text = role.roleName;
            select.appendChild(option);
        });
    } catch (err) {
        alert(err.message);
    }
}

// Roller dropdownlarını yükle (Create)
async function CreateloadRoles() {
    try {
        const istek = await fetch("http://localhost:1000/Role/GetRoles");
        const roles = await istek.json();
        if (!istek.ok) throw new Error(roles.Message);

        const select = document.getElementById("cmbRole");
        select.innerHTML = "";
        roles.forEach(role => {
            const option = document.createElement("option");
            option.value = role.id;
            option.text = role.roleName;
            select.appendChild(option);
        });
    } catch (err) {
        alert(err.message);
    }
}

// Kullanıcı tablosunu doldur
function fillTable(data) {
    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";
    data.forEach(user => {
        const tr = document.createElement("tr");
        tr.dataset.userId = user.id;
        tr.innerHTML = `
            <td>${user.userName}</td>
            <td>${user.roleName}</td>
            <td>${user.email}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Roller tablosunu yükle
async function loadRoles() {
    try {
        const istek = await fetch("http://localhost:1000/Role/GetRoles");
        const data = await istek.json();
        if (!istek.ok) throw new Error(await istek.text());
        fillRoleTable(data);
        console.log(data);
    } catch (err) {
        alert(err.message);
    }
}

// Roller tablosunu doldur
function fillRoleTable(data) {
    const tbody = document.querySelector("#roleTable tbody");
    tbody.innerHTML = "";
    data.forEach(role => {
        const tr = document.createElement("tr");
        tr.dataset.id = role.id;
        tr.innerHTML = `
            <td>${role.id}</td>
            <td>${role.roleName}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Kullanıcı seçimi
let selectedUserId = null;
document.querySelector("#userTable tbody").addEventListener("click", e => {
    const tr = e.target.closest("tr");
    if (!tr) return;

    document.querySelectorAll("#userTable tbody tr").forEach(r => r.style.background = "");
    tr.style.background = "#ddd";
    selectedUserId = tr.dataset.userId;

    getUserAsync();
});

// Kullanıcı soft delete
document.getElementById("btnSoftDelete").addEventListener("click", () => {
    if (!selectedUserId) return alert("Kullanıcı seçiniz");
    document.getElementById("confirmModal").style.display = "block";
});

document.getElementById("btnNo").addEventListener("click", () => {
    document.getElementById("confirmModal").style.display = "none";
});

document.getElementById("btnYes").addEventListener("click", async () => {
    await softDeleteUser();
    document.getElementById("confirmModal").style.display = "none";
    loadUsers(!document.getElementById("chkPasif").checked);
});

async function softDeleteUser() {
    try {
        const res = await fetch(`http://localhost:1000/api/users/softdelete?id=${selectedUserId}`, {
            method: "PATCH"
        });
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.Message);
        }
    } catch (err) {
        alert(err.message);
    }
}

// Kullanıcı modal açma/kapatma
document.getElementById("btnOpenModal").addEventListener("click", () => {
    document.getElementById("userModal").style.display = "block";
});
document.getElementById("btnClose").addEventListener("click", () => {
    document.getElementById("userModal").style.display = "none";
});

// Kullanıcı ekleme
async function UserSaveAsync() {
    try {
        const IuserName = document.getElementById("txtUserName").value;
        const Iemail = document.getElementById("txtEmail").value;
        const Ipassword = document.getElementById("txtPassword").value;
        const IroleId = Number(document.getElementById("cmbRole").value);

        const istek = await fetch("http://localhost:1000/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName: IuserName,
                email: Iemail,
                password: Ipassword,
                roleId: IroleId
            })
        });

        if (!istek.ok) {
            const data = await istek.json();
            throw new Error(data.Message || "Beklenmedik hata oluştu");
        }
        alert("Kullanıcı kayıt edildi");
    } catch (err) {
        alert(err.message);
    }
}

document.getElementById("btnSave").addEventListener("click", UserSaveAsync);

// Kullanıcı güncelleme modal
document.getElementById("btnUpdateOpenModal").addEventListener("click", () => {
    document.getElementById("userUpdateModal").style.display = "block";
    getUserAsync();
});
document.getElementById("UpdatebtnClose").addEventListener("click", () => {
    document.getElementById("userUpdateModal").style.display = "none";
});

// Kullanıcıyı seçip verileri doldur
async function getUserAsync() {
    if (!selectedUserId) {
        alert("Önce bir kullanıcı seçin");
        document.getElementById("userUpdateModal").style.display = "none";
        return;
    }
    const res = await fetch(`http://localhost:1000/api/users/getUserById?id=${selectedUserId}`);
    if (!res.ok) throw new Error(await res.text());
    const user = await res.json();
    
    document.getElementById("UpdatetxtUserName").value = user.userName;
    document.getElementById("UpdatetxtEmail").value = user.email;
    document.getElementById("UpdatetxtPassword").value = user.password;
    document.getElementById("UpdatecmbRole").value = user.roleId;
}

// Kullanıcı güncelle
async function userUpdateAsync() {
    if (!selectedUserId) return alert("Kullanıcı seçiniz");

    const IuserName = document.getElementById("UpdatetxtUserName").value;
    const Iemail = document.getElementById("UpdatetxtEmail").value;
    const Ipassword = document.getElementById("UpdatetxtPassword").value;
    const IroleId = Number(document.getElementById("UpdatecmbRole").value);

    try {
        const istek = await fetch(`http://localhost:1000/api/users/updateUser?id=${selectedUserId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName: IuserName,
                email: Iemail,
                password: Ipassword,
                roleId: IroleId
            })
        });
        if (!istek.ok) throw new Error(await istek.text());
    } catch (err) {
        alert(err.message);
    }
    loadUsers();
    document.getElementById("userUpdateModal").style.display = "none";
}

document.getElementById("UpdatebtnSave").addEventListener("click", userUpdateAsync);

// Role seçimi
let roleId = null;
document.querySelector("#roleTable tbody").addEventListener("click", e => {
    const tr = e.target.closest("tr");
    if (!tr) return;
    roleId = tr.dataset.id;
    console.log(roleId);
});

// Rol sil
async function deleteRole() {
    try {
        if (!roleId) return alert("Role seçiniz");

        const istek = await fetch(`http://localhost:1000/Role?id=${roleId}`, { method: "DELETE" });
        if (!istek.ok) {
            const data = await istek.json();
            throw new Error(data.Message);
        }
        alert("Rol silindi");
        await loadRoles();
    } catch (err) {
        alert("Hata: " + err.message);
    }
}
document.getElementById("RoleDelete").addEventListener("click", deleteRole);

// Rol güncelle modal
document.getElementById("RoleUpdate").addEventListener("click", () => {
    if (!roleId) return alert("rol seçiniz");
    document.getElementById("rolModal").style.display = "block";
});
document.getElementById("rolbtnClose").addEventListener("click", () => {
    document.getElementById("rolModal").style.display = "none";
});
document.getElementById("rolbtnSave").addEventListener("click", () => {
    rolGuncelleAsync();
    document.getElementById("rolModal").style.display = "none";
});

// Rol güncelle işlemi
async function rolGuncelleAsync() {
    try {
        const roleText = document.getElementById("txtRoleName").value;
        if (!roleText) return alert("Yeni rol ismi giriniz");

        const istek = await fetch(`http://localhost:1000/Role/${roleId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roleName: roleText })
        });
        if (!istek.ok) {
            const data = await istek.json();
            throw new Error(data.Message);
        }
        alert("Rol güncellendi");
        await loadRoles();
    } catch (err) {
        alert(err.message);
    }
}

// Yeni rol ekleme modal
document.querySelector("#RoleInsert").addEventListener("click", () => {
    document.getElementById("InsertrolModal").style.display = "block";
});
document.querySelector("#InsertrolbtnClose").addEventListener("click", () => {
    document.getElementById("InsertrolModal").style.display = "none";
});
document.querySelector("#InsertrolbtnSave").addEventListener("click", () => {
    RoleInsertAsync();
});

// Yeni rol ekleme işlemi
async function RoleInsertAsync() {
    try {
        const roleText = document.getElementById("InserttxtRoleName").value;
        if (!roleText) return alert("Yeni rol ismi giriniz");

        const istek = await fetch("http://localhost:1000/Role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ roleName: roleText })
        });
        if (!istek.ok) {
            const data = await istek.json();
            throw new Error(data.Message);
        }
        alert("Rol Eklendi");
        await loadRoles();
    } catch (err) {
        alert(err.message);
    }
}