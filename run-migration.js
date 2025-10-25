/**
 * Simple migration script to add deletedAt column to vehicles table
 * Run this script to apply the soft delete migration to your Cloudflare D1 database
 */

const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🚀 Starting vehicle soft delete migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'migrations', 'add_vehicle_soft_delete.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration SQL:');
    console.log(migrationSQL);
    
    console.log('\n✅ Migration script ready!');
    console.log('📝 To apply this migration to your Cloudflare D1 database:');
    console.log('1. Copy the SQL above');
    console.log('2. Run it in your Cloudflare D1 database console');
    console.log('3. Or use Wrangler CLI: wrangler d1 execute DB_NAME --file=migrations/add_vehicle_soft_delete.sql');
    
    console.log('\n🎯 What this migration does:');
    console.log('- Adds deletedAt column to vehicles table');
    console.log('- Creates index for better performance');
    console.log('- Sets existing records to NULL (not deleted)');
    console.log('- Enables soft delete functionality');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
