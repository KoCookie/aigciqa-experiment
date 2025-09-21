"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

interface FlawPoint {
  xNorm: number;
  yNorm: number;
  reasonLabels: string[];
}

export default function GuidePage() {
  const images = ["/images/cat.png", "/images/cat2.png", "/images/cat3.png"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLandscape, setIsLandscape] = useState<boolean | null>(null);
  const [flawPoints, setFlawPoints] = useState<FlawPoint[]>([]);
  const [collectReason, setCollectReason] = useState<FlawPoint | null>(null);
  const [markingEnabled, setMarkingEnabled] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [editingPoint, setEditingPoint] = useState<{ index: number; mode: "position" | "reason" | null } | null>(null);

  const reasonOptions = ["example1", "example2", "example3"];
  const wrapperRef = useRef<ReactZoomPanPinchRef>(null);

  useEffect(() => {
    const img = new Image();
    img.src = images[currentIndex];
    img.onload = () => setIsLandscape(img.width >= img.height);
  }, [currentIndex]);

  const handleNext = () => {
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

  const handleAllFake = () => handleNext();

  const addPoint = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!markingEnabled || flawPoints.length >= 5 || collectReason) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width;
    const yNorm = (e.clientY - rect.top) / rect.height;
    setCollectReason({ xNorm, yNorm, reasonLabels: [] });
  };

  const toggleReason = (reason: string) => {
    if (!collectReason) return;
    const labels = collectReason.reasonLabels.includes(reason)
      ? collectReason.reasonLabels.filter((r) => r !== reason)
      : [...collectReason.reasonLabels, reason];
    setCollectReason({ ...collectReason, reasonLabels: labels });
  };

  const confirmReason = () => {
    if (editingPoint?.mode === "reason" && collectReason) {
      setFlawPoints((prev) => {
        const updated = [...prev];
        updated[editingPoint.index] = { ...collectReason };
        return updated;
      });
      setCollectReason(null);
      setEditingPoint(null);
    } else if (collectReason) {
      setFlawPoints([...flawPoints, collectReason]);
      setCollectReason(null);
    }
  };

  const startDrag = (idx: number, e: React.MouseEvent) => {
    if (!markingEnabled) return;
    if (e.button !== 0) return;
    if (editingPoint?.mode !== "position") return;
    e.stopPropagation();
    setDraggingIndex(idx);
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (draggingIndex === null || !wrapperRef.current) return;
    const wrapper = wrapperRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const imgWidth = isLandscape ? 1024 : 768;
    const imgHeight = isLandscape ? 768 : 1024;

    const x = (e.clientX - rect.left - wrapper.state.positionX) / wrapper.state.scale;
    const y = (e.clientY - rect.top - wrapper.state.positionY) / wrapper.state.scale;

    const xNorm = Math.min(Math.max(x / imgWidth, 0), 1);
    const yNorm = Math.min(Math.max(y / imgHeight, 0), 1);

    setFlawPoints((prev) => {
      const updated = [...prev];
      updated[draggingIndex] = { ...updated[draggingIndex], xNorm, yNorm };
      return updated;
    });
  };

  const stopDrag = () => {
    setDraggingIndex(null);
    if (editingPoint?.mode === "position") setEditingPoint(null);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="relative border rounded-lg shadow-md overflow-hidden bg-gray-50">
            {isLandscape === null ? (
              <p className="text-gray-600 flex items-center justify-center h-full">加载中...</p>
            ) : (
              <TransformWrapper
                ref={wrapperRef}
                initialScale={1}
                minScale={1}
                maxScale={5}
                wheel={{ step: 0.2 }}
                doubleClick={{ disabled: true }}
              >
                {({ resetTransform }) => (
                  <TransformComponent>
                    <div
                      className="relative w-full h-full"
                      onDoubleClick={addPoint}
                      onContextMenu={(e) => e.preventDefault()}
                    >
                      <img
                        src={images[currentIndex]}
                        alt={`Slide ${currentIndex + 1}`}
                        style={{
                          width: isLandscape ? 1024 : 768,
                          height: isLandscape ? 768 : 1024,
                          maxWidth: "90vw",
                          maxHeight: "90vh",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />

                      {flawPoints.map((p, idx) => (
                        <div
                          key={idx}
                          className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white cursor-move"
                          style={{
                            left: `${p.xNorm * 100}%`,
                            top: `${p.yNorm * 100}%`,
                            transform: "translate(-50%, -50%)",
                            zIndex: 20,
                          }}
                          onMouseDown={(e) => startDrag(idx, e)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setCollectReason({ ...p });
                            setEditingPoint({ index: idx, mode: null });
                          }}
                        />
                      ))}

                      {/* 拖拽层 */}
                      <div
                        className="absolute inset-0 z-10"
                        onMouseMove={handleDrag}
                        onMouseUp={stopDrag}
                      />

                      <button
                        onClick={() => resetTransform()}
                        className="absolute top-2 right-2 bg-white/80 text-black px-3 py-1 rounded-md shadow hover:bg-white transition"
                      >
                        Reset Zoom
                      </button>
                    </div>
                  </TransformComponent>
                )}
              </TransformWrapper>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleLast}
              disabled={currentIndex === 0}
              className={`rounded-xl px-4 py-2 text-white transition ${
                currentIndex === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              Last
            </button>

            <button
              onClick={() => setMarkingEnabled(!markingEnabled)}
              className={`rounded-xl px-4 py-2 text-white transition ${
                markingEnabled ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-600 hover:bg-gray-700"
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

        {collectReason && editingPoint?.mode !== "position" && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4">
              {editingPoint?.mode === null && (
                <>
                  <p>右键选中破绽点：请选择操作</p>
                  <div className="flex gap-4">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={() =>
                        setEditingPoint((prev) => prev && { index: prev.index, mode: "position" })
                      }
                    >
                      修改位置
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() =>
                        setEditingPoint((prev) => prev && { index: prev.index, mode: "reason" })
                      }
                    >
                      修改理由
                    </button>
                  </div>
                </>
              )}

              {(editingPoint?.mode === "reason" || !editingPoint) && (
                <>
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
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
