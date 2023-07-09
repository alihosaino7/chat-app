import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { LoadingOverlay } from "./LoadingOverlay";
import { RoomItem } from "./RoomItem";

type SidebarProps = {
  rooms: string[];
};

export function Sidebar({ rooms }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = rooms.filter(
    (room) =>
      room.toLocaleLowerCase() === searchQuery.toLocaleLowerCase() ||
      room.toLocaleLowerCase().startsWith(searchQuery.toLocaleLowerCase())
  );

  async function deleteRoom(roomName: string) {
    setLoading(true);
    await deleteDoc(doc(db, "rooms", roomName));
    await getDocs(collection(db, "rooms")).then((roomsSnapshot) => {
      if (roomsSnapshot.size > 0) {
        const firstRoom = roomsSnapshot.docs[0].data() as any;
        navigate(`/chat/room/${firstRoom.roomName}`);
      } else {
        navigate("/");
      }
    });
    setLoading(false);
  }

  return (
    <div className="border-r w-full h-[300px] sm:h-[448px] flex-col flex border-[#ccc]">
      <input
        type="text"
        placeholder="Find a room"
        className="border-b px-4 py-2 border-[#ccc] outline-0"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="min-h-fit max-h-full overflow-auto relative custom-scrollbar">
        {loading && <LoadingOverlay />}

        {filteredRooms?.map((room) => {
          const urlMatch = location.pathname == `/chat/room/${room}`;
          return (
            <RoomItem
              key={nanoid()}
              isUrlMatch={urlMatch}
              onDelete={deleteRoom}
              room={room}
            />
          );
        })}
      </div>
    </div>
  );
}
