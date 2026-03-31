const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:8787").replace(/\/$/, "");

const request = async (path, payload) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload || {}),
      signal: controller.signal,
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      data: data || {},
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: {},
      networkError: true,
      error,
    };
  } finally {
    clearTimeout(timeout);
  }
};

export const signupRemote = (payload) => request("/api/auth/signup", payload);
export const signinRemote = (payload) => request("/api/auth/signin", payload);
export const verifyEmailRemote = (payload) => request("/api/auth/verify-email", payload);
export const resendVerificationRemote = (payload) =>
  request("/api/auth/resend-verification", payload);

export const getApiBase = () => API_BASE;
