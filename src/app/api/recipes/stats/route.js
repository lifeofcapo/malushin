import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');

    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    // Получаем статистику из KV
    const views = await kv.get(`recipe:${recipeId}:views`) || 0;
    const likes = await kv.get(`recipe:${recipeId}:likes`) || 0;

    return NextResponse.json({
      views: parseInt(views),
      likes: parseInt(likes)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const recipeId = searchParams.get('recipeId');
    const userId = request.headers.get('user-id') || 'anonymous'; // Простая проверка
    
    if (!recipeId) {
      return NextResponse.json({ error: 'Recipe ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { type } = body;

    if (type === 'view') {
      await kv.incr(`recipe:${recipeId}:views`);
    } else if (type === 'like') {
      // Проверяем, не лайкал ли уже пользователь
      const hasLiked = await kv.get(`recipe:${recipeId}:liked:${userId}`);
      if (!hasLiked) {
        await kv.incr(`recipe:${recipeId}:likes`);
        await kv.set(`recipe:${recipeId}:liked:${userId}`, '1', { ex: 86400 }); // 24 часа
      }
    }

    // Возвращаем обновленную статистику
    const views = await kv.get(`recipe:${recipeId}:views`) || 0;
    const likes = await kv.get(`recipe:${recipeId}:likes`) || 0;

    return NextResponse.json({
      views: parseInt(views),
      likes: parseInt(likes)
    });
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}