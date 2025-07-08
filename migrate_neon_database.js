// Migration script to update Neon database schema to match application code
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrateDatabase() {
  try {
    await client.connect();
    console.log('🔄 Starting database migration...\n');

    // 1. Update courses table columns
    console.log('📚 Updating courses table...');
    
    // Rename columns to match application expectations
    await client.query('ALTER TABLE courses RENAME COLUMN string_id TO course_code;');
    console.log('  ✅ Renamed string_id → course_code');
    
    await client.query('ALTER TABLE courses RENAME COLUMN title TO course_name;');
    console.log('  ✅ Renamed title → course_name');
    
    await client.query('ALTER TABLE courses RENAME COLUMN classroom_number TO room;');
    console.log('  ✅ Renamed classroom_number → room');
    
    await client.query('ALTER TABLE courses RENAME COLUMN maximum_capacity TO capacity;');
    console.log('  ✅ Renamed maximum_capacity → capacity');
    
    await client.query('ALTER TABLE courses RENAME COLUMN credit_hours TO credits;');
    console.log('  ✅ Renamed credit_hours → credits');
    
    await client.query('ALTER TABLE courses RENAME COLUMN tuition_cost TO fee;');
    console.log('  ✅ Renamed tuition_cost → fee');

    // 2. Update users table
    console.log('\n👥 Updating users table...');
    
    // Rename id to user_id
    await client.query('ALTER TABLE users RENAME COLUMN id TO user_id;');
    console.log('  ✅ Renamed id → user_id');
    
    // Add admin column
    await client.query('ALTER TABLE users ADD COLUMN admin BOOLEAN DEFAULT false;');
    console.log('  ✅ Added admin column');

    // 3. Verify the changes
    console.log('\n🔍 Verifying changes...');
    
    const coursesColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'courses' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📚 Updated courses columns:', coursesColumns.rows.map(r => r.column_name).join(', '));
    
    const usersColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('👥 Updated users columns:', usersColumns.rows.map(r => r.column_name).join(', '));
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error('Full error:', err);
  } finally {
    await client.end();
  }
}

migrateDatabase();
