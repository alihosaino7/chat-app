import { FiAlertCircle } from "react-icons/fi";

type AlertProps = {
  text: string;
  txtColor?: string;
  bgColor?: string;
};

export const Alert = ({
  text,
  txtColor = "text-red-400",
  bgColor = "bg-red-100",
}: AlertProps) => {
  return (
    <div
      className={`${bgColor} ${txtColor} rounded-sm py-2 px-4 mb-4 flex gap-2 items-center`}
    >
      <span>
        <FiAlertCircle />
      </span>
      <p>{text}</p>
    </div>
  );
};
