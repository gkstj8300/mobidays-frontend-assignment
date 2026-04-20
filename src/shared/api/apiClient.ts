/**
 * API 클라이언트 — json-server fetch 래퍼
 */

/**
 * API base URL 결정 규칙:
 * - NEXT_PUBLIC_API_URL 환경변수가 있으면 최우선
 * - 개발 환경: json-server (http://localhost:4000)
 * - 프로덕션 환경: 빈 문자열 → 상대 경로로 fetch하여 MSW 워커가 가로챔
 *   (HTTPS 페이지에서 HTTP URL fetch 시 mixed-content 차단을 회피)
 */
const DEFAULT_API_URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL;

export const apiClient = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};
