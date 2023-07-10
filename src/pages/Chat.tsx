import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { Sidebar } from "../components/Sidebar";
import { ChatInput } from "../components/ChatInput";
import { ChatHeader } from "../components/ChatHeader";
import { ChatMessages } from "../components/ChatMessages";
import { ConfirmModal } from "../components/ConfirmModal";
import { signOut } from "firebase/auth";
import { BsArrowLeft } from "react-icons/bs";

export interface IMessage {
  id: string;
  messageText: string;
  author: IAuthor;
  room: string;
}

export interface IAuthor {
  avatar: string;
  displayName: string;
  uid: string;
}

export default function Chat() {
  const { currentUser, confirmModalOpened } = useAuth();
  const { roomName } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [author, setAuthor] = useState<IAuthor | null>(null);

  const [showSidebar, setShowSidebar] = useState(false);

  const rooms = new Set(messages?.map((message) => message.room)) || [];

  const messagesRef = collection(db, "messages");

  function getAuthor() {
    return getDoc(doc(db, "users", currentUser.uid)).then((doc) => {
      setAuthor(doc.data() as IAuthor);
    });
  }

  function fetchMessages(): Promise<void> {
    return getDocs(query(messagesRef, orderBy("createdAt"))).then(
      (messagesSnapshot) => {
        setMessages(
          messagesSnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as IMessage[]
        );
      }
    );
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
    const unsubscribe = onSnapshot(collection(db, "messages"), () => {
      fetchMessages();
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
      setLoading(true);
      fetchMessages().then(() => {
        setLoading(false);
      });
    }
  }, [roomName, author]);

  return (
    <>
      {confirmModalOpened && <ConfirmModal actionCallback={logout} />}
      <div className="w-full flex items-center justify-center">
        <div className="w-full lg:w-[800px] lg:mx-auto h-[500px]">
          <Link to="/" className="text-white text-2xl block mb-4">
            <BsArrowLeft />
          </Link>
          <div className="w-full bg-white rounded-md relative overflow-hidden">
            {author && roomName && (
              <ChatHeader
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
                {rooms && author && (
                  <Sidebar author={author} rooms={Array.from(rooms)} />
                )}
              </div>
              <div className="w-full sm:basis-2/3 flex-col flex">
                <main className="p-4 h-[300px] sm:h-[400px] overflow-y-auto custom-scrollbar relative">
                  {author && messages && roomName && (
                    <ChatMessages
                      author={author}
                      messages={messages}
                      currentRoom={roomName}
                    />
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
      </div>
    </>
  );
}
