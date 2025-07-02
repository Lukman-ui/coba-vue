import { Hono } from 'hono'

const app = new Hono()

app.get('/api', (c) => {
  return c.text('hello');
})

// Root (untuk testing)
app.get('/', (c) => c.text('Halo dari backend Hono!'))

// API lama (optional)
app.get('/api/users', (c) => c.text('users route aktif'))

// API baru (untuk project kirim pesan)
app.get('/api/messages', async (c) => {
  const db = c.env.DB
  const { results } = await db.prepare('SELECT * FROM messages').all()
  return c.json(results)
})

app.post('/api/messages', async (c) => {
  const body = await c.req.json()
  const db = c.env.DB

  if (!body.name || !body.message) {
    return c.json({ error: 'Nama dan pesan wajib diisi' }, 400)
  }

  await db
    .prepare('INSERT INTO messages (name, message) VALUES (?, ?)')
    .bind(body.name, body.message)
    .run()

  return c.json({ success: true })
})

export default app
