"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="border-b border-gray-200 px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-bold">
          イベント管理
        </Link>

        {!isLoading && (
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/events" className="hover:underline">
              イベント一覧
            </Link>
            {user ? (
              <>
                <Link href="/mypage/applications" className="hover:underline">
                  申し込み一覧
                </Link>
                <span className="text-gray-600">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:underline"
                >
                  ログアウト
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:underline">
                  ログイン
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  新規登録
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
