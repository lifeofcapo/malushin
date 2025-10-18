"use client";

import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Users, Search, Heart, PlayCircle, Sun, Moon } from 'lucide-react';
import recipes from '@/recipes.json'

const categories = ["All", "Soups", "Main Dishes", "Desserts", "Salads"];

export default function MalushinRecipes() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setDarkMode(isDark);
  
  // Apply immediately
  if (isDark) {
    document.documentElement.classList.add('dark');
  }
}, []);

useEffect(() => {
  // Apply dark mode class to HTML element
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (recipeId) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

return (
  <div className="min-h-screen transition-colors duration-300" style={{ background: darkMode ? 'linear-gradient(to bottom right, #1f2937, #111827, #1f2937)' : 'linear-gradient(to bottom right, #FFEEA9, #ffffff, #FFBF78)' }}>
    <header className="sticky top-0 z-50 shadow-sm transition-colors duration-300" style={{ backgroundColor: 'var(--color-bg-header)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-10 h-10 text-primary-main" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-dark to-primary-main bg-clip-text text-transparent">
              Malushin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden md:block" style={{ color: 'var(--color-text-secondary)' }}>Secret Recipes</p>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full transition-colors duration-300"
              style={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}
            >
              {darkMode ? <Sun className="w-6 h-6 text-primary-lighter" /> : <Moon className="w-6 h-6 text-primary-dark" />}
            </button>
          </div>
        </div>
      </div>
    </header>

    {!selectedRecipe && (
      <div className="text-white py-16 transition-colors duration-300" style={{ background: darkMode ? 'linear-gradient(to right, #1f2937, #7B4019)' : 'linear-gradient(to right, #7B4019, #FF7D29)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Discover Unique Flavors</h2>
          <p className="text-xl mb-8" style={{ color: darkMode ? '#FFBF78' : '#FFEEA9' }}>The best recipes for every occasion</p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full text-lg focus:outline-none focus:ring-4 shadow-lg transition-colors duration-300"
              style={{ 
                backgroundColor: darkMode ? '#374151' : '#ffffff',
                color: darkMode ? '#ffffff' : '#1f2937',
                border: darkMode ? '1px solid #4b5563' : 'none'
              }}
            />
          </div>
        </div>
      </div>
    )}

    <div className="max-w-7xl mx-auto px-4 py-8">
      {selectedRecipe ? (
        // Recipe Detail View
        <div>
          <button
            onClick={() => {
              setSelectedRecipe(null);
              setShowInstructions(false);
            }}
            className="mb-6 px-6 py-2 rounded-lg shadow-md transition-colors duration-300"
            style={{ 
              backgroundColor: darkMode ? '#FFBF78' : '#FF7D29',
              color: darkMode ? '#7B4019' : '#ffffff'
            }}
          >
            ← Back
          </button>
          
          <div className="rounded-2xl shadow-xl overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--color-bg-card)' }}>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img src={selectedRecipe.image} alt={selectedRecipe.title} className="w-full h-80 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                    <PlayCircle className="w-6 h-6" style={{ color: darkMode ? '#FFBF78' : '#FF7D29' }} />
                    Watch on YouTube Shorts
                  </h3>
                  <div className="aspect-[9/16] max-w-sm mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                    <iframe
                      width="100%"
                      height="100%"
                      src={selectedRecipe.videoUrl}
                      title="Recipe Video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-xs text-center mt-3" style={{ color: 'var(--color-text-secondary)' }}>
                    💡 Use format: https://www.youtube.com/embed/VIDEO_ID
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-4xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                      {selectedRecipe.title}
                    </h2>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium" style={{ 
                      backgroundColor: darkMode ? '#7B4019' : '#FFEEA9',
                      color: darkMode ? '#FFEEA9' : '#7B4019'
                    }}>
                      {selectedRecipe.category}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFavorite(selectedRecipe.id)}
                    className="p-2 rounded-full transition-colors duration-300"
                    style={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}
                  >
                    <Heart
                      className={`w-7 h-7 ${
                        favorites.includes(selectedRecipe.id)
                          ? darkMode ? 'fill-primary-light text-primary-light' : 'fill-primary-main text-primary-main'
                          : darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex gap-6 mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{selectedRecipe.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>{selectedRecipe.servings} servings</span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="px-4 py-2 rounded-lg font-medium" style={{ 
                    backgroundColor: darkMode ? '#7B4019' : '#FFEEA9',
                    color: darkMode ? '#FFEEA9' : '#7B4019'
                  }}>
                    Difficulty: {selectedRecipe.difficulty}
                  </span>
                </div>

                <div className="mb-6 p-4 rounded-lg border-l-4 transition-colors duration-300" style={{ 
                  backgroundColor: darkMode ? '#7B4019' : '#FFEEA9',
                  borderColor: darkMode ? '#FFBF78' : '#FF7D29'
                }}>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>About This Recipe</h3>
                  <p className="leading-relaxed" style={{ color: darkMode ? '#d1d5db' : '#374151' }}>{selectedRecipe.description}</p>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setShowInstructions(false)}
                    className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                    style={{
                      backgroundColor: !showInstructions 
                        ? (darkMode ? '#FFBF78' : '#FF7D29')
                        : (darkMode ? '#374151' : '#f3f4f6'),
                      color: !showInstructions
                        ? (darkMode ? '#7B4019' : '#ffffff')
                        : 'var(--color-text-secondary)'
                    }}
                  >
                    Ingredients
                  </button>
                  <button
                    onClick={() => setShowInstructions(true)}
                    className="flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-300"
                    style={{
                      backgroundColor: showInstructions 
                        ? (darkMode ? '#FFBF78' : '#FF7D29')
                        : (darkMode ? '#374151' : '#f3f4f6'),
                      color: showInstructions
                        ? (darkMode ? '#7B4019' : '#ffffff')
                        : 'var(--color-text-secondary)'
                    }}
                  >
                    Instructions
                  </button>
                </div>
                {!showInstructions ? (
                  <div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Ingredients</h3>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: darkMode ? '#FFBF78' : '#FF7D29' }} />
                          <span style={{ color: 'var(--color-text-secondary)' }}>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Instructions</h3>
                    <ol className="space-y-4">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ 
                            backgroundColor: darkMode ? '#FFBF78' : '#FF7D29',
                            color: darkMode ? '#7B4019' : '#ffffff'
                          }}>
                            {index + 1}
                          </span>
                          <p className="pt-1" style={{ color: 'var(--color-text-secondary)' }}>{instruction}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Recipe Grid View
        <div>
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-6 py-3 rounded-full font-medium transition-all duration-300 shadow"
                style={{
                  background: selectedCategory === category
                    ? (darkMode ? 'linear-gradient(to right, #FFBF78, #FFEEA9)' : 'linear-gradient(to right, #7B4019, #FF7D29)')
                    : (darkMode ? '#374151' : '#ffffff'),
                  color: selectedCategory === category
                    ? (darkMode ? '#7B4019' : '#ffffff')
                    : 'var(--color-text-primary)'
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map(recipe => (
              <div
                key={recipe.id}
                className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--color-bg-card)',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
                }}
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="relative">
                  <img src={recipe.image} alt={recipe.title} className="w-full h-56 object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                    className="absolute top-4 right-4 p-2 rounded-full shadow-lg hover:scale-110 transition"
                    style={{ backgroundColor: darkMode ? '#374151' : '#ffffff' }}
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        favorites.includes(recipe.id)
                          ? darkMode ? 'fill-primary-light text-primary-light' : 'fill-primary-main text-primary-main'
                          : darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    />
                  </button>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm" style={{ 
                      backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                      color: darkMode ? '#FFEEA9' : '#7B4019'
                    }}>
                      {recipe.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                    {recipe.title}
                  </h3>
                  
                  <div className="flex items-center justify-between" style={{ color: 'var(--color-text-secondary)' }}>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>{recipe.servings} serv.</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-16">
              <p className="text-2xl" style={{ color: 'var(--color-text-secondary)' }}>No recipes found</p>
            </div>
          )}
        </div>
      )}
    </div>

    <footer className="text-white mt-16 py-8 transition-colors duration-300" style={{ backgroundColor: 'var(--color-bg-footer)' }}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ChefHat className="w-8 h-8" style={{ color: darkMode ? '#FFEEA9' : '#FFBF78' }} />
          <h3 className="text-2xl font-bold">Malushin</h3>
        </div>
        <p style={{ color: darkMode ? '#9ca3af' : '#d1d5db' }}>Secret Recipes © 2025</p>
      </div>
    </footer>
  </div>
);
}