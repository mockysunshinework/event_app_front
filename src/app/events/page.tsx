"use client";

import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/lib/api";
import { Event } from "@/types/event";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFromAPI<Event[]>("/api/v1/events")
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
