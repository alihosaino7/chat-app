import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { LoadingOverlay } from "./LoadingOverlay";
import { RoomItem } from "./RoomItem";
import { IAuthor } from "../pages/Chat";

type SidebarProps = {
  rooms: string[];
  author: IAuthor;
};

export function Sidebar({ author, rooms }: SidebarProps) {
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
    const messages = await getDocs(collection(db, "messages"));
    const firstRoom = messages.docs.filter(
      (doc) => doc.data().room !== roomName
    )[0];
    messages.forEach(async (doc) => {
      if (doc.data().room === roomName) {
        await deleteDoc(doc.ref);
      }
    });
    setLoading(false);

    if (firstRoom) {
      navigate(`/chat/room/${firstRoom}`);
    } else {
      navigate(`/`);
    }
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
              author={author}
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
