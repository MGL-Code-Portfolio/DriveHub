import { useState, useEffect, useCallback } from 'react';
import SideBar from '../components/layout/SideBar.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import Avatar from '../components/layout/Avatar.jsx';
import '../css/Community.css';
import CreatePost from "../components/modals/CreatePost.jsx";
import api from '../api/axios';

function Community() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedComments, setExpandedComments] = useState({});
    const [commentText, setCommentText] = useState({});
    const [commentRefresh, setCommentRefresh] = useState({});

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts/');
            setPosts(res.data);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLike = async (postId) => {
        try {
            await api.post(`/posts/${postId}/like/`);
            fetchPosts();
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    const handlePostCreated = () => {
        fetchPosts();
    };

    const toggleComments = (postId) => {
        setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handleAddComment = async (postId) => {
        const text = commentText[postId];
        if (!text?.trim()) return;
        try {
            await api.post(`/posts/${postId}/comments/`, { content: text });
            setCommentText(prev => ({ ...prev, [postId]: '' }));
            setCommentRefresh(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const filteredPosts = posts
        .filter(post => {
            if (!searchQuery.trim()) return true;
            const q = searchQuery.toLowerCase();
            return post.author_name.toLowerCase().includes(q) || post.content.toLowerCase().includes(q);
        })
        .sort((a, b) => {
            if (activeFilter === 'trending') return b.likes_count - a.likes_count;
            return new Date(b.date_posted) - new Date(a.date_posted);
        });

    return (
        <>
            <SideBar />

            <main className="main-content community-page">

                <PageHeader
                    title="Community Feed"
                    description="Share your passion with fellow car enthusiasts"
                />

                <div className="community-body">
                    <section className="community-search-section">
                        <input
                            type="text"
                            className="community-search"
                            placeholder="Search posts, drivers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </section>

                    <section className="community-filters">
                        <button
                            className={`community-filter ${activeFilter === 'recent' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('recent')}
                        >
                            Recent
                        </button>
                        <button
                            className={`community-filter ${activeFilter === 'trending' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('trending')}
                        >
                            Trending
                        </button>
                    </section>

                    {loading ? (
                        <p className="text-muted">Loading posts...</p>
                    ) : filteredPosts.length === 0 ? (
                        <p className="text-muted">No posts found.</p>
                    ) : (
                        <section className="community-feed">
                            {filteredPosts.map((post) => (
                                <div key={post.id} className="community-post">
                                    <div className="community-post-header">
                                        <div className="d-flex align-items-center">
                                            <Avatar src={post.author_profile_picture} alt={post.author_name} size="md" />
                                            <div className="ms-3">
                                                <h6 className="mb-0 fw-bold">{post.author_name}</h6>
                                                <small className="text-muted">{new Date(post.date_posted).toLocaleDateString()}</small>
                                            </div>
                                        </div>
                                    </div>

                                    {post.media && (
                                        <img src={post.media} alt="post" className="community-post-image" />
                                    )}

                                    <div className="community-post-body">
                                        <p className="community-post-caption">{post.content}</p>
                                        <div className="community-post-actions">
                                            <span className="community-action-btn" onClick={() => handleLike(post.id)}>
                                                {post.likes_count} likes
                                            </span>
                                            <span className="community-action-btn" onClick={() => toggleComments(post.id)}>
                                                comments
                                            </span>
                                        </div>
                                    </div>

                                    {expandedComments[post.id] && (
                                        <div className="community-comments">
                                            <PostComments postId={post.id} refreshTrigger={commentRefresh[post.id]} />
                                            <div className="community-comment-input">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Write a comment..."
                                                    value={commentText[post.id] || ''}
                                                    onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                                                />
                                                <button className="btn btn-aqua btn-sm" onClick={() => handleAddComment(post.id)}>
                                                    <i className="bi bi-send-fill"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}
                </div>

                <button
                    className="create-post-btn btn-aqua"
                    onClick={() => setIsCreateOpen(true)}
                    style={{
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        lineHeight: 1,
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)'
                    }}
                >
                    <i className="bi bi-plus-lg fw-bold" style={{ fontSize: '1.5rem' }}></i>
                </button>

            </main>

            <CreatePost isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onPostCreated={handlePostCreated} />
        </>
    );
}

function PostComments({ postId, refreshTrigger }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComments = useCallback(async () => {
        try {
            const res = await api.get(`/posts/${postId}/comments/`);
            setComments(res.data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        } finally {
            setLoading(false);
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments, refreshTrigger]);

    if (loading) return <p className="text-muted small px-3">Loading comments...</p>;

    return (
        <div className="community-comments-list">
            {comments.length === 0 ? (
                <p className="text-muted small px-3 mb-2">No comments yet.</p>
            ) : (
                comments.map((comment) => (
                    <div key={comment.id} className="community-comment">
                        <Avatar src={comment.author_profile_picture} alt={comment.author_name} size="xs" />
                        <div className="community-comment-body">
                            <strong>{comment.author_name}</strong>
                            <span>{comment.content}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Community;
