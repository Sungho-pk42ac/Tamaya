# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**Tamaya** — 온디바이스 우선(on-device-first) 대화형 AI 다이어리. 자연스러운 대화로 하루의 감정을 기록해
감정 웰빙·외로움 완화를 돕는다. beachhead 타깃은 한국 20–30대 여성. `liv-zz` 프로젝트의 MVP.

**monorepo** 구조: FastAPI 기반 clean-architecture `backend/` + Vite/React(TypeScript) v3 `frontend/`.

## 명령어

```bash
# 인프라 (Postgres/pgvector, Docker)
make up            # postgres 컨테이너 기동
make down          # 중지   /   make clean: 데이터까지 초기화
make migrate       # cd backend && alembic upgrade head  (스키마 변경의 유일한 경로)

# Backend (port 8000, backend/)
uv sync                                   # 의존성 설치
make be                                   # = uvicorn app.main:app --reload --port 8000
uv run alembic revision --autogenerate -m "msg"   # 마이그레이션 생성

# Frontend (port 5173, frontend/ — pnpm 권장)
pnpm install
pnpm dev           # Vite dev server (http://localhost:5173/, #design 으로 wireframe 캔버스)
pnpm build         # tsc -b && vite build (타입체크 포함)

# Lint / Format (커밋 시 husky pre-commit이 변경 파일에 자동 적용)
pnpm --dir frontend lint      # eslint .   (lint:fix, format 도 있음)
uv run --directory backend ruff check .   # ruff format . 으로 포맷
```

> **테스트 스위트는 아직 없다** (Makefile에 test 타깃 없음, `app/` 내 test 파일 없음). 테스트 도입 시 이 항목을 갱신할 것.

## 아키텍처 — 큰 그림

### Backend: Clean Architecture + DDD (4 레이어)
의존성 방향은 항상 안쪽(domain)을 향한다: `presentation → application → domain ← infrastructure`.
- `domain/` — 외부 의존성 0, 순수 Python. SQLAlchemy 등 프레임워크 import 금지.
- `application/` — usecase(오케스트레이션) + service. domain 모델·repository 인터페이스만 의존.
- `infrastructure/` — domain 인터페이스의 구체 구현: `persistence/`(SQLAlchemy), `external/`(CLOVA 등), `auth/`, `middleware/`.
- `presentation/router/` — FastAPI 라우터 5종: `auth · chat · diary · game · health_chat`.
- 레이어별 상세 규칙은 `backend/CLAUDE.md` 참조.

**핵심 불변식:**
- **스키마는 Alembic migration이 유일한 관리 수단.** `main.py`에서 `create_all` 제거됨 — 모델만 바꾸지 말고 항상 마이그레이션을 생성/적용.
- **CLOVA는 기본 mock 모드** (`CLOVA_MOCK_MODE=true`). 실제 API key 없이 구동되므로, AI 응답 동작을 보려면 이 플래그를 확인.
- AI 대화/요약은 Naver CLOVA(OpenAI 호환 endpoint, `HCX-005`), embedding은 pgvector(1024-dim).

### Frontend: 백엔드 미연동 PoC (중요)
**frontend는 backend와 통신하지 않는다.** custom hash router + localStorage 기반 reducer store로 동작하는
v3 wireframe/preview 앱이다 (`.env`·API key 불필요). `src/screens/`의 22개 화면이 `AppShell`(375×812 phone shell) 위에서 렌더되고,
`#design` 경로의 `DesignCanvas`로 전체 화면을 한눈에 본다. API 연동은 아직 구현 전 — backend 엔드포인트를 호출하는 코드를 찾지 말 것.

## 컨벤션 / 주의사항

- **Lint 규약** (도입 시 의도적 결정):
  - frontend는 **ESLint 9 flat config**(`eslint.config.js`) — ESLint 10은 react 플러그인 비호환이라 9 고정. `react/no-unescaped-entities`는 한국어 UI 때문에 off.
  - backend ruff는 `B008`(FastAPI `Depends` false positive) ignore. `B904`/`B905`는 점진 활성화 예정으로 보류 중 — 활성화하려면 `backend/pyproject.toml`에서 빼고 기존 위반을 정리.
  - React hook은 반드시 early-return 앞에서 호출 (`rules-of-hooks`는 error).
- **코드 스타일**: backend는 type hint 필수, snake_case(변수/함수)·PascalCase(클래스). frontend는 camelCase, 주석은 한국어.
- **Secrets·`.env`는 git-ignored**, 모든 env 값에 default가 있어 런타임에서 optional.
- **로컬 개발**: FastAPI만 직접 실행하고 DB 등 외부 서비스는 Docker Compose로 띄운다.
- 라이선스: Proprietary — All Rights Reserved.
