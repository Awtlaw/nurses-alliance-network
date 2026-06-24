import express from 'express';
import sql from '../utils/db.js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_nurses_alliance_jwt_key_change_me';

const requireAuth = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- CONTENT (SITE SETTINGS) ---
router.get('/content', async (req, res) => {
  try {
    const rows = await sql`SELECT key, value FROM site_settings ORDER BY key ASC`;
    const settings = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json({ settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put('/content', requireAuth, async (req, res) => {
  try {
    const { settings } = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await sql`
        INSERT INTO site_settings (key, value, updated_at) 
        VALUES (${key}, ${value}, NOW()) 
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      `;
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// --- INITIATIVES (PROJECTS) ---
router.get('/projects', async (req, res) => {
  try {
    const { status, featured, category } = req.query;
    let query = "SELECT * FROM initiatives WHERE 1=1";
    const values = [];
    let idx = 1;

    if (status) { query += ` AND status = $${idx++}`; values.push(status); }
    if (featured === "true") { query += ` AND featured = true`; }
    if (category) { query += ` AND category = $${idx++}`; values.push(category); }
    
    query += " ORDER BY sort_order ASC, created_at DESC";
    const rawProjects = await sql(query, values);
    
    const projects = rawProjects.map(p => {
      let parsedTags = [];
      if (p.tags) {
        try {
          const parsed = JSON.parse(p.tags);
          if (Array.isArray(parsed)) parsedTags = parsed;
        } catch {
          if (typeof p.tags === 'string') {
            parsedTags = p.tags.split(',').map(t => t.trim());
          }
        }
      }
      return { ...p, tags: parsedTags };
    });
    
    res.json({ projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch initiatives" });
  }
});

router.post('/projects', requireAuth, async (req, res) => {
  try {
    const b = req.body;
    const result = await sql`
      INSERT INTO initiatives (title, description, short_description, image_url, category, tags, status, featured, sort_order)
      VALUES (${b.title}, ${b.description}, ${b.short_description}, ${b.image_url}, ${b.category}, ${b.tags ? JSON.stringify(b.tags) : null}, ${b.status || 'published'}, ${b.featured || false}, ${b.sort_order || 0})
      RETURNING *
    `;
    res.json({ project: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create initiative" });
  }
});

router.put('/projects/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    if (Object.keys(req.body).length === 1 && req.body.featured !== undefined) {
      const result = await sql`UPDATE initiatives SET featured = ${req.body.featured} WHERE id = ${id} RETURNING *`;
      return res.json({ project: result[0] });
    }
    
    const b = req.body;
    const result = await sql`
      UPDATE initiatives 
      SET title=${b.title}, description=${b.description}, short_description=${b.short_description}, image_url=${b.image_url}, category=${b.category}, tags=${b.tags ? JSON.stringify(b.tags) : null}, status=${b.status || 'published'}, featured=${b.featured || false}, sort_order=${b.sort_order || 0} 
      WHERE id=${id} 
      RETURNING *
    `;
    res.json({ project: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update initiative" });
  }
});

router.delete('/projects/:id', requireAuth, async (req, res) => {
  try {
    await sql`DELETE FROM initiatives WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete initiative" });
  }
});

// --- MEDIA UPLOAD ---
router.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `http://localhost:5001/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- MEMBER SPOTLIGHTS (TESTIMONIALS) ---
router.get('/testimonials', async (req, res) => {
  try {
    const { status, featured } = req.query;
    let query = "SELECT * FROM member_spotlights WHERE 1=1";
    const values = [];
    let idx = 1;

    if (status) { query += ` AND status = $${idx++}`; values.push(status); }
    if (featured === "true") { query += ` AND featured = true`; }
    
    query += " ORDER BY sort_order ASC, created_at DESC";
    const testimonials = await sql(query, values);
    res.json({ testimonials });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch spotlights" });
  }
});

router.post('/testimonials', requireAuth, async (req, res) => {
  try {
    const b = req.body;
    const result = await sql`
      INSERT INTO member_spotlights (rating, content, member_name, member_title, workplace_facility, status, featured, sort_order)
      VALUES (${b.rating || 5}, ${b.content}, ${b.member_name}, ${b.member_title}, ${b.workplace_facility}, ${b.status || 'published'}, ${b.featured || false}, ${b.sort_order || 0}) 
      RETURNING *
    `;
    res.json({ testimonial: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/testimonials/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    if (Object.keys(req.body).length === 1 && req.body.featured !== undefined) {
      const result = await sql`UPDATE member_spotlights SET featured = ${req.body.featured} WHERE id = ${id} RETURNING *`;
      return res.json({ testimonial: result[0] });
    }
    const b = req.body;
    const result = await sql`
      UPDATE member_spotlights 
      SET rating=${b.rating || 5}, content=${b.content}, member_name=${b.member_name}, member_title=${b.member_title}, workplace_facility=${b.workplace_facility}, status=${b.status || 'published'}, featured=${b.featured || false}, sort_order=${b.sort_order || 0} 
      WHERE id=${id} 
      RETURNING *
    `;
    res.json({ testimonial: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/testimonials/:id', requireAuth, async (req, res) => {
  try {
    await sql`DELETE FROM member_spotlights WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete spotlight" });
  }
});

// --- PROGRAMS (SERVICES) ---
router.get('/services', async (req, res) => {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM programs WHERE 1=1";
    const values = [];
    if (status) { query += ` AND status = $1`; values.push(status); }
    query += " ORDER BY sort_order ASC, created_at DESC";
    
    const services = await sql(query, values);
    res.json({ services });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

router.post('/services', requireAuth, async (req, res) => {
  try {
    const b = req.body;
    const result = await sql`
      INSERT INTO programs (icon, title, short_description, features, status, sort_order)
      VALUES (${b.icon}, ${b.title}, ${b.short_description}, ${b.features ? JSON.stringify(b.features) : null}, ${b.status || 'published'}, ${b.sort_order || 0}) 
      RETURNING *
    `;
    res.json({ service: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/services/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const b = req.body;
    const result = await sql`
      UPDATE programs 
      SET icon=${b.icon}, title=${b.title}, short_description=${b.short_description}, features=${b.features ? JSON.stringify(b.features) : null}, status=${b.status || 'published'}, sort_order=${b.sort_order || 0} 
      WHERE id=${id} 
      RETURNING *
    `;
    res.json({ service: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/services/:id', requireAuth, async (req, res) => {
  try {
    await sql`DELETE FROM programs WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete program" });
  }
});

// --- PRICING PACKAGES (MEMBERSHIPS) ---
router.get('/pricing', async (req, res) => {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM membership_packages WHERE 1=1";
    const values = [];
    if (status) { query += ` AND status = $1`; values.push(status); }
    query += " ORDER BY sort_order ASC";
    
    const pricing = await sql(query, values);
    res.json({ packages: pricing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch membership packages" });
  }
});

router.post('/pricing', requireAuth, async (req, res) => {
  try {
    const b = req.body;
    const result = await sql`
      INSERT INTO membership_packages (name, price, features, status, sort_order)
      VALUES (${b.name}, ${b.price}, ${b.features ? JSON.stringify(b.features) : null}, ${b.status || 'published'}, ${b.sort_order || 0}) 
      RETURNING *
    `;
    res.json({ package: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/pricing/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const b = req.body;
    const result = await sql`
      UPDATE membership_packages 
      SET name=${b.name}, price=${b.price}, features=${b.features ? JSON.stringify(b.features) : null}, status=${b.status || 'published'}, sort_order=${b.sort_order || 0} 
      WHERE id=${id} 
      RETURNING *
    `;
    res.json({ package: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/pricing/:id', requireAuth, async (req, res) => {
  try {
    await sql`DELETE FROM membership_packages WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete membership package" });
  }
});

// --- BLOG POSTS ---
router.get('/blog', async (req, res) => {
  try {
    const { status } = req.query;
    let query = "SELECT * FROM blog_posts WHERE 1=1";
    const values = [];
    if (status) { query += ` AND status = $1`; values.push(status); }
    query += " ORDER BY created_at DESC";
    
    const rawPosts = await sql(query, values);
    
    res.json({ posts: rawPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

router.post('/blog', requireAuth, async (req, res) => {
  try {
    const b = req.body;
    const result = await sql`
      INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, status, published_at)
      VALUES (${b.title}, ${b.slug}, ${b.excerpt}, ${b.content}, ${b.cover_image}, ${b.status || 'draft'}, ${b.status === 'published' ? new Date() : null}) 
      RETURNING *
    `;
    res.json({ post: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/blog/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const b = req.body;
    const result = await sql`
      UPDATE blog_posts 
      SET title=${b.title}, slug=${b.slug}, excerpt=${b.excerpt}, content=${b.content}, cover_image=${b.cover_image}, status=${b.status || 'draft'}, published_at=COALESCE(published_at, ${b.status === 'published' ? new Date() : null}) 
      WHERE id=${id} 
      RETURNING *
    `;
    res.json({ post: result[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/blog/:id', requireAuth, async (req, res) => {
  try {
    await sql`DELETE FROM blog_posts WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- CONTACT INQUIRIES ---
router.get('/contact', requireAuth, async (req, res) => {
  try {
    const inquiries = await sql`SELECT * FROM contact_inquiries ORDER BY created_at DESC`;
    res.json({ inquiries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch inquiries" });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message, inquiry_type } = req.body;
    await sql`
      INSERT INTO contact_inquiries (name, email, subject, message, inquiry_type, status) 
      VALUES (${name}, ${email}, ${subject}, ${message}, ${inquiry_type}, 'new')
    `;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit inquiry" });
  }
});

router.delete('/contact/:id', requireAuth, async (req, res) => {
  try {
    await sql`DELETE FROM contact_inquiries WHERE id = ${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
     console.error(err);
     res.status(500).json({ error: "Failed to delete inquiry" });
  }
});

export default router;
