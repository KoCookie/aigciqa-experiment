"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface FlawPoint {
  xNorm: number;
  yNorm: number;
  reasonLabels: string[];
}

export default function GuidePage() {
  const images = [
    "/images/cat.png",
    "/images/cat2.png",
    "/images/cat3.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLandscape, setIsLandscape] = useState<boolean | null>(null);

  const [flawPoints, setFlawPoints] = useState<FlawPoint[]>([]);
  const [collectReason, setCollectReason] = useState<FlawPoint | null>(null);

  const [markingEnabled, setMarkingEnabled] = useState(false);

  const reasonOptions = ["example1", "example2", "example3"];

  // 横竖版判断
  useEffect(() => {
    const img = new Image();
    img.src = images[currentIndex];
    img.onload = () => {
      setIsLandscape(img.width >= img.height);
    };
  }, [currentIndex]);

  const handleNext = () => {
    console.log("Collected data for image", currentIndex, flawPoints);
    setCurrentIndex((idx) => idx + 1);
    setFlawPoints([]);
    setCollectReason(null);
    setIsLandscape(null);
    setMarkingEnabled(false);
  };

  const handleLast = () => {
    setCurrentIndex((idx) => idx - 1);
    setFlawPoints([]);
    setCollectReason(null);
    setIsLandscape(null);
    setMarkingEnabled(false);
  };

  const handleAllFake = () => {
    handleNext();
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!markingEnabled || flawPoints.length >= 5 || collectReason) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width;
    const yNorm = (e.clientY - rect.top) / rect.height;

    setCollectReason({ xNorm, yNorm, reasonLabels: [] });
  };

  const toggleReason = (reason: string) => {
    if (!collectReason) return;

    let updated: string[];
    if (collectReason.reasonLabels.includes(reason)) {
      updated = collectReason.reasonLabels.filter((r) => r !== reason);
    } else {
      updated = [...collectReason.reasonLabels, reason];
    }

    setCollectReason({ ...collectReason, reasonLabels: updated });
  };

  const confirmReason = () => {
    if (collectReason) {
      setFlawPoints([...flawPoints, collectReason]);
      setCollectReason(null);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          {/* 图片展示区 */}
          <div className="relative border rounded-lg shadow-md overflow-hidden bg-gray-50">
            {isLandscape === null ? (
              <p className="text-gray-600 flex items-center justify-center h-full">
                加载中...
              </p>
            ) : (
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={5}
                wheel={{ step: 0.2 }}
              >
                {({ resetTransform }) => (
                  <div className="relative">
                    <TransformComponent>
                      <img
                        src={images[currentIndex]}
                        alt={`Slide ${currentIndex + 1}`}
                        style={{
                          width: isLandscape ? 1024 : 768,
                          height: isLandscape ? 768 : 1024,
                          maxWidth: "90vw",
                          maxHeight: "90vh",
                          objectFit: "contain",
                        }}
                      />
                    </TransformComponent>

                   {/* 点击层，仅在标记模式且弹窗未显示时启用 */}
                    {markingEnabled && !collectReason && (
                    <div
                      className="absolute inset-0 z-10"
                        onClick={handleImageClick}
                        style={{ cursor: "crosshair", backgroundColor: "transparent" }}
                      />
                    )}


                    {/* 已标记破绽点 */}
                    {flawPoints.map((p, idx) => (
                      <div
                        key={idx}
                        className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white pointer-events-none"
                        style={{
                          left: `${p.xNorm * 100}%`,
                          top: `${p.yNorm * 100}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    ))}

                    {/* Reset Zoom 按钮 */}
                    <button
                      onClick={() => resetTransform()}
                      className="absolute top-2 right-2 bg-white/80 text-black px-3 py-1 rounded-md shadow hover:bg-white transition"
                    >
                      Reset Zoom
                    </button>
                  </div>
                )}
              </TransformWrapper>
            )}
          </div>

          {/* 控制按钮区 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLast}
              disabled={currentIndex === 0}
              className={`rounded-xl px-4 py-2 text-white transition
                ${
                  currentIndex === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700"
                }`}
            >
              Last
            </button>

            <button
              onClick={() => setMarkingEnabled(!markingEnabled)}
              className={`rounded-xl px-4 py-2 text-white transition ${
                markingEnabled
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {markingEnabled ? "标记模式 ON" : "标记模式 OFF"}
            </button>

            <button
              onClick={handleAllFake}
              className="rounded-xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition"
            >
              All Fake (Skip)
            </button>

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
          {currentIndex + 1} / {images.length} | Points: {flawPoints.length}
        </p>

        {/* 弹窗收集理由，多选 */}
        {collectReason && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
              <p>选择破绽理由 (可多选):</p>
              <div className="flex gap-4 flex-wrap">
                {reasonOptions.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => toggleReason(reason)}
                    className={`px-4 py-2 rounded border ${
                      collectReason.reasonLabels.includes(reason)
                        ? "bg-blue-500 text-white border-blue-700"
                        : "bg-gray-200 text-black border-gray-400"
                    } hover:opacity-80`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
              <button
                onClick={confirmReason}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                确认
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
