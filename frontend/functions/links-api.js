
/**
 * 处理所有发往 /api/links 的请求
 * @param {EventContext} context - 包含请求、环境等信息的上下文对象
 */
export async function onRequest(context) {
  // 从上下文中解构出需要的部分
  const { request, env } = context;

  // 根据请求的 HTTP 方法 (GET, POST 等) 来决定做什么
  switch (request.method) {
    case 'GET':
      return await handleGetRequest(env);
    case 'POST':
      return await handlePostRequest(request, env);
    default:
      return new Response('Method Not Allowed', { status: 405 });
  }
}

/**
 * 处理 GET 请求，返回所有链接
 */
async function handleGetRequest(env) {
  try {
    // env.DB 就是我们在 Pages 项目上绑定的 D1 数据库
    const { results } = await env.DB.prepare('SELECT * FROM links ORDER BY id DESC').all();
    // 使用 JSON.stringify 手动将结果转为 JSON 字符串
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response('Database query failed', { status: 500 });
  }
}

/**
 * 处理 POST 请求，添加新链接
 */
async function handlePostRequest(request, env) {
  try {
    const { name, url } = await request.json();
    if (!name || !url) {
      return new Response('Name and URL are required', { status: 400 });
    }

    await env.DB.prepare('INSERT INTO links (name, url) VALUES (?, ?)')
                .bind(name, url)
                .run();

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (e) {
    console.error(e);
    return new Response('Database insert failed', { status: 500 });
  }
}