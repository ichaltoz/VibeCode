import { db } from './index';
import { users } from './schema';

async function seedUser() {
  try {
    console.log('🌱 Memasukkan data user dummy...');
    
    const newUser = {
      name: 'Ichal Toz',
      email: 'ichal@example.com',
      password: 'password123', // Hanya untuk testing
    };

    const result = await db.insert(users).values(newUser);
    
    console.log('✅ Data user berhasil dimasukkan!');
    console.log('📊 Hasil insert:', result);
    
    // Ambil data user yang baru dimasukkan
    const allUsers = await db.select().from(users);
    console.log('👥 Daftar user saat ini:', allUsers);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal memasukkan data user:');
    console.error(error);
    process.exit(1);
  }
}

seedUser();
