import { defineConfig, devices } from "@playwright/test";

// e2e는 127.0.0.1로 고정해 localhost→IPv6(::1) 해석 불일치를 피한다.
const BASE_URL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // 로컬 실행 편의: Next 서버를 자동 기동(이미 떠 있으면 재사용). 백엔드는 별도 기동 필요.
  webServer: {
    command: "pnpm start",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
