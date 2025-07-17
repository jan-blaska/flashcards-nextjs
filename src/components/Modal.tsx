"use client";

import { useRef } from "react";

type Props = {
  children: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
};

export default function Modal({ children, onConfirm, onClose }: Props) {
  const backdropRef = useRef<HTMLDivElement | null>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed top-0 left-0 w-screen h-screen z-50 backdrop-blur-xs bg-black/30 dark:bg-white/10 flex justify-center items-center"
    >
      <div className="bg-(--card) rounded-xl px-6 py-8 max-w-3/4 sm:max-w-[400px]">
        {children}
        <div className="flex flex-row justify-around mt-4 gap-6">
            <button
                onClick={onConfirm}
                className="w-full px-8 py-3 rounded-lg cursor-pointer bg-green-500 hover:bg-green-700"
            >
                Yes
            </button>
            <button
                onClick={onClose}
                className="w-full px-8 py-3 bg-red-500 rounded-lg hover:bg-red-800 cursor-pointer"
            >
                No
            </button>
        </div>
      </div>
    </div>
  );
}
