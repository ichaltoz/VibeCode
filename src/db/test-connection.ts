import { db } from './index';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    console.log('🔄 Menghubungkan ke database...');
    
    const result = await db.execute(sql`SELECT 1 + 1 AS result`);
    
    // Mengecek database saat ini
    const dbNameResult = await db.execute(sql`SELECT DATABASE() AS db_name`);
    const dbName = (dbNameResult[0] as any)[0].db_name;
    
    console.log(`✅ Koneksi database berhasil!`);
    console.log(`📂 Database aktif: ${dbName}`);
    console.log('📊 Hasil query test (1+1):', (result[0] as any)[0].result);
    
    // Menampilkan daftar tabel
    const tablesResult = await db.execute(sql`SHOW TABLES`);
    console.log('📋 Daftar tabel:', tablesResult[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal terhubung ke database:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
