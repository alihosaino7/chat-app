import { useRef, useState, useEffect } from "react";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { nanoid } from "nanoid";
import { IAuthor } from "../pages/Chat";

type ChatInputProps = {
  roomName: string;
  author: IAuthor;
};

export function ChatInput({ roomName, author }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputMsgRef = useRef<HTMLInputElement>(null!);
  const sendMsgBtnRef = useRef<HTMLButtonElement>(null!);

  useEffect(() => {
    function handleSendMessage(event: KeyboardEvent) {
      if (event.key === "Enter" && message.trim() !== "") {
        sendMsgBtnRef.current?.click?.();
      }
    }

    if (inputMsgRef.current) {
      inputMsgRef.current.addEventListener("keyup", handleSendMessage);
    }

    return () => {
      if (inputMsgRef.current) {
        inputMsgRef.current.removeEventListener("keyup", handleSendMessage);
      }
    };
  }, [message]);

  function sendMessage() {
    const id = nanoid();
    setMessage("");
    getDoc(doc(db, "rooms", roomName)).then((roomDocSnapshot) => {
      if (roomDocSnapshot.exists()) {
        updateDoc(doc(db, "rooms", roomName), {
          messages: arrayUnion({
            author: {
              displayName: author?.displayName,
              avatar: author?.avatar,
            },
            messageText: message,
            id,
          }),
        });
      } else {
        setDoc(doc(db, "rooms", roomName), {
          messages: [
            {
              author: {
                displayName: author?.displayName,
                avatar: author?.avatar,
              },
              messageText: message,
              id,
            },
          ],
        });
      }
    });
  }

  return (
    <div className="mt-auto flex border-t border-[#ccc] w-full">
      <input
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="Type a message..."
        className="flex-1 px-4 outline-0 py-2 sm:py-3"
        ref={inputMsgRef}
        value={message}
      />
      <button
        ref={sendMsgBtnRef}
        onClick={sendMessage}
        className="bg-blue-500 hover:bg-blue-600 w-[100px] text-white font-semibold"
      >
        SEND
      </button>
    </div>
  );
}
