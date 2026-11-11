import { X, Send, Image as ImageIcon, Paperclip } from "lucide-react";
import { useRef, useState } from "react";

const ChatBox = ({ onClose }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const fileRef = useRef();

    const sendMessage = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: Date.now(),
            text: message,
            sender: "user",
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessage("");
    };

    const sendImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageURL = URL.createObjectURL(file);

        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                image: imageURL,
                sender: "user",
            },
        ]);
    };

    const formatText = (text) =>
        text.split(" ").map((word, index) =>
            word.startsWith("http") || word.includes(".com") ? (
                <a
                    key={index}
                    href={word}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    {word}{" "}
                </a>
            ) : (
                word + " "
            )
        );

    return (
        <div>
            {/* Dark Background (Mobile Only) */}
            <div className="fixed inset-0 bg-black/40 z-40 sm:hidden" onClick={onClose}></div>

            {/* Chat Box */}
            <div
                className="
                    fixed z-150 bg-white dark:bg-gray-900 shadow-xl
                    sm:bottom-6 sm:right-6 sm:w-96 sm:h-[500px] sm:rounded-xl
                    w-full h-full bottom-0 right-0
                    flex flex-col
                "
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:text-white dark:border-gray-700">
                    <h2 className="font-bold text-lg ">Chat with Support</h2>
                    <X className="cursor-pointer" onClick={onClose} />
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`max-w-[80%] p-3 rounded-lg ${msg.sender === "user"
                                    ? "bg-blue-600 text-white ml-auto"
                                    : "bg-gray-200 dark:bg-gray-800"
                                }`}
                        >
                            {msg.text && <p>{formatText(msg.text)}</p>}
                            {msg.image && (
                                <img
                                    src={msg.image}
                                    alt="upload"
                                    className="rounded mt-2 max-h-40 object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex items-center gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="
                            flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800
                            outline-none dark:text-white
                        "
                    />

                    {/* Image Upload */}
                    <button className="dark:text-white" onClick={() => fileRef.current.click()}>
                        <Paperclip size={22} />
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileRef}
                        onChange={sendImage}
                        className="hidden"
                    />

                    {/* Send Button */}
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
