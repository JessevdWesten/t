import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiBook } from 'react-icons/fi';

const RecipeDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/recipes" className="btn btn-secondary">
          <FiArrowLeft />
          Back to Recipes
        </Link>
        <h1>Recipe Details</h1>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Recipe #{id}</h2>
          <p className="text-muted">Detailed recipe information coming soon!</p>
        </div>

        <div className="recipe-placeholder">
          <div className="recipe-icon">
            <FiBook size={48} />
          </div>
          <h3>Recipe Content</h3>
          <p>
            This page will show detailed recipe instructions, ingredients, 
            nutrition facts, cooking time, and more.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage; 