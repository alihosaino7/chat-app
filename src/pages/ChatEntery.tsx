import { doc, getDoc, setDoc } from "firebase/firestore";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { Alert } from "../components/Alert";
import { useAuth } from "../AuthProvider";

const NOT_ALLOWED_CHARS = Array.from(" #%&+?=/\\\"'<>|");
type Validation = { isValidName: boolean; disallowedChars: string[] };

const ChatEntery = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [room, setRoom] = useState("");
  const { currentUser } = useAuth();

  const validation: Validation = useMemo(() => {
    const disallowedChars = [];
    for (let i = 0; i < room.length; i++) {
      if (NOT_ALLOWED_CHARS.includes(room[i])) {
        disallowedChars.push(room[i]);
      }
    }
    return { isValidName: disallowedChars.length === 0, disallowedChars };
  }, [room]);

  async function checkIsRoomExist() {
    const result = (await getDoc(doc(db, "rooms", room))).exists()
      ? true
      : false;
    return result;
  }

  async function joinRoom() {
    if (room === "") return setError("Field can't be empty");
    const isRoomExist = await checkIsRoomExist();
    if (!isRoomExist) {
      return setError("Room not exist");
    }

    setError("");

    navigate(`/chat/room/${room}`);
  }

  async function createRoom() {
    if (!room) return;

    let finalErrMsg = "";

    if (!validation.isValidName) {
      finalErrMsg = `The following characters are not allowed: ${validation.disallowedChars.join(
        ", "
      )}`;
    }

    if (!validation.isValidName) {
      return setError(finalErrMsg);
    }

    await setDoc(doc(db, "rooms", room), {
      roomName: room,
      messages: [],
      admin: {
        uid: currentUser.uid,
      },
    });

    navigate(`/chat/room/${room}`);
  }
  return (
    <div className="h-full w-full justify-center flex items-center">
      <div className="w-[400px]">
        <h2 className="text-white w-full border-b-2 pb-4 mb-4 border-white text-2xl text-center">
          Welcome to <span className="font-semibold">ChatterNet</span>
        </h2>
        {error && (
          <Alert text={error} bgColor="bg-red-200" txtColor="text-red-500" />
        )}
        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          type="text"
          placeholder="Room name"
          className="block w-full p-3 px-4 outline-0 mb-2"
        />
        <button
          onClick={joinRoom}
          className="text-white font-semibold bg-blue-500 hover:bg-blue-600 w-full block py-3 rounded-sm mb-2"
        >
          Join room
        </button>
        <button
          onClick={createRoom}
          className="text-white font-semibold bg-blue-500 hover:bg-blue-600 w-full block py-3 rounded-sm"
        >
          Create room
        </button>
      </div>
    </div>
  );
};

export default ChatEntery;
