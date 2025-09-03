"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function GuidePage() {
  // 测试阶段使用 public/images 下的图片
  const images = [
    "/images/cat.jpg",
    "/images/flower.jpg",
    "/images/woman.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleLast = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6">
        {/* 图片展示区 */}
        <div className="flex items-center gap-4">
          <div className="relative w-96 h-64">
            <Image
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg shadow-md"
              priority
            />
          </div>

          {/* 按钮区 */}
          <div className="flex flex-col gap-3">
            {/* Last 按钮 */}
            <button
              onClick={handleLast}
              disabled={currentIndex === 0}
              className={`rounded-xl px-4 py-2 text-white transition
                ${currentIndex === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"}
              `}
            >
              Last
            </button>

            {/* Next 或 Back to Home */}
            {currentIndex < images.length - 1 ? (
              <button
                onClick={handleNext}
                className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
              >
                Next
              </button>
            ) : (
              <Link
                href="/"
                className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition text-center"
              >
                Back to Home
              </Link>
            )}
          </div>
        </div>

        <p className="text-gray-600">
          {currentIndex + 1} / {images.length}
        </p>
      </div>
    </div>
  );
}
