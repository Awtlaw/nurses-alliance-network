import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import sql from '../utils/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_nurses_alliance_jwt_key_change_me';

const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again after 15 minutes.' }
});

const requireAuth = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /api/auth/login
router.post('/login', sensitiveLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || 'admin', name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/forgot-password (mock/dev helper)
router.post('/forgot-password', sensitiveLimiter, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    if (rows.length === 0) {
      return res.json({ success: true, message: 'If an account exists, a reset link has been generated.' });
    }

    const user = rows[0];
    const secret = JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user.id }, secret, { expiresIn: '15m' });
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4000';
    const resetLink = `${frontendUrl}/account/reset-password?id=${user.id}&token=${token}`;

    console.log('--- PASSWORD RESET SYSTEM (NAN) ---');
    console.log(`To reset the password for ${user.email}, use this URL:`);
    console.log(resetLink);
    console.log('-----------------------------------');

    res.json({ success: true, message: 'If an account exists, a reset link has been generated in your server log.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', sensitiveLimiter, async (req, res) => {
  try {
    const { id, token, newPassword } = req.body;
    if (!id || !token || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Valid ID, token, and 8+ char password required' });
    }

    const rows = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid token or user' });

    const user = rows[0];
    const secret = JWT_SECRET + user.password;

    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${id}`;

    res.json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ error: 'Valid current password and 8+ char new password required' });
    }

    const rows = await sql`SELECT password FROM users WHERE id = ${req.user.id} LIMIT 1`;
    if (rows.length === 0) return res.status(401).json({ error: 'User not found' });

    const match = await bcrypt.compare(currentPassword, rows[0].password);
    if (!match) return res.status(401).json({ error: 'Incorrect current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${req.user.id}`;

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
});

export default router;
