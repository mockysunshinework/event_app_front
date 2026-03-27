import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">イベント管理アプリ</h1>
      <Link
        href="/events"
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        イベント一覧を見る
      </Link>
    </div>
  );
}
