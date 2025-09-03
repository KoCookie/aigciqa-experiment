// app/start/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome
        </h1>

        <div className="flex gap-6">
          <Link
            href="/experiment"
            className="rounded-2xl bg-blue-600 px-6 py-3 text-white shadow-md hover:bg-blue-700 transform transition hover:scale-105"
          >
            Start
          </Link>

          <Link
            href="/tutorial"
            className="rounded-2xl bg-green-600 px-6 py-3 text-white shadow-md hover:bg-green-700 transform transition hover:scale-105"
          >
            Guide
          </Link>
        </div>
      </div>

      {/* Tailwind 自定义动画 */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
