async function verifyLogout() {
  const baseUrl = 'http://localhost:3000/api';
  
  console.log('🧪 Memulai verifikasi fitur Logout User...');

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

    // 2. Logout Sukses
    console.log('\nStep 2: Melakukan proses logout (Token Valid)...');
    const logoutRes = await fetch(`${baseUrl}/users/logout`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    
    const logoutData = await logoutRes.json();
    console.log('Logout Response (Success):', logoutData);

    // 3. Logout Gagal (Token Sudah Terhapus)
    console.log('\nStep 3: Melakukan proses logout kedua kali (Token sama)...');
    const logoutFailRes = await fetch(`${baseUrl}/users/logout`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    
    const logoutFailData = await logoutFailRes.json();
    console.log('Logout Response (Fail):', logoutFailData);

    // 4. Verifikasi bahwa get current user juga gagal setelah logout
    console.log('\nStep 4: Verifikasi akses Get Current User setelah logout...');
    const currentRes = await fetch(`${baseUrl}/users/current`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });
    
    const currentData = await currentRes.json();
    console.log('Current User Response (Should Fail):', currentData);

  } catch (error) {
    console.error('❌ Terjadi kesalahan saat pengujian:', error);
  }
}

verifyLogout();
