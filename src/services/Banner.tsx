import { FC, useState, useEffect } from "react";

export enum BannerTypesEnum {
  ERROR = "ERROR",
  INFO = "INFO",
}

interface BannerProps {
  type: keyof typeof BannerTypesEnum;
  message: string;
  duration?: number; // Optionally specify duration in milliseconds
}

const Banner: FC<BannerProps> = ({ type, message, duration = 5000 }) => {
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  let backgroundColor = "bg-blue-500";

  if (type === BannerTypesEnum.ERROR) {
    backgroundColor = "bg-red-500";
  }

  return (
    <div
      className={`py-2 px-4 ${backgroundColor} "text-white" fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-300 ${
        showBanner ? "block" : "hidden"
      }`}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm">{message}</p>
        <button
          onClick={() => setShowBanner(false)}
          className="text-sm font-semibold focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Banner;
