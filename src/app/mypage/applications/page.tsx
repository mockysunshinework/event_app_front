"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { fetchFromAPI } from "@/lib/api";
import { EventApplication } from "@/types/event-application";

const STATUS_LABELS: Record<EventApplication["status"], string> = {
  pending: "申請中",
  confirmed: "確定",
  canceled: "キャンセル済",
};

const STATUS_COLORS: Record<EventApplication["status"], string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  canceled: "bg-gray-100 text-gray-500",
};

export default function MyApplicationsPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!user || !token) {
      router.push("/login");
      return;
    }

    fetchFromAPI<EventApplication[]>("/api/v1/me/event_applications", {
      headers: { Authorization: token },
    })
      .then(setApplications)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user, token, isLoading, router]);

  const handleCancel = async (id: number) => {
    if (!token) return;
    if (!confirm("この申し込みをキャンセルしますか？")) return;

    setCancelingId(id);
    try {
      const updated = await fetchFromAPI<EventApplication>(
        `/api/v1/me/event_applications/${id}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: token },
        }
      );
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updated : app))
      );
    } catch {
      alert("キャンセルに失敗しました");
    } finally {
      setCancelingId(null);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-red-500">エラー: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">申し込み一覧</h1>

      {applications.length === 0 ? (
        <p className="text-gray-500">申し込みはありません。</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((app) => (
            <li
              key={app.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{app.event.title}</h2>
                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p>
                      {new Date(app.event.starts_at).toLocaleString("ja-JP")}
                    </p>
                    <p>{app.event.location}</p>
                    <p className="text-xs text-gray-400">
                      申込日: {new Date(app.applied_at).toLocaleString("ja-JP")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${STATUS_COLORS[app.status]}`}
                  >
                    {STATUS_LABELS[app.status]}
                  </span>

                  {app.status !== "canceled" && (
                    <button
                      onClick={() => handleCancel(app.id)}
                      disabled={cancelingId === app.id}
                      className="text-sm text-red-600 hover:underline disabled:text-gray-400"
                    >
                      {cancelingId === app.id ? "処理中..." : "キャンセル"}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
