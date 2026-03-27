const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export type User = {
  id: number;
  name: string;
  email: string;
};

type AuthResponse = {
  user: User;
};

type RegistrationError = {
  error: string;
  details: string[];
};

export async function signIn(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_URL}/api/v1/auth/sign_in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: { email, password } }),
  });

  if (!res.ok) {
    throw new Error("メールアドレスまたはパスワードが正しくありません");
  }

  const data: AuthResponse = await res.json();
  const token = res.headers.get("Authorization") || "";

  return { user: data.user, token };
}

export async function signUp(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_URL}/api/v1/auth/sign_up`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: { name, email, password, password_confirmation: passwordConfirmation },
    }),
  });

  if (!res.ok) {
    const error: RegistrationError = await res.json();
    throw new Error(error.details?.join(", ") || "登録に失敗しました");
  }

  const data: AuthResponse = await res.json();
  const token = res.headers.get("Authorization") || "";

  return { user: data.user, token };
}

export async function signOut(token: string): Promise<void> {
  await fetch(`${API_URL}/api/v1/auth/sign_out`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
}

export function saveAuth(user: User, token: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getStoredAuth(): { user: User; token: string } | null {
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");

  if (!token || !userJson) return null;

  try {
    return { user: JSON.parse(userJson), token };
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
