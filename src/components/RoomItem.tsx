import { useNavigate } from "react-router-dom";
import { IRoom } from "../pages/Chat";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAuth } from "../context/AuthProvider";

type RoomItemProps = {
  isUrlMatch: boolean;
  onDelete(roomName: string): void;
  room: IRoom;
};
export function RoomItem({ isUrlMatch, onDelete, room }: RoomItemProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  return (
    <div
      className={`p-4 border-b border-[#ccc] hover:bg-gray-200 flex items-center justify-between ${
        isUrlMatch ? "bg-gray-200" : "bg-white"
      }`}
      onClick={() => {
        if (!isUrlMatch) {
          navigate(`/chat/room/${room.roomName}`);
        }
      }}
    >
      <p className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        room: <span className="font-bold">{room.roomName}</span>
      </p>
      {room.admin.uid === currentUser.uid && (
        <button
          onClick={() => onDelete(room.roomName)}
          className="text-lg text-gray-500 hover:text-[#333]"
        >
          <RiDeleteBin6Line />
        </button>
      )}
    </div>
  );
}
