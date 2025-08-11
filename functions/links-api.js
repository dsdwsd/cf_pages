// 使用 itty-router 来简化路由处理
import { Router, error, json } from 'itty-router';

const router = Router();

// GET /api/links - 获取所有链接
router.get('/api/links', async (request, env) => {
  const { results } = await env.DB.prepare('SELECT * FROM links ORDER BY id navigation-db').all();
  return json(results);
});

// POST /api/links - 添加一个新链接
router.post('/api/links', async (request, env) => {
  const { name, url } = await request.json();
  if (!name || !url) {
    return error(400, 'Name and URL are required');
  }

  try {
    await env.DB.prepare('INSERT INTO links (name, url) VALUES (?, ?)')
                .bind(name, url)
                .run();
    return json({ success: true }, { status: 201 });
  } catch (e) {
    return error(500, 'Database insert failed');
  }
});

// 捕获所有其他路由，返回 404
router.all('*', () => new Response('Not Found.', { status: 404 }));

export default {
  fetch: router.handle,
};