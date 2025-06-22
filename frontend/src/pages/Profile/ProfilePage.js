import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { 
  FiUser, 
  FiSettings,
  FiTarget,
  FiMail,
  FiLock,
  FiHeart,
  FiHome,
  FiEdit,
  FiSave,
  FiX,
  FiCamera,
  FiTrendingUp
} from 'react-icons/fi';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    age: user?.age || '',
    height_cm: user?.height_cm || '',
    weight_kg: user?.weight_kg || '',
    goal: user?.goal || 'weight_loss',
    activity_level: user?.activity_level || 'moderate',
    gender: user?.gender || 'other'
  });

  const [preferences, setPreferences] = useState({
    workout_days: ['monday', 'wednesday', 'friday'],
    preferred_workout_time: 'morning',
    dietary_restrictions: [],
    notification_preferences: {
      workout_reminders: true,
      progress_updates: true,
      social_interactions: false
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        age: user.age || '',
        height_cm: user.height_cm || '',
        weight_kg: user.weight_kg || '',
        goal: user.goal || 'weight_loss',
        activity_level: user.activity_level || 'moderate',
        gender: user.gender || 'other'
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateUser(formData);
      if (result.success) {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const calculateBMI = () => {
    if (formData.height_cm && formData.weight_kg) {
      const heightM = formData.height_cm / 100;
      return (formData.weight_kg / (heightM * heightM)).toFixed(1);
    }
    return 'N/A';
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
        <p>You need to be logged in to access your profile.</p>
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
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: 'white',
      padding: '1rem'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
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
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>👤 My Profile</h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              Manage your account and fitness preferences
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

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: 'rgba(255,255,255,0.15)', 
            padding: '2rem', 
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)',
            marginBottom: '2rem',
            textAlign: 'center'
          }}
        >
          <div style={{ 
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            margin: '0 auto 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            position: 'relative'
          }}>
            👤
            <button style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer'
            }}>
              <FiCamera size={18} />
            </button>
          </div>
          <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>
            {formData.full_name || 'Your Name'}
          </h2>
          <p style={{ margin: 0, opacity: 0.8 }}>
            {formData.email}
          </p>
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {calculateBMI()}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>BMI</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {formData.weight_kg || '--'} kg
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Weight</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {formData.height_cm || '--'} cm
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Height</div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'profile', label: 'Personal Info', icon: FiUser },
            { id: 'goals', label: 'Fitness Goals', icon: FiTarget },
            { id: 'preferences', label: 'Preferences', icon: FiSettings },
            { id: 'security', label: 'Security', icon: FiLock }
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
          style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '2rem', 
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          {activeTab === 'profile' && (
            <div>
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h2 style={{ margin: 0 }}>Personal Information</h2>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={loading}
                  style={{
                    background: isEditing ? '#10b981' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {loading ? '...' : isEditing ? <><FiSave /> Save</> : <><FiEdit /> Edit</>}
                </button>
              </div>

              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Age
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height_cm}
                    onChange={(e) => handleInputChange('height_cm', e.target.value)}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={(e) => handleInputChange('weight_kg', e.target.value)}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '2rem' }}>Fitness Goals</h2>
              
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Primary Goal
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="weight_loss">Weight Loss</option>
                    <option value="muscle_gain">Muscle Gain</option>
                    <option value="endurance">Improve Endurance</option>
                    <option value="strength">Build Strength</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Activity Level
                  </label>
                  <select
                    value={formData.activity_level}
                    onChange={(e) => handleInputChange('activity_level', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Lightly Active</option>
                    <option value="moderate">Moderately Active</option>
                    <option value="very">Very Active</option>
                    <option value="extra">Extra Active</option>
                  </select>
                </div>
              </div>

              <div style={{ 
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '0.5rem'
              }}>
                <h3 style={{ marginTop: 0 }}>Goal Recommendations</h3>
                <p style={{ opacity: 0.9, lineHeight: '1.6' }}>
                  Based on your current goal of <strong>{formData.goal?.replace('_', ' ')}</strong> and 
                  <strong> {formData.activity_level}</strong> activity level, we recommend:
                </p>
                <ul style={{ lineHeight: '1.6', opacity: 0.9 }}>
                  <li>3-4 workouts per week</li>
                  <li>Focus on compound movements</li>
                  <li>Progressive overload training</li>
                  <li>Adequate protein intake (1.6-2.2g per kg body weight)</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '2rem' }}>Workout & Nutrition Preferences</h2>
              
              <div style={{ marginBottom: '2rem' }}>
                <h3>Preferred Workout Days</h3>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '0.5rem',
                  marginTop: '1rem'
                }}>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '0.25rem',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={preferences.workout_days.includes(day.toLowerCase())}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPreferences(prev => ({
                              ...prev,
                              workout_days: [...prev.workout_days, day.toLowerCase()]
                            }));
                          } else {
                            setPreferences(prev => ({
                              ...prev,
                              workout_days: prev.workout_days.filter(d => d !== day.toLowerCase())
                            }));
                          }
                        }}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Preferred Workout Time
                </label>
                <select
                  value={preferences.preferred_workout_time}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    preferred_workout_time: e.target.value
                  }))}
                  style={{
                    width: '100%',
                    maxWidth: '300px',
                    padding: '1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="morning">Morning (6-10 AM)</option>
                  <option value="afternoon">Afternoon (10 AM - 4 PM)</option>
                  <option value="evening">Evening (4-8 PM)</option>
                  <option value="night">Night (8 PM+)</option>
                </select>
              </div>

              <div>
                <h3>Notification Preferences</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  {[
                    { key: 'workout_reminders', label: 'Workout Reminders' },
                    { key: 'progress_updates', label: 'Progress Updates' },
                    { key: 'social_interactions', label: 'Social Interactions' }
                  ].map(pref => (
                    <label key={pref.key} style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={preferences.notification_preferences[pref.key]}
                        onChange={(e) => {
                          setPreferences(prev => ({
                            ...prev,
                            notification_preferences: {
                              ...prev.notification_preferences,
                              [pref.key]: e.target.checked
                            }
                          }));
                        }}
                      />
                      {pref.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 style={{ marginTop: 0, marginBottom: '2rem' }}>Security Settings</h2>
              
              <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
              }}>
                <button style={{
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <FiLock />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Change Password</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Update your account password</div>
                  </div>
                </button>

                <button style={{
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '0.5rem',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <FiMail />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>Two-Factor Authentication</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Add extra security to your account</div>
                  </div>
                </button>

                <div style={{ 
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: 'rgba(239, 68, 68, 0.2)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}>
                  <h3 style={{ marginTop: 0, color: '#fca5a5' }}>Danger Zone</h3>
                  <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
                    These actions cannot be undone. Please proceed with caution.
                  </p>
                  <button 
                    onClick={logout}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      marginRight: '1rem'
                    }}
                  >
                    Sign Out
                  </button>
                  <button style={{
                    background: 'transparent',
                    color: '#fca5a5',
                    border: '1px solid #fca5a5',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage; 