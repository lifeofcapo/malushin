"use client";

import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Users, Search, Heart, PlayCircle, Sun, Moon, Eye } from 'lucide-react';
import '@/styles/styles.css';

const categories = ["All", "Favorites", "Soups", "Main Dishes", "Desserts", "Salads", "Breakfast", "Appetizers", "Sauces", "Snacks", "Side Dishes", "Baking"];

export default function MalushinRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [playCardsAnimation, setPlayCardsAnimation] = useState(true);
  const [recipeStats, setRecipeStats] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());

useEffect(() => {
  fetch('/recipes.json')
    .then(res => {
      if (!res.ok) throw new Error(`Failed to fetch recipes.json (${res.status})`);
      return res.json();
    })
    .then(data => setRecipes(data))
    .catch(err => console.error('Error loading recipes:', err));
}, []);

const trackView = async (recipeId) => {
  try {
    const res = await fetch(`/api/recipes/stats?recipeId=${recipeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'view' })
    });
    
    if (res.ok) {
      const stats = await res.json();
      setRecipeStats(prev => ({ ...prev, [recipeId]: stats }));
    }
  } catch (error) {
    console.error('Error tracking view:', error);
  }
};

const handleLike = async (recipeId, e) => {
  if (e) e.stopPropagation();
  
  try {
    const res = await fetch(`/api/recipes/stats?recipeId=${recipeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'like' })
    });
    
    if (res.ok) {
      const stats = await res.json();
      setRecipeStats(prev => ({ ...prev, [recipeId]: stats }));
      setUserLikes(prev => new Set([...prev, recipeId]));
    }
  } catch (error) {
    console.error('Error updating like:', error);
  }
};

  useEffect(() => {
    const loadAllStats = async () => {
      if (recipes.length === 0) return;
      
      const statsPromises = recipes.map(async (recipe) => {
        try {
          const res = await fetch(`/api/recipes/stats?recipeId=${recipe.id}`);
          if (res.ok) {
            const stats = await res.json();
            return [recipe.id, stats];
          }
        } catch (error) {
          console.error(`Error loading stats for ${recipe.id}:`, error);
        }
        return [recipe.id, { views: 0, likes: 0 }];
      });
      
      const statsResults = await Promise.all(statsPromises);
      const statsObj = Object.fromEntries(statsResults);
      setRecipeStats(statsObj);
    };

    loadAllStats();
  }, [recipes]);

  const handleRecipeSelect = (recipe) => {
    setSelectedRecipe(recipe);
    trackView(recipe.id);
  };

const filteredRecipes = recipes.filter(recipe => {
  const matchesCategory = 
    selectedCategory === "All" || 
    (selectedCategory === "Favorites" ? favorites.includes(recipe.id) : recipe.category === selectedCategory);
  const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesCategory && matchesSearch;
});


useEffect(() => {
  const base = 500; 
  const perItem = 100; 
  const items = Math.min(filteredRecipes.length || 6, 12);
  const totalMs = base + items * perItem + 150; 

  const t = setTimeout(() => setPlayCardsAnimation(false), totalMs);
  return () => clearTimeout(t);
}, []); 
useEffect(() => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setDarkMode(isDark);
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  }
  
  setTimeout(() => setIsLoaded(true), 100);
}, []);

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [darkMode]);

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

if (recipes.length === 0) {
  return (
    <div className="min-h-screen flex items-center justify-center text-lg text-gray-500 dark:text-gray-400">
      Loading recipes...
    </div>
  );
}

