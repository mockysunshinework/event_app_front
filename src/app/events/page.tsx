"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { fetchFromAPI } from "@/lib/api";
import { Event } from "@/types/event";

export default function EventsPage() {
  const { user, token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingId, setApplyingId] = useState<number | null>(null);

  useEffect(() => {
    fetchFromAPI<Event[]>("/api/v1/events")
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async (eventId: number) => {
    if (!token) return;

    setApplyingId(eventId);
    try {
      await fetchFromAPI(`/api/v1/events/${eventId}/event_applications`, {
        method: "POST",
        headers: { Authorization: token },
      });
      alert("イベントに参加しました");
    } catch {
      alert("参加に失敗しました");
    } finally {
      setApplyingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">エラー: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">イベント一覧</h1>

      {events.length === 0 ? (
        <p className="text-gray-500">イベントがありません。</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <div className="mt-2 text-sm text-gray-600 space-y-1">
                <p>📅 {new Date(event.starts_at).toLocaleString("ja-JP")}</p>
                <p>📍 {event.location}</p>
              </div>
              {user && (
                <button
                  onClick={() => handleApply(event.id)}
                  disabled={applyingId === event.id}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {applyingId === event.id ? "処理中..." : "イベントに参加する"}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
