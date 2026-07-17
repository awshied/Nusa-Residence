import { useEffect, useRef, useState } from "react";

type Props = {
  onFinish?: () => void;
  isLoading: boolean;
  minDuration?: number;
};

const Loading = ({ onFinish, isLoading, minDuration = 4500 }: Props) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(isLoading);
  const [dots, setDots] = useState("");
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoading) return;

    setVisible(true);
    setProgress(0);
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + Math.random() * 10));
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || !startTimeRef.current) return;

    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(minDuration - elapsed, 0);

    setProgress(100);

    const timer = setTimeout(() => {
      setVisible(false);
      setProgress(0);
      onFinish?.();
    }, remaining);

    return () => clearTimeout(timer);
  }, [isLoading, minDuration, onFinish]);

  if (!visible && !isLoading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className="animate-spin rounded-full h-18 w-18 border-t-5 border-b-5 border-base-content" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-sm md:text-base font-poppins text-base-content font-semibold"
            aria-hidden="true"
          >
            {Math.floor(progress)}%
          </span>
        </div>
      </div>
      <p className="font-mona text-center text-xs md:text-sm text-base-content/70 font-semibold">
        Mohon tunggu sebentar {dots}
      </p>
    </div>
  );
};

export default Loading;
