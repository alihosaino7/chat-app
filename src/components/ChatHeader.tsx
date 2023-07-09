import { useAuth } from "../context/AuthProvider";
import { IAuthor } from "../pages/Chat";
import { Avatar } from "./Avatar";
import { TbLogout2 } from "react-icons/tb";

type ChatHeaderProps = {
  author: IAuthor;
  room: string;
  toggleSidebar: () => void;
};

export function ChatHeader({ author, room, toggleSidebar }: ChatHeaderProps) {
  const { openConfirmModal } = useAuth();
  return (
    <header className="text-white bg-blue-500 px-4 py-3 flex items-center justify-between rounded-t-sm">
      <div className="flex items-center gap-3">
        <p
          className="text-sm font-semibold whitespace-nowrap w-[100px] overflow-hidden text-white cursor-pointer text-ellipsis"
          onClick={toggleSidebar}
        >
          {room}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={openConfirmModal}
          className="flex items-center gap-1 py-1 px-2 bg-white text-red-400 rounded-sm"
        >
          <span>
            <TbLogout2 />
          </span>
          Logout
        </button>
        <Avatar img={author.avatar} className="w-[30px] h-[30px]" />
      </div>
    </header>
  );
}
