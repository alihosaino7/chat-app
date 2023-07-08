import { Spinner } from "./Spinner";

export const LoadingOverlay = () => {
  return (
    <div className="bg-[rgba(255,255,255,.7)] flex items-center justify-center absolute left-0 top-0 w-full h-full rounded-lg z-[100]">
      <Spinner />
    </div>
  );
};
