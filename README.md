# School Management API (Node.js + Express + MySQL)

APIs to add schools and list them sorted by proximity to the user's location.

## Endpoints

### POST `/addSchool`
Add a new school.

**Body (JSON):**
```json
{ "name": "Greenfield High", "address": "12 Park St", "latitude": 19.076, "longitude": 72.8777 }
```

**Responses:**
- `201 Created` with the inserted school
- `400 Bad Request` on validation errors

### GET `/listSchools?lat=<lat>&lng=<lng>`
List all schools sorted by distance from the provided coordinates (Haversine, kilometers).

**Example:**
```
/listSchools?lat=19.0760&lng=72.8777
```

**Responses:**
- `200 OK` with array of schools including `distance_km`
- `400 Bad Request` on validation errors

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create and fill `.env` (see `.env.example`).
3. Create DB and table:
   ```bash
   mysql -u root -p < schema.sql
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

## Deployment (Render/Railway)

- **Render**: Create a Web Service, connect your repo, set Build Command `npm install`, Start Command `npm start`, and environment variables for DB.
- **Railway**: Provision a MySQL plugin, connect service, and set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in variables.

> For serverless (e.g., Vercel), prefer a managed MySQL with pooled connections or a traditional host due to connection persistence requirements.

## Notes
- Uses prepared statements to avoid SQL injection.
- Validates inputs with `Joi`.
- Calculates distances in SQL for efficient sorting.
