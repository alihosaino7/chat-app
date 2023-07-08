import { BsArrowLeft } from "react-icons/bs";
import { IAuthor } from "../pages/Chat";
import { Avatar } from "./Avatar";
import { Link } from "react-router-dom";
import { TbLogout2 } from "react-icons/tb";

type ChatHeaderProps = {
  openModal: () => void;
  author: IAuthor;
  room: string;
  toggleSidebar: () => void;
};

export function ChatHeader({
  openModal,
  author,
  room,
  toggleSidebar,
}: ChatHeaderProps) {
  return (
    <header className="text-white bg-blue-500 px-4 py-3 flex items-center justify-between rounded-t-sm">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-white text-xl sm:h-[35px] sm:w-[35px] rounded-full flex items-center justify-center sm:hover:bg-[rgba(124,174,255,0.53)]"
        >
          <BsArrowLeft />
        </Link>
        <div className="flex-1 sm:hidden text-left">
          <p
            className="text-sm font-semibold whitespace-nowrap overflow-hidden text-white cursor-pointer text-ellipsis"
            onClick={toggleSidebar}
          >
            {room}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={openModal}
          className="text-xs flex items-center gap-1 bg-white rounded-sm py-1 px-2 text-red-400 font-semibold"
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
