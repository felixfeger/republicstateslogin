export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { token } = await request.json();

  const session = await db.prepare('SELECT * FROM sessions WHERE token = ?').bind(token).first();
  if (!session) return new Response(JSON.stringify({valid:false}), {status:200});

  const now = new Date();
  if (new Date(session.expires_at) < now) return new Response(JSON.stringify({valid:false}), {status:200});

  return new Response(JSON.stringify({valid:true, redirect: session.redirect_url}), {status:200});
}
