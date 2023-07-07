import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { Room } from "./Chat";
import { TbLogout2 } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAuth } from "./AuthProvider";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import LoadingOverlay from "./components/LoadingOverlay";

type SidebarProps = {
  rooms: Room[];
  openModal: () => void;
};

export function Sidebar({ rooms, openModal }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = useMemo(
    () =>
      rooms.filter(
        (room) =>
          room.roomName.toLocaleLowerCase() ===
            searchQuery.toLocaleLowerCase() ||
          room.roomName
            .toLocaleLowerCase()
            .startsWith(searchQuery.toLocaleLowerCase())
      ),
    [rooms, searchQuery]
  );

  async function deleteRoom(roomName: string) {
    setLoading(true);
    await deleteDoc(doc(db, "rooms", roomName));
    await getDocs(collection(db, "rooms")).then((roomsSnapshot) => {
      if (roomsSnapshot.size > 0) {
        const firstRoom = roomsSnapshot.docs[0].data() as Room;
        navigate(`/chat/room/${firstRoom.roomName}`);
      } else {
        navigate("/");
      }
    });
    setLoading(false);
  }

  return (
    <div className="basis-1/3 border-r flex-col flex border-[#ccc]">
      <input
        type="text"
        placeholder="Find a room"
        className="border-b px-4 py-2 border-[#ccc] outline-0"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="min-h-fit max-h-[400px] overflow-auto relative">
        {loading && <LoadingOverlay />}

        {filteredRooms?.map((room) => {
          const urlMatch = location.pathname == `/chat/room/${room.roomName}`;
          return (
            <div
              key={nanoid()}
              className={`p-4 border-b border-[#ccc] hover:bg-gray-200 flex items-center justify-between ${
                urlMatch ? "bg-gray-200" : "bg-white"
              }`}
              onClick={() => {
                if (!urlMatch) {
                  navigate(`/chat/room/${room.roomName}`);
                }
              }}
            >
              <p>
                room: <span className="font-bold">{room.roomName}</span>
              </p>
              {room.admin.uid === currentUser.uid && (
                <button
                  onClick={() => deleteRoom(room.roomName)}
                  className="text-lg text-gray-500 hover:text-[#333]"
                >
                  <RiDeleteBin6Line />
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-auto px-4 py-3 border-t border-[#ccc]">
        <button
          onClick={openModal}
          className="flex items-center gap-2 font-semibold text-red-400 hover:text-red-500"
        >
          <span className="text-lg">
            <TbLogout2 />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
}
