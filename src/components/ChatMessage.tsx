import { IMessage } from "../pages/Chat";

type ChatMessageProps = {
  message: IMessage;
  isOwner: boolean;
};
export function ChatMessage({ message, isOwner }: ChatMessageProps) {
  return (
    <div
      className={`flex items-center ${
        isOwner ? "flex-row group" : "flex-row-reverse"
      }`}
    >
      <div>
        <div
          className={`px-3 py-1 rounded-lg ${
            isOwner ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <p>
            <span className="font-semibold">{message.author.displayName}</span>:{" "}
            {message.messageText}
          </p>
        </div>
        <p className="text-gray-400 text-sm mt-1 group-last:block hidden">
          {isOwner ? "You" : message.author.displayName}
        </p>
      </div>
    </div>
  );
}
