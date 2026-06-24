import sql from './utils/db.js';
import bcrypt from 'bcrypt';

async function migrate() {
  console.log("Starting Nurses Alliance Network database migration...");
  try {
    // 1. Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ users table ready");

    // 2. Site Settings table
    await sql`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ site_settings table ready");

    // 3. Initiatives table (Projects)
    await sql`
      CREATE TABLE IF NOT EXISTS initiatives (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        short_description VARCHAR(500),
        image_url TEXT,
        category VARCHAR(100),
        tags TEXT,
        status VARCHAR(50) DEFAULT 'published',
        featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ initiatives table ready");

    // 4. Programs table (Services)
    await sql`
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        short_description TEXT,
        features JSONB,
        status VARCHAR(50) DEFAULT 'published',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ programs table ready");

    // 5. Member Spotlights table (Testimonials)
    await sql`
      CREATE TABLE IF NOT EXISTS member_spotlights (
        id SERIAL PRIMARY KEY,
        rating INTEGER DEFAULT 5,
        content TEXT NOT NULL,
        member_name VARCHAR(255) NOT NULL,
        member_title VARCHAR(255),
        workplace_facility VARCHAR(255),
        status VARCHAR(50) DEFAULT 'published',
        featured BOOLEAN DEFAULT false,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ member_spotlights table ready");

    // 6. Membership Packages table (Pricing)
    await sql`
      CREATE TABLE IF NOT EXISTS membership_packages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10,2),
        features JSONB,
        status VARCHAR(50) DEFAULT 'published',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ membership_packages table ready");

    // 7. Contact Inquiries table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        inquiry_type VARCHAR(100),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ contact_inquiries table ready");

    // 8. Blog Posts table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT,
        cover_image TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ blog_posts table ready");

    // Seed default admin user if not exists
    const adminEmail = 'admin@nursesalliancenetwork.org';
    const existingAdmins = await sql`SELECT id FROM users WHERE email = ${adminEmail}`;
    if (existingAdmins.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await sql`
        INSERT INTO users (name, email, password, role)
        VALUES ('NAN Administrator', ${adminEmail}, ${hashedPassword}, 'admin')
      `;
      console.log("🚀 Default admin user seeded (admin@nursesalliancenetwork.org / admin123)");
    }

    // Seed default site settings if empty
    const defaultSettings = {
      'site_title': 'Nurses Alliance Network',
      'hero_headline': 'Empowering Nurses, Advancing Health, Building Community',
      'hero_subheadline': 'We are a dedicated professional network supporting nurses with continuing education, career resources, advocacy, and collaborative health campaigns.',
      'hero_cta_text': 'Join the Alliance',
      'hero_cta_url': '/pricing',
      'hero_secondary_cta_text': 'Our Initiatives',
      'hero_secondary_cta_url': '/portfolio',
      'about_description': 'The Nurses Alliance Network (NAN) is a premier professional organization that brings together registered nurses, nurse practitioners, and students to collaborate, learn, and grow together.',
      'about_stat_1_value': '5,000+',
      'about_stat_1_label': 'Active Members',
      'about_stat_2_value': '94%',
      'about_stat_2_label': 'Retention Rate',
      'about_stat_3_value': '50+',
      'about_stat_3_label': 'Continuing Education Hours',
      'about_stat_4_value': '15+',
      'about_stat_4_label': 'Advocacy Campaigns',
    };

    for (const [key, value] of Object.entries(defaultSettings)) {
      await sql`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES (${key}, ${value}, NOW())
        ON CONFLICT (key) DO NOTHING
      `;
    }
    console.log("🚀 Default site settings seeded");

    console.log("🎉 All migrations completed successfully!");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
