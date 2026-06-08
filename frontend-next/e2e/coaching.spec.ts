import { expect, test } from "@playwright/test";

// frontend-next ↔ FastAPI(mock) 실연동 e2e. 코칭 경로는 DB-free(정성신호 mock→None).

test("온보딩: 페르소나 + CLOVA 키 설정 렌더", async ({ page }) => {
  await page.goto("/onboarding");
  await expect(page.getByText("어떤 톤으로")).toBeVisible();
  await expect(page.getByText("부모님 톤")).toBeVisible();
  await expect(page.getByText("CLOVA 키 연결")).toBeVisible();
});

test("코칭: 안전 입력에 코칭 응답이 도착한다", async ({ page }) => {
  await page.goto("/coach");
  // 초기 인사(assistant) 1건
  await expect(page.locator('[data-role="assistant"]')).toHaveCount(1);

  await page.getByPlaceholder("마음을 편하게 적어보세요…").fill("오늘 너무 지쳤어");
  await page.getByRole("button", { name: "전송" }).click();

  // 사용자 말풍선 표시
  await expect(page.locator('[data-role="user"]')).toHaveText(["오늘 너무 지쳤어"]);
  // 백엔드 코칭 응답이 도착해 assistant 말풍선이 2건이 된다
  await expect(page.locator('[data-role="assistant"]')).toHaveCount(2, { timeout: 15_000 });
  // 실연동 확인: 에러 폴백이 아닌 실제 코칭 응답이어야 함
  await expect(page.locator('[data-role="assistant"]').last()).not.toContainText("서버 연결");
});

test("코칭: 위험 입력은 의료 면책으로 응답한다(가드레일 e2e)", async ({ page }) => {
  await page.goto("/coach");
  // 하이드레이션 완료 대기(초기 인사 렌더) 후 상호작용
  await expect(page.locator('[data-role="assistant"]')).toHaveCount(1);

  await page.getByPlaceholder("마음을 편하게 적어보세요…").fill("이 약 먹어도 돼?");
  await page.getByRole("button", { name: "전송" }).click();

  // 응답 도착 후, 마지막 코치 말풍선에 결정론 면책(전문가 상담 안내)이 담긴다
  await expect(page.locator('[data-role="assistant"]')).toHaveCount(2, { timeout: 15_000 });
  await expect(page.locator('[data-role="assistant"]').last()).toContainText("전문가");
});
