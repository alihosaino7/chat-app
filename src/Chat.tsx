import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import LoadingOverlay from "./components/LoadingOverlay";
import { Sidebar } from "./Sidebar";
import { ChatInput } from "./ChatInput";
import { ChatHeader } from "./ChatHeader";
import { MessagesList } from "./MessagesList";
import { ConfirmModal } from "./components/ConfirmModal";
import { signOut } from "firebase/auth";

export type Message = {
  id: string;
  messageText: string;
  author: Author;
};

export type Author = {
  displayName: string;
  avatar: string;
};

export type Room = {
  messages: Message[];
  roomName: string;
  admin: {
    uid: string;
  };
};

export default function Chat() {
  const { currentUser } = useAuth();
  const { roomName } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState<Author | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  function getAuthor() {
    return getDoc(doc(db, "users", currentUser.uid)).then((doc) => {
      setAuthor(doc.data() as Author);
    });
  }

  function fetchMessages() {
    return getDoc(doc(db, "rooms", roomName as string)).then(
      (roomDocSnapshot) => {
        if (roomDocSnapshot.exists()) {
          setMessages(roomDocSnapshot.data()?.messages as Message[]);
        }
      }
    );
  }

  async function fetchData() {
    setLoading(true);
    await fetchMessages();
    await fetchAllRooms();
    setLoading(false);
  }

  function fetchAllRooms() {
    return getDocs(collection(db, "rooms")).then((roomDocSnapshot) => {
      setRooms(roomDocSnapshot.docs.map((room) => room.data()) as any);
    });
  }

  async function logout() {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "rooms"), () => {
      fetchMessages();
      fetchAllRooms();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      getAuthor();
    }
  }, [currentUser]);

  useEffect(() => {
    if (roomName && author) {
      fetchData();
    }
  }, [roomName, author]);

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          actionCallback={logout}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
      <div className="h-screen w-full flex items-center justify-center bg-[#333]">
        <div className="w-[800px] bg-white rounded-md relative overflow-hidden">
          {loading && <LoadingOverlay />}
          {author && <ChatHeader author={author} />}
          <div className="flex">
            {rooms && (
              <Sidebar
                rooms={rooms}
                openModal={() => setShowConfirmModal(true)}
              />
            )}
            <div className="basis-2/3">
              {" "}
              <main className="p-4 h-[400px] overflow-y-auto custom-scrollbar relative">
                {author && messages ? (
                  <MessagesList author={author} messages={messages} />
                ) : (
                  <LoadingOverlay />
                )}
              </main>
              {roomName && author && (
                <ChatInput roomName={roomName} author={author} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
