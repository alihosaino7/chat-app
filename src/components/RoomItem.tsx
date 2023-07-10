import { useNavigate } from "react-router-dom";
import { MdOutlineDelete, MdDelete } from "react-icons/md";
import { useAuth } from "../context/AuthProvider";
import { IAuthor } from "../pages/Chat";

type RoomItemProps = {
  isUrlMatch: boolean;
  onDelete(roomName: string): void;
  room: string;
  author: IAuthor;
};
export function RoomItem({
  isUrlMatch,
  room,
  onDelete,
  author,
}: RoomItemProps) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  return (
    <div
      className={`p-4 border-b border-[#ccc] hover:bg-gray-200 flex items-center justify-between ${
        isUrlMatch ? "bg-gray-200" : "bg-white"
      }`}
      onClick={() => {
        if (!isUrlMatch) {
          navigate(`/chat/room/${room}`);
        }
      }}
    >
      <p className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        room: <span className="font-bold">{room}</span>
      </p>
      {author.uid === currentUser.uid && (
        <button
          onClick={() => onDelete(room)}
          className="group text-xl text-red-500"
        >
          <span className="block group-hover:hidden">
            <MdOutlineDelete />
          </span>
          <span className="hidden group-hover:block">
            <MdDelete />
          </span>
        </button>
      )}
    </div>
  );
}
