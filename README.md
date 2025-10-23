# Task Manager API

API per gestire task con autenticazione, CRUD e upload immagini.

---

## 🚀 Avvio del progetto

1. Installa le dipendenze:

```bash
npm install
```

2. Crea il file `.env` in root con queste variabili:

```
PORT=3000
MONGO_URI=<URI_MONGODB>
JWT_SECRET=<secret>
JWT_EXPIRES_IN=1h
```

3. Avvia il server in sviluppo:

```bash
npm run dev
```

Il server sarà disponibile su `http://localhost:3000`.

---

## 🛠 Rotte principali

### Auth

| Metodo | Endpoint        | Body                                | Descrizione                     |
|--------|----------------|------------------------------------|--------------------------------|
| POST   | /auth/register | `{ email, password, nome }`        | Registra un nuovo utente        |
| POST   | /auth/login    | `{ email, password }`              | Login e ricezione token JWT     |

### Tasks

> Tutte le rotte tasks richiedono il token JWT nell’header:  
> `Authorization: Bearer <TOKEN>`

| Metodo | Endpoint               | Body                                    | Descrizione                         |
|--------|-----------------------|----------------------------------------|------------------------------------|
| POST   | /tasks                | `{ title, description?, completed? }`  | Crea un nuovo task                  |
| GET    | /tasks                | —                                      | Lista dei task dell’utente          |
| PATCH  | /tasks/:id            | `{ title?, description?, completed? }` | Aggiorna un task                     |
| DELETE | /tasks/:id            | —                                      | Elimina un task                      |
| POST   | /tasks/:id/upload     | `multipart/form-data { file }`         | Carica un’immagine per il task      |

### File uploads

- I file vengono salvati nella cartella `/uploads`
- L’endpoint `/uploads/<filename>` è pubblico per il laboratorio.

---

## 📄 Esempio chiamata con Postman

**Login:**

```
POST http://localhost:3000/auth/login
Body JSON:
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Crea task:**

```
POST http://localhost:3000/tasks
Headers:
Authorization: Bearer <TOKEN>
Body JSON:
{
  "title": "Nuovo Task",
  "description": "Descrizione opzionale"
}
```

**Upload immagine:**

```
POST http://localhost:3000/tasks/<taskId>/upload
Headers:
Authorization: Bearer <TOKEN>
Body form-data:
key=file, value=<seleziona file immagine>
```

---

## 📝 Note

- Protezione CORS e rate-limit abilitata.
- Helmet per sicurezza degli header.
- Logging con Morgan/Winston incluso.
- Swagger disponibile in `docs/openapi.yaml`.

