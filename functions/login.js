import bcrypt from 'bcryptjs';

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { username, password, redirect } = await request.json();

  const user = await db.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
  if (!user) return new Response(JSON.stringify({success:false, message:'User not found'}), {status:400});

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return new Response(JSON.stringify({success:false, message:'Incorrect password'}), {status:400});

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 1000*60*60*24); // 24h session

  await db.prepare(
    'INSERT INTO sessions(user_id, token, redirect_url, expires_at) VALUES (?, ?, ?, ?)'
  ).bind(user.id, token, redirect, expires.toISOString()).run();

  return new Response(JSON.stringify({success:true, token, redirect}), {status:200});
}
