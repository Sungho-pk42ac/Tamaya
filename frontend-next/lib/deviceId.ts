// 익명 device_id — User 테이블이 없으므로 클라이언트가 localStorage에 보관한다.
const KEY = "tamaya.deviceId";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = `dev-${crypto.randomUUID()}`;
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

const PERSONA_KEY = "tamaya.persona";

export function getPersona(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(PERSONA_KEY);
}

export function setPersona(persona: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PERSONA_KEY, persona);
}

const USER_KEY = "tamaya.clovaKey";

export function getUserKey(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USER_KEY);
}

export function setUserKey(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USER_KEY, key);
}
