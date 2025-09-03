// app/turorial/page.tsx
"use client";

import Link from "next/link";

export default function GuidePage() {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50 gap-6">
      <h1 className="text-2xl font-semibold text-gray-800 text-center px-4">
        Hello! And there will be a video for Guiding.
      </h1>

      <Link
        href="/"
        className="rounded-2xl bg-blue-600 px-6 py-3 text-white shadow-md hover:bg-blue-700 transform transition hover:scale-105"
      >
        Back to Home
      </Link>
    </div>
  );
}
