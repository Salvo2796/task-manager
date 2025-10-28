const { deleteTask } = require("../service/task.service");

const btnRegister = document.getElementById("btn-register");

btnRegister.addEventListener("click", async () => {
    const email = document.getElementById("email-register").value.trim();
    const password = document.getElementById("password-register").value.trim();
    const nome = document.getElementById("nome-register").value.trim();

    if (!email || !password) {
        return alert("Email e Password obbligatorie!")
    }
    try {
        const res = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, nome })
        });

        if (res.status === 201) {
            alert("Registazione avvenuta");
        } else {
            const err = await res.json().catch(() => ({ message: res.statusText }));
            alert('Errore registrazione: ' + (err.message || JSON.stringify(err)));
        }
    } catch (e) {
        alert("Errore di connessione" + e.message);
    }

});

const btnLogin = document.getElementById("btn-login");

btnLogin.addEventListener("click", async () => {
    const email = document.getElementById("email-login").value.trim();
    const password = document.getElementById("password-login").value.trim();

    if (!email || !password) {
        return alert("Email e Password obbligatorie!");
    }

    try {
        const res = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            const token = data.token;
            saveToken(token);
            alert(`Bentornato: ${data.email}`);
        } else {
            alert(`Errore di login: ${data.message || "Credenziali non valide"}`);
        }

    } catch (e) {
        alert("Errore di connessione: " + e.message);
    }
});


function saveToken(token) {
    localStorage.setItem("token", token);
}

function loadToken() {
    return localStorage.getItem("token")
}

const btnCreateTask = document.getElementById("btn-createTask");
const taskDiv = document.getElementById("task");

btnCreateTask.addEventListener("click", async () => {
    const title = document.getElementById("titolo.create").value.trim();
    const description = document.getElementById("descrizione-create").value.trim();
    const completed = document.getElementById("completato-create").checked;

    if (!title) { return alert("Titolo obbligatorio") };

    try {
        const token = loadToken();

        const res = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, completed })
        });

        if (res.status === 201) {
            alert("Task creato");

        } else {
            const err = await res.json().catch(() => ({ message: res.statusText }));
            showToast('Errore creazione: ' + (err.message || JSON.stringify(err)));
        }
    } catch (e) {
        alert("Errore: " + e.message)
    }
});

async function loadTask() {
    try {
        const token = loadToken();

        const res = await fetch("http://localhost:3000/tasks", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            const data = await res.json();
            renderTask(data.task);
        } else {
            let err;
            try {
                err = await res.json();
            } catch {
                err = { message: res.statusText };
            }
            alert('Errore caricamento: ' + (err.message || JSON.stringify(err)));
        }

    } catch (e) {
        alert("Errore: " + e.message)
    }
}

const btnRender = document.getElementById("mostra");

btnRender.addEventListener("click", async () => {
    const tasks = await loadTask();
    renderTask(tasks);
});

function renderTask(tasks) {
    const container = document.getElementById("task");
    container.innerHTML = "";
    tasks.forEach(t => {
        const ul = document.createElement("ul");

        const liTitle = document.createElement("li");
        liTitle.textContent = `Titolo: ${t.title}`;
        ul.appendChild(liTitle);

        const liDescription = document.createElement("li");
        liDescription.textContent = `Descrizione: ${t.description || "-"}`;
        ul.appendChild(liDescription);

        const liCompleted = document.createElement("li");
        liCompleted.textContent = `Completato: ${t.completed}`;
        ul.appendChild(liCompleted);

        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Elimina";

        const btnEdit = document.createElement("button");
        btnEdit.textContent= "Edit";
        


        ul.appendChild(btnDelete);
        ul.appendChild(btnEdit);
        container.appendChild(ul);


        btnDelete.addEventListener("click", async () => {
            deleteTask(t._id)
        })

        btnEdit.addEventListener("click", async () => {
            renderFormUpdate(t);
        })
    });


}

async function deleteTask(id) {
    try {
        const token = loadToken();
        const res = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.ok) {
            alert("Task Eliminata");
            loadTask();
        } else {
            const err = await res.json().catch(() => ({ message: res.statusText }));
            showToast('Errore creazione: ' + (err.message || JSON.stringify(err)));
        }
    } catch (e) {
        alert("Errore: " + e.message)
    }
}

function renderFormUpdate(t) {
    document.getElementById("div-update").style.display = "block";
      document.getElementById("id_task").value = t._id;
      document.getElementById("title-update").value = t.title;
      document.getElementById("description-update").value = t.description || "";
      document.getElementById("completed-update").value = t.completed;
}

// 🔹 Funzione che invia la richiesta PATCH
async function updateTask(id, updatedTask) {
  try {
    const token = loadToken();

    const res = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedTask)
    });

    if (res.ok) {
      alert("✅ Task aggiornata con successo!");
    } else {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      alert("❌ Errore aggiornamento: " + (err.message || JSON.stringify(err)));
    }

  } catch (e) {
    alert("⚠️ Errore di rete: " + e.message);
  }
}


// 🔹 Listener del pulsante che raccoglie i dati e chiama la funzione sopra
const btnUpdate = document.getElementById("btn-update");

btnUpdate.addEventListener("click", async () => {
  const id = document.getElementById("id_task").value.trim();
  const title = document.getElementById("title-update").value.trim();
  const description = document.getElementById("description-update").value.trim();
  const completed = document.getElementById("completed-update").value === "true";

  const updatedTask = { title, description, completed };

  await updateTask(id, updatedTask);

  document.getElementById("div-update").style.display = "none";
  loadTask(); // 🔄 Ricarica la lista dei task aggiornati
});









