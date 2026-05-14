async function testLongName() {
  const longName = 'A'.repeat(300);
  console.log(`🧪 Mencoba registrasi dengan nama panjang ${longName.length} karakter...`);

  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: longName,
        email: `longname_${Date.now()}@example.com`,
        password: 'password123'
      })
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));

    if (response.status === 500) {
      console.log('❌ Registrasi gagal dengan error 500 (Internal Server Error).');
    } else if (response.status === 200) {
      console.log('✅ Registrasi berhasil (Mungkin database melakukan truncate atau kolom mengizinkan data lebih panjang).');
    } else {
      console.log('ℹ️ Registrasi mengembalikan status lain.');
    }
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat melakukan request:', error);
  }
}

testLongName();
