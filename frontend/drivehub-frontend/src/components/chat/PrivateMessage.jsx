import { useState } from "react";
import Avatar from '../layout/Avatar.jsx';

export default function PrivateMessage({ selectedChat, messages, onSendMessage }) {
    const [newMessage, setNewMessage] = useState("");

    if (!selectedChat) {
        return (
            <div className="private-message-empty d-flex align-items-center justify-content-center">
                <div className="text-center text-muted">
                    <i className="bi bi-chat-dots" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-2">Select a conversation to start messaging</p>
                </div>
            </div>
        );
    }

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        onSendMessage(newMessage);
        setNewMessage("");
    };

    return (
        <div className="private-message-container d-flex flex-column">
            <div className="chat-header border-bottom p-3 d-flex align-items-center">
                <Avatar src={selectedChat.avatar} alt={selectedChat.username} size="sm" />
                <div className="ms-3">
                    <h6 className="mb-0 fw-bold">{selectedChat.username}</h6>
                    <small className={selectedChat.online ? "text-success" : "text-muted"}>
                        {selectedChat.online ? "Online" : "Offline"}
                    </small>
                </div>
            </div>

            <div className="chat-messages flex-grow-1 p-3 d-flex flex-column gap-2" style={{ overflowY: 'auto' }}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`d-flex ${msg.sender === 'me' ? 'justify-content-end' : 'justify-content-start'}`}
                    >
                        <div className={msg.sender === 'me' ? 'message-bubble-me' : 'message-bubble-other'}>
                            <p className="mb-1">{msg.text}</p>
                            <small className="message-time">{msg.time}</small>
                        </div>
                    </div>
                ))}
            </div>

            <form className="border-top p-3 d-flex gap-2" onSubmit={handleSend}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-aqua px-3">
                    <i className="bi bi-send-fill"></i>
                </button>
            </form>
        </div>
    );
}
