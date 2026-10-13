# Backend Spring Boot

Backend em Spring Boot para salvar o roteiro e enviar avisos em tempo real para o site.

## Rodar

```bash
npm run backend:dev
```

API local: `http://localhost:7080`

## Configurar `.env`

Crie um arquivo `.env` na raiz do projeto copiando `.env.example`.

```properties
VITE_API_URL=http://localhost:7080
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

O frontend usa `VITE_API_URL` como endpoint base da API. O backend le o mesmo `.env`
para liberar as origens em `APP_CORS_ALLOWED_ORIGINS`.

## Endpoints

- `GET /api/route`: lista data e cards.
- `PUT /api/route`: atualiza a data. Body: `{ "birthdayDate": "2026-10-09" }`.
- `POST /api/route/reset`: restaura roteiro inicial.
- `POST /api/cards`: cria card.
- `DELETE /api/cards/{id}`: remove card.
- `GET /api/notifications`: canal SSE para avisos em tempo real.

Os dados ficam salvos em `backend/data/roteiro.json`.
