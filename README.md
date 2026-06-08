# Tamaya

> 온디바이스 우선(on-device-first) 대화형 AI 다이어리 — 감정 웰빙과 외로움 완화를 위한 서비스

**Tamaya**는 "이음:me" (project `liv-zz`)의 MVP 서비스입니다. 사용자와의 자연스러운 대화를 통해 하루의 감정을 기록하는 conversational AI diary로, beachhead로 한국의 20–30대 여성을 타깃합니다. 감정 웰빙과 외로움 완화(loneliness mitigation)를 핵심 가치로 삼아, 부담 없는 대화 흐름 속에서 감정을 정리하고 회고할 수 있도록 돕습니다.

이 저장소는 **monorepo**로, FastAPI 기반의 clean-architecture backend와 Vite/React (TypeScript) v3 frontend로 구성됩니다. Backend는 Naver CLOVA(OpenAI 호환 endpoint)를 통한 AI 대화와 pgvector 기반 embedding을 제공하며, frontend는 custom router와 phone-shell 위에서 동작하는 v3 wireframe/preview 앱입니다 (2026-06-06 P0 completeness/responsiveness 패치 반영).

---

## 기술 스택 (Tech Stack)

### Backend
- **Language**: Python 3.13+
- **Framework**: FastAPI (`AI Diary`, v0.1.0)
- **Server**: Uvicorn
- **DB**: PostgreSQL 16 (`pgvector/pgvector:pg16`), async driver `asyncpg`
- **ORM / Migration**: SQLAlchemy 2.x (async) + Alembic
- **AI**: Naver CLOVA via OpenAI-compatible endpoint (`openai` SDK, model `HCX-005`), LangGraph
- **Embedding**: `sentence-transformers` + pgvector (1024-dim)
- **Auth**: Kakao OAuth (`httpx`) + JWT (`python-jose`)
- **Dependency Manager**: [uv](https://github.com/astral-sh/uv)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript 5 (target ES2020)
- **Routing/State**: custom hash router + localStorage-backed reducer store (no backend, localStorage-only PoC)
- **Styling**: plain CSS (design tokens + responsive reflow)
- **Figma Interop**: `@figma/code-connect` (Code Connect config 준비, mapping 파일은 아직 없음)
- **Package Manager**: [pnpm](https://pnpm.io) (npm/yarn도 동작)

---

## 디렉터리 구조 (Directory Structure)

```
liv-zz-poc/
├── docker-compose.yml          # Postgres (pgvector) service
├── Makefile                    # be / fe / up / down / migrate ... targets
├── backend/
│   ├── pyproject.toml          # deps (managed by uv) · uv.lock
│   ├── alembic.ini
│   ├── alembic/                # migrations (env.py is async)
│   │   └── versions/           # 6 revisions
│   ├── docker-compose.yml      # (별도) db service
│   ├── scripts/
│   │   └── ingest_health_data.py
│   └── app/
│       ├── main.py             # FastAPI app (app.main:app)
│       ├── domain/             # model/ (entities, VOs) + repository/ (interfaces)
│       ├── application/        # usecase/ + service/
│       ├── infrastructure/     # persistence/ · external/ · config/ · auth/ · middleware/
│       └── presentation/       # router/ (auth, chat, diary, game, health_chat) + schemas
└── frontend/
    ├── package.json            # tamaya-frontend v1.0.0
    ├── vite.config.ts
    ├── figma.config.json
    ├── index.html
    └── src/
        ├── main.tsx · App.tsx
        ├── screens/            # cover, login, onboarding, home-day, evening, records, character, settings
        ├── lib/                # router.ts · store.tsx
        ├── components/         # AppShell · DesignCanvas · TweaksPanel · primitives
        └── styles/             # tokens.css · responsive.css · sketch.css
```

Backend는 **Clean Architecture + DDD (4 layers)**를 따릅니다. 의존성 방향:
`presentation → application → domain ← infrastructure`.

---

## 시작하기 (Getting Started)

### Prerequisites
- **Python 3.13+**
- **uv** (backend dependency manager)
- **Node.js 18+** (dev-verified on Node 22)
- **pnpm** (권장; npm/yarn도 가능)
- **Docker** (PostgreSQL 실행용)

### Backend 실행

```bash
# 1. Postgres (pgvector) 기동
make up                         # = docker compose up -d postgres

# 2. 의존성 설치 (backend/ 에서)
cd backend
uv sync

# 3. 마이그레이션 적용
make migrate                    # = cd backend && alembic upgrade head

# 4. API 서버 실행 (port 8000)
make be                         # = cd backend && uvicorn app.main:app --reload --port 8000
# 또는
uv run uvicorn app.main:app --reload
```

- Health check: `GET /health` → `{"status": "ok"}`
- CORS allow-origins: `http://localhost:3000`, `:5173`, `:19006`
- `CLOVA_MOCK_MODE`가 기본 `true`이므로 실제 CLOVA API key 없이도 구동됩니다.

Postgres 관련 Makefile target:

```bash
make up      # docker compose up -d postgres
make down    # stop
make clean   # docker compose down -v  (데이터 전체 삭제 주의)
```

### Frontend 실행

```bash
cd frontend
pnpm install
pnpm dev                        # Vite dev server, port 5173
```

- App preview: `http://localhost:5173/` (375×812 phone shell)
- Wireframe canvas: `http://localhost:5173/#design`

기타 scripts:

```bash
pnpm build      # tsc -b && vite build  (typecheck 포함)
pnpm preview    # 빌드 결과 미리보기
```

---

## 환경 변수 (Environment Variables)

Backend 환경 변수는 `backend/.env.example`를 복사해 `backend/.env`로 설정합니다 (`.env`는 git-ignored). 모든 값에 default가 있어 런타임에서는 모두 optional입니다. 변수명 목록:

- `DATABASE_URL`
- `CLOVA_API_KEY`
- `CLOVA_BASE_URL`
- `CLOVA_MODEL`
- `CLOVA_MOCK_MODE`
- `KAKAO_APP_KEY`
- `JWT_SECRET`

> Frontend는 backend-free localStorage-only PoC로, `.env`/API key가 필요 없습니다.

---

## DB / 마이그레이션 (Migrations)

스키마는 Alembic migration이 유일한 관리 수단입니다 (`main.py`에서 `create_all` 제거됨, B-004). `alembic/env.py`는 async로 동작하며 `sqlalchemy.url`을 `settings.database_url`에서 동적으로 주입합니다.

```bash
make migrate                    # cd backend && alembic upgrade head
```

- Config: `backend/alembic.ini` (`script_location = %(here)s/alembic`)
- Schema source of truth: `app.infrastructure.persistence.models.Base.metadata`
- 현재 `alembic/versions/`에 6개 revision 존재.

---

## 라이선스 (License)

Proprietary — All Rights Reserved. 자세한 내용은 [LICENSE](./LICENSE) 참조.
