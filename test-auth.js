// Simple authentication test script
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';

async function testAuth() {
  console.log('🧪 Testing GamePilot Authentication System...\n');

  try {
    const testUsername = `testuser${Date.now()}`;
    
    // Test 1: Register a new user
    console.log('1️⃣ Testing user registration...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: testUsername,
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123',
        displayName: 'Test User',
        timezone: 'UTC'
      })
    });

    const registerData = await registerResponse.json();
    console.log('Registration response:', registerResponse.status, registerData.success ? '✅' : '❌');
    
    if (!registerData.success) {
      console.log('Registration failed:', registerData.message);
      return;
    }

    const token = registerData.token;
    console.log('Token received:', token ? '✅' : '❌');

    // Test 2: Login with the new user
    console.log('\n2️⃣ Testing user login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: testUsername,
        password: 'testpassword123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginResponse.status, loginData.success ? '✅' : '❌');
    console.log('Login token received:', loginData.token ? '✅' : '❌');

    // Test 3: Get current user info
    console.log('\n3️⃣ Testing user profile retrieval...');
    const profileResponse = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const profileData = await profileResponse.json();
    console.log('Profile response:', profileResponse.status, profileData.success ? '✅' : '❌');
    
    if (profileData.success) {
      console.log('User ID:', profileData.data.id);
      console.log('Username:', profileData.data.username);
      console.log('Email:', profileData.data.email);
      console.log('Display Name:', profileData.data.displayName);
      console.log('Gaming Profile:', profileData.data.gamingProfile ? '✅' : '❌');
      console.log('Privacy Settings:', profileData.data.privacy ? '✅' : '❌');
      console.log('Preferences:', profileData.data.preferences ? '✅' : '❌');
    }

    // Test 4: Logout
    console.log('\n4️⃣ Testing logout...');
    const logoutResponse = await fetch(`${API_BASE}/auth/logout`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    const logoutData = await logoutResponse.json();
    console.log('Logout response:', logoutResponse.status, logoutData.success ? '✅' : '❌');

    console.log('\n🎉 Authentication system test completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testAuth();
