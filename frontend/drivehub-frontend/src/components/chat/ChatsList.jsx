import { useState, useEffect } from "react";
import Avatar from '../layout/Avatar.jsx';
import api from '../../api/axios';

export default function ChatsList({ chats, selectedChat, setSelectedChat, loading, onStartConversation }) {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [friends, setFriends] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const filteredChats = chats.filter((chat) =>
        chat.username.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [friendsRes, meRes] = await Promise.all([
                    api.get('/social/friends/'),
                    api.get('/users/me/'),
                ]);
                setFriends(friendsRes.data.filter(f => f.status === 'accepted'));
                setCurrentUserId(meRes.data.id);
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };
        fetchData();
    }, []);

    const handleSearch = async (query) => {
        setSearch(query);
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await api.get(`/users/?search=${encodeURIComponent(query)}`);
            setSearchResults(res.data);
        } catch (err) {
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const handleUserClick = (user) => {
        onStartConversation(user);
        setSearch("");
        setSearchResults([]);
    };

    const chatUsernames = new Set(chats.map(c => c.username));
    const friendsWithoutChat = friends.filter(f => {
        const name = f.sender_name || f.receiver_name;
        return !chatUsernames.has(name);
    });

    return (
        <div className="messages-list border-end">
            <div className="p-4 border-bottom">
                <h4 className="fw-bold mb-3"> Messages </h4>
                <input type="text" className="form-control" placeholder="Search users or conversations..." value={search} onChange={(e) => handleSearch(e.target.value)} />
            </div>

            <div className="d-flex flex-column">
                {search.trim().length >= 2 ? (
                    <>
                        {searching ? (
                            <p className="text-muted p-3">Searching...</p>
                        ) : searchResults.length === 0 ? (
                            <p className="text-muted p-3">No users found.</p>
                        ) : searchResults.map((user) => (
                            <div key={user.id} onClick={() => handleUserClick(user)} className="chat-item d-flex align-items-center p-3">
                                <Avatar src={user.profile_picture} alt={user.username} size="md" />
                                <div className="ms-3 overflow-hidden">
                                    <h6 className="mb-1 fw-semibold text-truncate">{user.first_name} {user.last_name}</h6>
                                    <p className="mb-0 text-muted text-truncate small">@{user.username}</p>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {loading ? (
                            <p className="text-muted p-3">Loading conversations...</p>
                        ) : (
                            <>
                                {chats.length > 0 && (
                                    <>
                                        <span className="text-muted fw-bold px-3 pt-3 pb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>CONVERSATIONS</span>
                                        {filteredChats.map((chat) => (
                                            <div key={chat.id} onClick={() => setSelectedChat(chat)} className={`chat-item d-flex align-items-center p-3 ${selectedChat?.id === chat.id ? "chat-active" : ""}`}>
                                                <Avatar src={chat.avatar} alt={chat.username} size="md" />
                                                <div className="ms-3 overflow-hidden">
                                                    <h6 className="mb-1 fw-semibold text-truncate" style={{ fontSize: '0.92rem' }}>{chat.username}</h6>
                                                    <p className="mb-0 text-muted text-truncate small">{chat.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}

                                {friendsWithoutChat.length > 0 && (
                                    <>
                                        <span className="text-muted fw-bold px-3 pt-3 pb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>FRIENDS</span>
                                        {friendsWithoutChat.map((f) => {
                                            const name = f.sender_name || f.receiver_name;
                                            const otherUserId = f.sender === currentUserId ? f.receiver : f.sender;
                                            const picture = f.sender === currentUserId ? f.receiver_picture : f.sender_picture;
                                            return (
                                                <div key={f.id} onClick={() => handleUserClick({ id: otherUserId, username: name, profile_picture: picture })} className="chat-item d-flex align-items-center p-3">
                                                    <Avatar src={picture} alt={name} size="md" />
                                                    <div className="ms-3 overflow-hidden">
                                                        <h6 className="mb-1 fw-semibold text-truncate" style={{ fontSize: '0.92rem' }}>{name}</h6>
                                                        <p className="mb-0 text-muted text-truncate small">Start a conversation</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                )}

                                {chats.length === 0 && friendsWithoutChat.length === 0 && (
                                    <div className="text-center text-muted p-4">
                                        <i className="bi bi-chat-dots" style={{ fontSize: '2rem' }}></i>
                                        <p className="mt-2 mb-0">No conversations yet.</p>
                                        <p className="small">Add friends or search for users to start chatting.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
