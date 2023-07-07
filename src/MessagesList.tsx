import { Author, Message } from "./Chat";

type MessagesListProps = {
  author: Author;
  messages: Message[];
};
export function MessagesList({ author, messages }: MessagesListProps) {
  if (messages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h2 className="font-semibold text-xl">No messages yet</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {messages.map((message, index) => {
        if (!message.author) return null;
        const isOwner = author.displayName === message.author.displayName;
        const msgAuthor = message.author.displayName;

        let msgMargin = "";

        const isInMiddle = index !== 0 && index !== messages.length - 1;

        if (isInMiddle) {
          const prevMsgAuthor = messages[index - 1].author?.displayName;
          const nextMsgAuthor = messages[index + 1].author?.displayName;
          msgMargin =
            msgAuthor !== prevMsgAuthor && msgAuthor !== nextMsgAuthor
              ? "my-2"
              : msgAuthor === prevMsgAuthor && msgAuthor !== nextMsgAuthor
              ? "mt-0 mb-2"
              : msgAuthor !== prevMsgAuthor && msgAuthor === nextMsgAuthor
              ? "mt-2 mb-0"
              : "my-0";
        }

        return (
          <div
            key={message.id}
            className={`flex gap-2 items-center ${msgMargin}`}
          >
            <div
              className={`px-3 py-1 rounded-lg ${
                isOwner ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <p>
                <span className="font-semibold">
                  {message.author.displayName}
                </span>
                : {message.messageText}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
