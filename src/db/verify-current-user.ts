async function verifyCurrentUser() {
  const baseUrl = 'http://localhost:3000/api';
  
  console.log('🧪 Memulai verifikasi fitur Get Current User...');

  try {
    // 1. Login untuk mendapatkan token
    console.log('\nStep 1: Login untuk mendapatkan token...');
    const loginRes = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.data;
    console.log('Token didapat:', token);

    // 2. Ambil profil user saat ini (Sukses)
    console.log('\nStep 2: Mengambil profil user saat ini (Token Valid)...');
    const currentRes = await fetch(`${baseUrl}/users/current`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    
    const currentData = await currentRes.json();
    console.log('Current User Response (Success):', currentData);

    // 3. Ambil profil user saat ini (Token Salah)
    console.log('\nStep 3: Mengambil profil user saat ini (Token Salah)...');
    const currentFailRes = await fetch(`${baseUrl}/users/current`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer wrong-token` 
      }
    });
    
    const currentFailData = await currentFailRes.json();
    console.log('Current User Response (Wrong Token):', currentFailData);

    // 4. Ambil profil user saat ini (Tanpa Header)
    console.log('\nStep 4: Mengambil profil user saat ini (Tanpa Header)...');
    const currentNoAuthRes = await fetch(`${baseUrl}/users/current`, {
      method: 'GET'
    });
    
    const currentNoAuthData = await currentNoAuthRes.json();
    console.log('Current User Response (No Auth):', currentNoAuthData);

  } catch (error) {
    console.error('❌ Terjadi kesalahan saat pengujian:', error);
  }
}

verifyCurrentUser();
