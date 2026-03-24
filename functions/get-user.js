export async function onRequestPost({ request, env }) {
    const db = env.DB;
    const { token } = await request.json();

    const session = await db.prepare('SELECT * FROM sessions WHERE token = ?')
                      .bind(token)
                      .first();
    if (!session) return new Response(JSON.stringify({success:false}), {status:200});

    const user = await db.prepare('SELECT username FROM users WHERE id = ?')
                    .bind(session.user_id)
                    .first();

    return new Response(JSON.stringify({username: user.username}), {status:200});
}
