import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { Sidebar } from "../components/Sidebar";
import { ChatInput } from "../components/ChatInput";
import { ChatHeader } from "../components/ChatHeader";
import { MessagesList } from "../components/MessagesList";
import { ConfirmModal } from "../components/ConfirmModal";
import { signOut } from "firebase/auth";

export interface IMessage {
  id: string;
  messageText: string;
  author: IAuthor;
}

export interface IAuthor {
  displayName: string;
  avatar: string;
}

export interface IRoom {
  messages: IMessage[];
  roomName: string;
  admin: {
    uid: string;
  };
}

export default function Chat() {
  const { currentUser } = useAuth();
  const { roomName } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [author, setAuthor] = useState<IAuthor | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showSidebar, setShowSidebar] = useState(false);

  function getAuthor() {
    return getDoc(doc(db, "users", currentUser.uid)).then((doc) => {
      setAuthor(doc.data() as IAuthor);
    });
  }

  function fetchMessages() {
    return getDoc(doc(db, "rooms", roomName as string)).then(
      (roomDocSnapshot) => {
        if (roomDocSnapshot.exists()) {
          setMessages(roomDocSnapshot.data()?.messages as IMessage[]);
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
      setRooms(roomDocSnapshot.docs.map((room) => room.data()) as IRoom[]);
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
      <div className="h-full w-full flex items-center justify-center">
        <div className="w-full lg:w-[800px] bg-white rounded-md relative overflow-hidden">
          {loading && <LoadingOverlay />}
          {author && roomName && (
            <ChatHeader
              openModal={() => setShowConfirmModal(true)}
              toggleSidebar={() => setShowSidebar((prev) => !prev)}
              room={roomName}
              author={author}
            />
          )}
          <div className="flex relative sm:static h-fit">
            <div
              className={`absolute sm:static z-[100] duration-[500ms] h-[300px] sm:h-[100%] bg-white top-0 sm:basis-1/3`}
              style={{ left: showSidebar ? "0%" : "-100%" }}
            >
              {rooms && <Sidebar rooms={rooms} />}
            </div>
            <div className="w-full sm:basis-2/3 flex-col flex">
              <main className="p-4 h-[300px] sm:h-[400px] overflow-y-auto custom-scrollbar relative">
                {author && messages && (
                  <MessagesList author={author} messages={messages} />
                )}
                {loading && <LoadingOverlay />}
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
