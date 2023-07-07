import { BsArrowLeft } from "react-icons/bs";
import { Author } from "./Chat";
import Avatar from "./components/Avatar";
import { useNavigate } from "react-router-dom";
type ChatHeaderProps = { author: Author };
export function ChatHeader({ author }: ChatHeaderProps) {
  const navigate = useNavigate();
  return (
    <header className="text-white bg-blue-500 px-4 py-3 flex items-center justify-between rounded-t-sm">
      <button
        onClick={() => navigate("/")}
        className="text-white text-xl h-[35px] w-[35px] rounded-full flex items-center justify-center hover:bg-[rgba(124,174,255,0.53)]"
      >
        <BsArrowLeft />
      </button>{" "}
      <div className="flex items-center">
        <span className="mr-2">{author.displayName}</span>
        <Avatar img={author.avatar} className="w-[30px] h-[30px]" />
      </div>
    </header>
  );
}
