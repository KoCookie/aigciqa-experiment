"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>

        <div className="flex gap-4">
          {/* 登录/注册按钮 */}
          <Link
            href="/auth"
            className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login / Register
          </Link>

          {/* 教程按钮 */}
          <Link
            href="/tutorial"
            className="rounded-xl bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition"
          >
            Tutorial
          </Link>
        </div>
      </div>
    </div>
  );
}
