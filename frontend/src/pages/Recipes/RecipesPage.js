import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { recipeAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { 
  FiSearch, 
  FiFilter, 
  FiClock,
  FiUsers,
  FiHeart,
  FiStar,
  FiHome,
  FiChef
} from 'react-icons/fi';

const RecipesPage = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('all');

  // Sample recipes data
  const sampleRecipes = [
    {
      id: 1,
      name: "Protein Power Bowl",
      description: "A nutritious bowl packed with lean protein, quinoa, and fresh vegetables",
      meal_type: "lunch",
      prep_time_minutes: 25,
      servings: 2,
      calories_per_serving: 450,
      protein_grams: 35,
      carbs_grams: 40,
      fat_grams: 18,
      difficulty: "easy",
      cuisine_type: "healthy",
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: true,
      ingredients: ["Quinoa", "Chicken breast", "Spinach", "Avocado", "Cherry tomatoes"]
    },
    {
      id: 2,
      name: "Overnight Oats Delight",
      description: "Creamy overnight oats with berries and nuts for a perfect breakfast",
      meal_type: "breakfast",
      prep_time_minutes: 10,
      servings: 1,
      calories_per_serving: 320,
      protein_grams: 12,
      carbs_grams: 45,
      fat_grams: 10,
      difficulty: "easy",
      cuisine_type: "healthy",
      is_vegetarian: true,
      is_vegan: true,
      is_gluten_free: true,
      ingredients: ["Oats", "Almond milk", "Blueberries", "Chia seeds", "Maple syrup"]
    },
    {
      id: 3,
      name: "Mediterranean Salmon",
      description: "Grilled salmon with Mediterranean herbs and vegetables",
      meal_type: "dinner",
      prep_time_minutes: 35,
      servings: 4,
      calories_per_serving: 520,
      protein_grams: 42,
      carbs_grams: 15,
      fat_grams: 28,
      difficulty: "medium",
      cuisine_type: "mediterranean",
      is_vegetarian: false,
      is_vegan: false,
      is_gluten_free: true,
      ingredients: ["Salmon fillet", "Olive oil", "Lemon", "Herbs", "Zucchini"]
    },
    {
      id: 4,
      name: "Green Smoothie Supreme",
      description: "Energizing green smoothie with spinach, banana, and protein powder",
      meal_type: "snack",
      prep_time_minutes: 5,
      servings: 1,
      calories_per_serving: 280,
      protein_grams: 25,
      carbs_grams: 30,
      fat_grams: 8,
      difficulty: "easy",
      cuisine_type: "healthy",
      is_vegetarian: true,
      is_vegan: true,
      is_gluten_free: true,
      ingredients: ["Spinach", "Banana", "Protein powder", "Almond milk", "Chia seeds"]
    },
    {
      id: 5,
      name: "Quinoa Buddha Bowl",
      description: "Colorful vegetarian bowl with roasted vegetables and tahini dressing",
      meal_type: "lunch",
      prep_time_minutes: 40,
      servings: 3,
      calories_per_serving: 380,
      protein_grams: 15,
      carbs_grams: 50,
      fat_grams: 14,
      difficulty: "medium",
      cuisine_type: "healthy",
      is_vegetarian: true,
      is_vegan: true,
      is_gluten_free: true,
      ingredients: ["Quinoa", "Sweet potato", "Chickpeas", "Kale", "Tahini"]
    },
    {
      id: 6,
      name: "Chocolate Protein Bars",
      description: "Homemade protein bars with dark chocolate and nuts",
      meal_type: "snack",
      prep_time_minutes: 20,
      servings: 8,
      calories_per_serving: 180,
      protein_grams: 12,
      carbs_grams: 18,
      fat_grams: 8,
      difficulty: "easy",
      cuisine_type: "healthy",
      is_vegetarian: true,
      is_vegan: false,
      is_gluten_free: true,
      ingredients: ["Protein powder", "Almond butter", "Dark chocolate", "Dates", "Almonds"]
    }
  ];

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      try {
        const response = await recipeAPI.getAll();
        setRecipes(response.data || []);
      } catch (apiError) {
        // Fallback to sample data if API fails
        console.log('API not available, using sample data');
        setRecipes(sampleRecipes);
      }
    } catch (error) {
      console.error('Error loading recipes:', error);
      setRecipes(sampleRecipes);
      toast.error('Using sample data - API connection pending');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMealType = selectedMealType === 'all' || recipe.meal_type === selectedMealType;
    return matchesSearch && matchesMealType;
  });

  const getMealTypeColor = (mealType) => {
    switch(mealType) {
      case 'breakfast': return '#f59e0b';
      case 'lunch': return '#10b981';
      case 'dinner': return '#ef4444';
      case 'snack': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
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
        <p>You need to be logged in to access recipes.</p>
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
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
            <h1 style={{ margin: 0, fontSize: '2.5rem' }}>🥗 Recipe Library</h1>
            <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
              Discover healthy and delicious recipes
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

        {/* Search and Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            position: 'relative', 
            flex: '1',
            minWidth: '250px'
          }}>
            <FiSearch style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                border: 'none',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <select
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
            style={{
              padding: '1rem',
              border: 'none',
              borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              fontSize: '1rem',
              minWidth: '150px'
            }}
          >
            <option value="all">All Meals</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snacks</option>
          </select>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ 
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ marginTop: '1rem' }}>Loading recipes...</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ 
                  background: 'rgba(255,255,255,0.15)', 
                  padding: '1.5rem', 
                  borderRadius: '1rem',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '1rem'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem' }}>{recipe.name}</h3>
                  <div style={{ 
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    background: getMealTypeColor(recipe.meal_type),
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {recipe.meal_type}
                  </div>
                </div>
                
                <p style={{ 
                  margin: '0 0 1rem 0', 
                  opacity: 0.9,
                  lineHeight: '1.5'
                }}>
                  {recipe.description}
                </p>
                
                {/* Nutrition Info */}
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {recipe.calories_per_serving || 0}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Cal</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {recipe.protein_grams || 0}g
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Protein</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {recipe.carbs_grams || 0}g
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Carbs</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                      {recipe.fat_grams || 0}g
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Fat</div>
                  </div>
                </div>
                
                {/* Recipe Info */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiClock />
                    <span>{recipe.prep_time_minutes || 15} min</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiUsers />
                    <span>{recipe.servings || 1} servings</span>
                  </div>
                  <div style={{ 
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.5rem',
                    background: getDifficultyColor(recipe.difficulty),
                    fontSize: '0.8rem'
                  }}>
                    {recipe.difficulty || 'easy'}
                  </div>
                </div>

                {/* Diet Labels */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  {recipe.is_vegetarian && (
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(34, 197, 94, 0.8)',
                      borderRadius: '0.25rem',
                      fontSize: '0.8rem'
                    }}>
                      🌱 Vegetarian
                    </span>
                  )}
                  {recipe.is_vegan && (
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(34, 197, 94, 0.8)',
                      borderRadius: '0.25rem',
                      fontSize: '0.8rem'
                    }}>
                      🌿 Vegan
                    </span>
                  )}
                  {recipe.is_gluten_free && (
                    <span style={{ 
                      padding: '0.25rem 0.5rem',
                      background: 'rgba(59, 130, 246, 0.8)',
                      borderRadius: '0.25rem',
                      fontSize: '0.8rem'
                    }}>
                      🌾 GF
                    </span>
                  )}
                </div>
                
                <button style={{ 
                  width: '100%',
                  background: 'rgba(245, 158, 11, 0.8)', 
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
                  <FiChef /> View Recipe
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {filteredRecipes.length === 0 && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            backdropFilter: 'blur(10px)'
          }}>
            <h3>No recipes found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipesPage; 