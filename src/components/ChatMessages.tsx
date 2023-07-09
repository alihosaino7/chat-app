import { IAuthor, IMessage } from "../pages/Chat";
import { ChatMessage } from "./ChatMessage";

type ChatMessagesProps = {
  author: IAuthor;
  messages: IMessage[];
  currentRoom: string;
};

export function ChatMessages({
  author,
  messages,
  currentRoom,
}: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h2 className="font-semibold text-xl">No messages yet</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {messages
        .filter((message) => message.room === currentRoom)
        .map((message) => {
          if (!message.author) return null;
          const isOwner = author.displayName === message.author.displayName;

          return (
            <ChatMessage message={message} key={message.id} isOwner={isOwner} />
          );
        })}
    </div>
  );
}
