# Verification — Tamanya Medlife (건강냥 비서)

> G005 검증 산출물. 별도 검증 레인(per-issue TDD + code-review + security-review + 디자인 visual-QA)의
> 누적 증거와 Acceptance Criteria 추적을 한곳에 정리한다. 생성: 2026-06-08, main `7bc274c` 기준.

## 1. 통합 검증 스냅샷

| 항목 | 명령 | 결과 |
|---|---|---|
| 백엔드 테스트 | `uv run pytest -q` (backend) | **83 passed** |
| 백엔드 린트 | `uv run ruff check .` | All checks passed |
| 백엔드 컴파일 | `uv run python -m compileall app` | OK |
| 마이그레이션 체인 | `uv run alembic heads` | 단일 head `a7b8c9d0e1f2` (분기 없음) |
| frontend-next 빌드 | `pnpm --dir frontend-next build` | 성공 — 7 라우트, tsc+eslint clean |
| Vite PoC 빌드(회귀) | `pnpm --dir frontend build` | 성공 (회귀 없음) |
| 백엔드 부팅 | `python -m uvicorn app.main:app` | 8000 listen, Swagger UI 정상, 8개 라우터 등록 |

### 테스트 인벤토리 (83건)

| 레이어 | 파일 | 건수 |
|---|---|---|
| domain | test_medical_guardrail.py | 5 |
| domain | test_coaching_session.py | 6 |
| domain | test_wellbeing_score.py | 5 |
| domain | test_clova_credential.py | 9 |
| domain | test_insight_period.py | 10 |
| application | test_coaching_agent.py | 3 |
| application | test_extract_signals.py | 4 |
| application | test_get_insight.py | 4 |
| application | test_send_coaching_message.py | 5 |
| infrastructure | test_signal_extraction_clova.py | 8 |
| infrastructure | test_byok_client.py | 4 |
| infrastructure | test_clova_connection_tester.py | 2 |
| infrastructure | test_coaching_clova.py | 3 |
| presentation | test_coaching_router.py | 3 |
| presentation | test_insight_router.py | 6 |
| presentation | test_settings_router.py | 6 |

## 2. 라이브 End-to-End 검증 (mock 모드, 실행 서버)

`python -m uvicorn`로 백엔드를 띄우고 same-origin fetch로 코칭 경로를 직접 호출:

- **안전 입력** `"오늘 너무 지쳤어"` → 코칭 응답 `"오늘 하루도 버텨줘서 고마워요. 지금 마음은 좀 어때요?"`
- **위험 입력** `"이 약 먹어도 돼?"` → 결정론 면책 `"나는 건강을 함께 돌보는 친구지, 의료 전문가는 아니야. … 전문가와 상담해줘."`

→ guardrail-first 단락이 **라이브 HTTP 경로에서 동작**함을 확인(단위테스트 외 증거).

## 3. 디자인 visual-QA (geongangnyang-ui.html 기준)

`next dev` 실행 후 3개 화면 스크린샷 — 흙빛 톤·건강냥 마스코트·Pretendard/Gowun Batang/Gaegu·Day/Night 모드가 레퍼런스와 일치함을 확인.

| 화면 | 모드 | 확인 |
|---|---|---|
| /onboarding | Day(cream/coffee) | 페르소나 4종 카드(선택 terracotta), CLOVA 키 입력+연결테스트/저장, 마스코트 ✓ |
| /coach | Night(espresso/amber) | 달·별, 졸린 마스코트, cat/me 말풍선, amber 입력바, "🌙 나이트 모드" ✓ |
| /insights | Day | "이번 주 흐름이에요", ISO 주차 자동 계산(2026-W24), 백엔드 미연결 시 graceful 안내 ✓ |

> 참고: 로컬 환경은 `localhost`가 IPv6(`::1`)로 해석되고 uvicorn은 IPv4 바인딩이라 브라우저 직결은
> graceful 에러로 표시된다(앱 정상 동작 검증). 풀 라이브 데이터 경로 e2e(Playwright + Postgres 서비스)는
> **G006 CI**에서 자동화한다.

## 4. Acceptance Criteria 추적 (plan §2)

| AC | 내용 | 상태 | 증거 |
|---|---|---|---|
| AC-3 | 의료 면책 가드레일(위험 입력 100% 단락, 진단/용량 토큰 0) | ✅ 검증 | `medical_guardrail` 5건 + tripwire + 라이브 면책 확인. 정식 ≥10 curated 회귀 스위트는 G006 CI 하드게이트 |
| AC-4 | 정성신호(emotion+behavior_mentions) 추출·영속 | ✅ 검증 | `extract_signals`(4) + `signal_extraction_clova`(8) + 모델/마이그레이션 |
| AC-5 | 주/월 인사이트 엔드포인트, 빈 기간 well-formed 200 | ✅ 검증 | `get_insight`(4) + `insight_router`(6, 빈기간·400 포함) |
| AC-6 | 주2 > 주1 결정론 스코어 | ✅ 검증 | `wellbeing_score`(5, 순수 함수) |
| AC-8 | 신규 도메인 격리 + CLOVA/pgvector 재사용(복붙 없음) | ✅ 검증 | coaching/insight/byok 신규 파일, ClovaClient/agent 패턴 재사용 |
| AC-1 | 페르소나 톤 선택·반영 | 🟡 부분 | 온보딩 선택(로컬) + 코칭 reply에 persona 주입(검증). 전용 `GET/PUT /persona` 엔드포인트는 미구현(로드맵) |
| AC-2 | 루틴 제안 1건 + RoutineSuggestion 기록 | 🟡 부분 | `RoutineSuggestion` 도메인 존재(G001-2), 코칭 응답에 넛지 포함. 명시적 레코드 영속은 로드맵 |
| AC-7 | Next.js FastAPI 실연동 e2e + reload 지속 | 🟡 부분 | 3화면 실연동(G004), 코칭 history localStorage 지속. 풀 Playwright e2e는 **G006** |

## 5. 안전·프라이버시·BYOK 검증

- **가드레일/면책 결정론**: `medical_guardrail.py`는 LLM 비의존 키워드 분류 + 고정 면책 문구. 라이브에서 위험 입력이 coach 미도달 확인. coach 응답 처방성 토큰은 post-generation tripwire가 치환.
- **PII/건강데이터**: 정성신호는 파생 태그(emotion enum + 짧은 behavior 키워드 + polarity)만 저장, 원문 의료 주장 미저장. best-effort 로그는 예외 타입만 기록(대화 내용 미노출).
- **BYOK 키**: 원문 키는 요청 헤더/본문으로만 존재, 응답·저장소·로그에 평문 미노출(마스킹 ••••last4). mock fallback 시 자격 미적재(최소권한). env(settings) 불변.

## 6. 코드리뷰/시큐리티리뷰 레인 (per-PR)

각 PR은 작성과 분리된 리뷰 패스를 거쳤고 지적은 반영 후 머지:
- bool-polarity 둔갑 + commit 실패 rollback (PR #11)
- W53 미존재 주차 500→400 (PR #13)
- mock fallback 최소권한 + 공백 env 정규화 (PR #15)
- migration index drift + updated_at onupdate (PR #17)
- guardrail fail-closed 기본값 + persona end-to-end + 로그 누출 차단 (PR #19)
