import { kv } from '@vercel/kv';

export async function getRecipeStats(recipeId) {
  try {
    const views = await kv.get(`recipe:${recipeId}:views`) || 0;
    const likes = await kv.get(`recipe:${recipeId}:likes`) || 0;
    
    return {
      views: parseInt(views),
      likes: parseInt(likes)
    };
  } catch (error) {
    console.error('Error getting recipe stats:', error);
    return { views: 0, likes: 0 };
  }
}