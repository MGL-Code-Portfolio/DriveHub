import { useState, useEffect } from "react";
import '../css/Messages.css'
import SideBar from "../components/layout/SideBar";
import ChatsList from "../components/chat/ChatsList";
import PrivateMessage from "../components/chat/PrivateMessage";
import api from '../api/axios';

export default function Messages() {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/chat/conversations/');
            const conversations = res.data.map(conv => ({
                id: conv.id,
                username: conv.other_user,
                userId: conv.other_user_id,
                message: '',
                avatar: conv.other_user_picture || null,
                online: false,
                isConversation: true,
            }));
            setChats(conversations);
        } catch (err) {
            console.error('Error fetching conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchMessages = async (chat) => {
        if (!chat) return;
        try {
            const res = await api.get(`/chat/conversations/${chat.id}/`);
            const formattedMessages = res.data.map(msg => ({
                id: msg.id,
                sender: msg.sender_name === chat.username ? 'other' : 'me',
                text: msg.content,
                time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }));
            setMessages(formattedMessages);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat);
        }
    }, [selectedChat]);

    const handleSendMessage = async (text) => {
        if (!selectedChat || !text.trim()) return;
        try {
            await api.post(`/chat/conversations/${selectedChat.id}/`, { content: text });
            fetchMessages(selectedChat);
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    const handleStartConversation = async (user) => {
        try {
            const res = await api.post('/chat/conversations/', { other_user_id: user.id });
            await fetchConversations();
            const newChat = {
                id: res.data.id,
                username: res.data.other_user,
                userId: res.data.other_user_id,
                message: '',
                avatar: res.data.other_user_picture || null,
                online: false,
                isConversation: true,
            };
            setSelectedChat(newChat);
        } catch (err) {
            console.error('Error creating conversation:', err);
        }
    };

    return (
        <>
            <SideBar />
            <main className="main-content d-flex p-0">
                <ChatsList
                    chats={chats}
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    loading={loading}
                    onStartConversation={handleStartConversation}
                />
                <PrivateMessage
                    selectedChat={selectedChat}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                />
            </main>
        </>
    );
}