return (
  <div className="min-h-screen transition-all duration-700 ease-in-out" style={{ background: darkMode ? 'linear-gradient(to bottom right, #1f2937, #111827, #1f2937)' : 'linear-gradient(to bottom right, #FFEEA9, #ffffff, #FFBF78)' }}>
    <header className={`sticky top-0 z-50 shadow-md transition-all duration-300 ${isLoaded ? 'animate-fade-in-down' : 'opacity-0'}`} style={{ backgroundColor: 'var(--color-bg-header)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-10 h-10" style={{ color: darkMode ? '#FFEEA9' : '#FFBF78' }} />
            <h1 className="text-4xl font-bold" style={{ color: darkMode ? '#FFEEA9' : '#FFBF78' }}>
              Malushin
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <p className="hidden md:block" style={{ color: 'var(--color-text-secondary)' }}>Secret Recipes</p>
<div
  onClick={toggleDarkMode}
  className="toggle-switch"
  role="button"
  aria-label="Toggle dark mode"
>
  <Sun className="toggle-icon toggle-icon-left text-yellow-400" />
  <Moon className="toggle-icon toggle-icon-right text-white-200" />
  <div className="toggle-slider"></div>
</div>


          </div>
        </div>
      </div>
    </header>

    {!selectedRecipe && (
      <div className={`text-white py-16 transition-colors duration-300 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`} style={{ background: darkMode ? 'linear-gradient(to right, #1f2937, #7B4019)' : 'linear-gradient(to right, #7B4019, #FF7D29)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: isLoaded ? 1 : 0 }}>Discover Unique Flavors</h2>
          <p className="text-xl mb-8 animate-fade-in-up" style={{ color: darkMode ? '#FFBF78' : '#FFEEA9', animationDelay: '0.3s', opacity: isLoaded ? 1 : 0 }}>The best recipes for every occasion</p>
          
          <div className="max-w-2xl mx-auto relative animate-scale-in" style={{ animationDelay: '0.4s', opacity: isLoaded ? 1 : 0 }}>
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full text-lg focus:outline-none focus:ring-4 shadow-lg search-focus transition-all duration-300"
              style={{ 
                backgroundColor: darkMode ? '#374151' : '#ffffff',
                color: darkMode ? '#ffffff' : '#1f2937',
                border: darkMode ? '1px solid #4b5563' : 'none',
                boxShadow: darkMode ? '0 10px 30px rgba(0, 0, 0, 0.3)' : '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
        </div>
      </div>
    )}

    <div className="max-w-7xl mx-auto px-4 py-8">
      {selectedRecipe ? (
        <div>
          <button
            onClick={() => {
              setSelectedRecipe(null);
              setShowInstructions(false);
            }}
            className="mb-6 px-6 py-2 rounded-lg shadow-md button-hover transition-all duration-300"
            style={{ 
              backgroundColor: darkMode ? '#FFBF78' : '#FF7D29',
              color: darkMode ? '#7B4019' : '#ffffff'
            }}
          >
            ← Back
          </button>
          
          <div className="rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300 animate-scale-in" style={{ backgroundColor: 'var(--color-bg-card)' }}>
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
                    💡 Subscribe to YouTube channel for more!
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
                    className="p-2 rounded-full transition-all duration-300 heart-beat button-hover"
                    style={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}
                  >
                    <Heart
                      className={`w-7 h-7 transition-all duration-300 ${
                        favorites.includes(selectedRecipe.id)
                          ? 'fill-red-500 text-red-500'
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
                    <span>{(recipeStats[selectedRecipe.id]?.likes || 0)} likes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>{(recipeStats[selectedRecipe.id]?.views || 0)} views</span>
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
                    className="flex-1 py-2 px-4 rounded-lg font-medium button-hover transition-all duration-300"
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
                    className="flex-1 py-2 px-4 rounded-lg font-medium button-hover transition-all duration-300"
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
        <div>
          <div className={`flex flex-wrap gap-3 mb-8 justify-center ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            {categories.map((category, index) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-6 py-3 rounded-full font-medium button-hover transition-all duration-300 shadow-md"
                style={{
                  background: selectedCategory === category
                    ? (darkMode ? 'linear-gradient(to right, #FFBF78, #FFEEA9)' : 'linear-gradient(to right, #7B4019, #FF7D29)')
                    : (darkMode ? '#374151' : '#ffffff'),
                  color: selectedCategory === category
                    ? (darkMode ? '#7B4019' : '#ffffff')
                    : 'var(--color-text-primary)',
                  animationDelay: `${0.3 + index * 0.05}s`,
                  opacity: isLoaded ? 1 : 0
                }}
              >
                {category}
              </button>
            ))}
          </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {filteredRecipes.map((recipe, index) => {
    const delay = `${0.15 + index * 0.08}s`;
    const entryClass = playCardsAnimation ? 'card-entry play' : 'card-visible';
    const stats = recipeStats[recipe.id] || { views: 0, likes: 0 };
    const isLikedByUser = userLikes.has(recipe.id);

  return (
    <div
      key={recipe.id}
      className={`rounded-2xl shadow-lg overflow-hidden card-hover transition-all duration-300 cursor-pointer ${entryClass}`}
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
        ['--entry-delay']: delay
      }}
      onClick={() => handleRecipeSelect(recipe)}
    >
        <div className="relative">
          <img src={recipe.image} alt={recipe.title} className="w-full h-56 object-cover" />
          <button
            onClick={(e) => handleLike(recipe.id, e)}
            className="absolute top-4 right-4 p-2 rounded-full shadow-lg button-hover heart-beat transition-all duration-300"
            style={{ backgroundColor: darkMode ? '#374151' : '#ffffff' }}
          >
            <Heart
              className={`w-6 h-6 transition-all duration-300 ${
                isLikedByUser
                  ? 'fill-red-500 text-red-500'
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
        
          <div className="flex items-center justify-between mb-3" style={{ color: 'var(--color-text-secondary)' }}>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{recipe.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{stats.likes} likes</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <Eye className="w-4 h-4" />
            <span>{stats.views} views</span>
          </div>
        </div>
      </div>
    );
  })}

    </div>
          {filteredRecipes.length === 0 && (
            <div className="text-center py-16">
              <p className="text-2xl" style={{ color: 'var(--color-text-secondary)' }}>No recipes found</p>
            </div>
          )}
        </div>
      )}
    </div>

      <section
    className="w-full py-20 mt-16 transition-colors duration-500"
    style={{
      background: darkMode
        ? "linear-gradient(to right, #111827, #1f2937)"
        : "linear-gradient(to right, #FFF4D2, #FFD28F)",
    }}
  >
    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
      <div className="overflow-hidden rounded-2xl shadow-2xl" style={{ height: 620, maxHeight: '70vh' }}>
        <img
          src="/photo.jpg"
          alt="YouTube Channel"
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          style={{ display: 'block' }}
        />
      </div>
      <div className="space-y-6">
        <h2
          className="text-4xl font-bold"
          style={{ color: darkMode ? "#FFEEA9" : "#7B4019" }}
        >
          Watch and Cook with <br/> Roman Malushin 🍳
        </h2>
        <p
          className="text-lg leading-relaxed"
          style={{ color: darkMode ? "#d1d5db" : "#374151" }}
        >
          On my YouTube channel, I share quick, creative, and easy-to-follow
          recipes — from hearty breakfasts to elegant dinners. Each video is
          crafted to inspire you to cook with passion and experiment with flavors.
        </p>
        <p
          className="text-lg"
          style={{ color: darkMode ? "#FFBF78" : "#7B4019" }}
        >
          🎥 Subscribe and join our cooking family!
        </p>
        <a
          href="https://www.youtube.com/@themalushin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 rounded-full font-semibold shadow-lg button-hover transition-all duration-300"
          style={{
            backgroundColor: darkMode ? "#FFBF78" : "#FF7D29",
            color: darkMode ? "#7B4019" : "#ffffff",
          }}
        >
          Visit YouTube Channel →
        </a>
      </div>
    </div>
  </section>

    <footer className="text-white mt-0 py-8 transition-colors duration-300" style={{ backgroundColor: 'var(--color-bg-footer)' }}>
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ChefHat className="w-8 h-8" style={{ color: darkMode ? '#FFEEA9' : '#FFBF78' }} />
          <h3 className="text-2xl font-bold">Malushin</h3>
        </div>
        <p style={{ color: darkMode ? '#9ca3af' : '#d1d5db' }}> All Rights Reserved © 2025</p>
      </div>
    </footer>
  </div>
);
}