import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

type RoomItemProps = {
  isUrlMatch: boolean;
  onDelete(roomName: string): void;
  room: string;
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
          navigate(`/chat/room/${room}`);
        }
      }}
    >
      <p className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        room: <span className="font-bold">{room}</span>
      </p>
      {/* {room.admin.uid === currentUser.uid && (
        <button
          onClick={() => onDelete(room)}
          className="text-lg text-gray-500 hover:text-[#333]"
        >
          <RiDeleteBin6Line />
        </button>
      )} */}
    </div>
  );
}
