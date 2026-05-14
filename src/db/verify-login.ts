async function verifyLogin() {
  const baseUrl = 'http://localhost:3000/api';
  
  console.log('🧪 Memulai verifikasi fitur login...');

  try {
    // 1. Registrasi User
    console.log('\nStep 1: Registrasi user baru...');
    const registerRes = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const registerData = await registerRes.json();
    console.log('Register Response:', registerData);

    // 2. Login Sukses
    console.log('\nStep 2: Login dengan kredensial benar...');
    const loginRes = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginRes.json();
    console.log('Login Response (Success):', loginData);

    // 3. Login Gagal (Password Salah)
    console.log('\nStep 3: Login dengan password salah...');
    const loginFailRes = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });
    
    const loginFailData = await loginFailRes.json();
    console.log('Login Response (Wrong Password):', loginFailData);

    // 4. Login Gagal (Email Tidak Ada)
    console.log('\nStep 4: Login dengan email tidak terdaftar...');
    const loginFailEmailRes = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'password123'
      })
    });
    
    const loginFailEmailData = await loginFailEmailRes.json();
    console.log('Login Response (Non-existent Email):', loginFailEmailData);

  } catch (error) {
    console.error('❌ Terjadi kesalahan saat pengujian:', error);
  }
}

verifyLogin();
