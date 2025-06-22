import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  FiUsers, 
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiTrendingUp,
  FiHome,
  FiUserPlus,
  FiCamera,
  FiAward,
  FiTarget
} from 'react-icons/fi';

const SocialPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sample social data
  const samplePosts = [
    {
      id: 1,
      user: { name: 'Sarah Johnson', avatar: '👩‍💼' },
      content: 'Just completed my first 5K run! 🏃‍♀️ Feeling amazing and ready for the next challenge!',
      image: null,
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      type: 'achievement'
    },
    {
      id: 2,
      user: { name: 'Mike Chen', avatar: '👨‍💻' },
      content: 'New PR on deadlifts today - 180kg! 💪 Hard work pays off. Thanks for all the motivation, everyone!',
      image: null,
      timestamp: '4 hours ago',
      likes: 31,
      comments: 12,
      type: 'workout'
    },
    {
      id: 3,
      user: { name: 'Emma Rodriguez', avatar: '👩‍🎨' },
      content: 'Healthy meal prep Sunday! 🥗 These Buddha bowls are going to fuel my workouts this week.',
      image: '🥗',
      timestamp: '6 hours ago',
      likes: 18,
      comments: 5,
      type: 'nutrition'
    },
    {
      id: 4,
      user: { name: 'Alex Thompson', avatar: '👨‍🚀' },
      content: 'Week 8 transformation update! Down 12kg and feeling stronger than ever. This community keeps me motivated! 🔥',
      image: null,
      timestamp: '1 day ago',
      likes: 67,
      comments: 23,
      type: 'progress'
    }
  ];

  const sampleFriends = [
    { id: 1, name: 'Sarah Johnson', avatar: '👩‍💼', status: 'online', lastWorkout: 'Running - 2 hours ago' },
    { id: 2, name: 'Mike Chen', avatar: '👨‍💻', status: 'offline', lastWorkout: 'Strength Training - 4 hours ago' },
    { id: 3, name: 'Emma Rodriguez', avatar: '👩‍🎨', status: 'online', lastWorkout: 'Yoga - 6 hours ago' },
    { id: 4, name: 'Alex Thompson', avatar: '👨‍🚀', status: 'online', lastWorkout: 'HIIT - 1 day ago' }
  ];

  const challenges = [
    { id: 1, name: '30-Day Push-up Challenge', participants: 156, daysLeft: 12, joined: true },
    { id: 2, name: 'Summer Shred Challenge', participants: 89, daysLeft: 45, joined: false },
    { id: 3, name: '10K Steps Daily', participants: 234, daysLeft: 8, joined: true },
    { id: 4, name: 'Healthy Habits Challenge', participants: 67, daysLeft: 23, joined: false }
  ];

  useEffect(() => {
    setPosts(samplePosts);
  }, []);

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
    toast.success('Post liked! 💖');
  };

  const getPostTypeColor = (type) => {
    switch(type) {
      case 'achievement': return '#f59e0b';
      case 'workout': return '#10b981';
      case 'nutrition': return '#8b5cf6';
      case 'progress': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPostTypeIcon = (type) => {
    switch(type) {
      case 'achievement': return '🏆';
      case 'workout': return '💪';
      case 'nutrition': return '🥗';
      case 'progress': return '📈';
      default: return '📝';
    }
  };

  if (!user) {
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <h1>🔐 Please Log In</h1>
        <p>You need to be logged in to access the community.</p>
        <button 
          onClick={() => window.location.hash = '#login'}
          style={{ 
            background: 'rgba(255,255,255,0.2)', 
            color: 'white', 
            padding: '1rem 2rem', 
            border: 'none', 
            borderRadius: '0.5rem',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            marginTop: '1rem'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      color: 'white',
      padding: '1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>👥 FitGenius Community</h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              Connect, motivate, and achieve together
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button 
              onClick={() => window.location.hash = '#dashboard'}
              style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '0.5rem',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FiHome /> Dashboard
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'feed', label: 'Feed', icon: FiTrendingUp },
            { id: 'friends', label: 'Friends', icon: FiUsers },
            { id: 'challenges', label: 'Challenges', icon: FiTarget }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 1.5rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: activeTab === tab.id 
                  ? 'rgba(255,255,255,0.25)' 
                  : 'rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backdropFilter: 'blur(10px)',
                fontSize: '1rem'
              }}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {activeTab === 'feed' && (
            <div>
              {/* Create Post */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  padding: '1.5rem', 
                  borderRadius: '1rem',
                  backdropFilter: 'blur(10px)',
                  marginBottom: '2rem'
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Share your fitness journey</h3>
                <textarea
                  placeholder="What's your latest achievement? Share your progress!"
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '1rem',
                    resize: 'vertical',
                    marginBottom: '1rem'
                  }}
                />
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <FiCamera /> Add Photo
                  </button>
                  <button style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}>
                    📤 Share Post
                  </button>
                </div>
              </motion.div>

              {/* Posts Feed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ 
                      background: 'rgba(255,255,255,0.15)', 
                      padding: '1.5rem', 
                      borderRadius: '1rem',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    {/* Post Header */}
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ 
                        fontSize: '2rem',
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {post.user.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold' }}>{post.user.name}</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{post.timestamp}</div>
                      </div>
                      <div style={{ 
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        background: getPostTypeColor(post.type),
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        {getPostTypeIcon(post.type)} {post.type}
                      </div>
                    </div>

                    {/* Post Content */}
                    <p style={{ 
                      margin: '0 0 1rem 0',
                      lineHeight: '1.6',
                      fontSize: '1.1rem'
                    }}>
                      {post.content}
                    </p>

                    {/* Post Image */}
                    {post.image && (
                      <div style={{ 
                        fontSize: '4rem',
                        textAlign: 'center',
                        margin: '1rem 0',
                        padding: '2rem',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem'
                      }}>
                        {post.image}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={() => handleLike(post.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1rem'
                          }}
                        >
                          <FiHeart /> {post.likes}
                        </button>
                        <button style={{
                          background: 'none',
                          border: 'none',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '1rem'
                        }}>
                          <FiMessageCircle /> {post.comments}
                        </button>
                      </div>
                      <button style={{
                        background: 'none',
                        border: 'none',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1rem'
                      }}>
                        <FiShare2 /> Share
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'friends' && (
            <div>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {sampleFriends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ 
                      background: 'rgba(255,255,255,0.15)', 
                      padding: '1.5rem', 
                      borderRadius: '1rem',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ 
                        fontSize: '2.5rem',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}>
                        {friend.avatar}
                        <div style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: friend.status === 'online' ? '#10b981' : '#6b7280',
                          border: '2px solid white'
                        }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{friend.name}</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{friend.lastWorkout}</div>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: friend.status === 'online' ? '#10b981' : '#9ca3af',
                          fontWeight: 'bold'
                        }}>
                          {friend.status === 'online' ? '🟢 Online' : '⚫ Offline'}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{
                        flex: 1,
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}>
                        <FiMessageCircle /> Message
                      </button>
                      <button style={{
                        flex: 1,
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}>
                        <FiUserPlus /> Challenge
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '1.5rem'
              }}>
                {challenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ 
                      background: 'rgba(255,255,255,0.15)', 
                      padding: '1.5rem', 
                      borderRadius: '1rem',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{challenge.name}</h3>
                      {challenge.joined && (
                        <div style={{ 
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          background: '#10b981',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          Joined ✓
                        </div>
                      )}
                    </div>
                    
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '1rem',
                      fontSize: '0.9rem',
                      opacity: 0.9
                    }}>
                      <span>👥 {challenge.participants} participants</span>
                      <span>⏰ {challenge.daysLeft} days left</span>
                    </div>
                    
                    <button style={{ 
                      width: '100%',
                      background: challenge.joined ? '#6b7280' : '#3b82f6',
                      color: 'white', 
                      padding: '0.75rem', 
                      border: 'none', 
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      {challenge.joined ? (
                        <><FiAward /> View Progress</>
                      ) : (
                        <><FiUserPlus /> Join Challenge</>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SocialPage; 