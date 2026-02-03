// Debug script to test authentication endpoints
// Run this in browser console on http://localhost:3002

async function testAuthEndpoints() {
  console.log('🧪 Testing Authentication Endpoints...\n');
  
  const baseUrl = 'http://localhost:3001'; // API server
  
  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing Registration...');
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    const registerResult = await registerResponse.json();
    console.log('Register Status:', registerResponse.status);
    console.log('Register Result:', registerResult);
    console.log('Cookies:', document.cookie);
    console.log('');
    
    // Test 2: Login with the same user
    console.log('2️⃣ Testing Login...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123',
        password: 'password123'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Result:', loginResult);
    console.log('Cookies after login:', document.cookie);
    console.log('');
    
    // Test 3: Get current user
    console.log('3️⃣ Testing Current User...');
    const userResponse = await fetch(`${baseUrl}/api/auth/me`, {
      method: 'GET',
      credentials: 'include'
    });
    
    const userResult = await userResponse.json();
    console.log('User Status:', userResponse.status);
    console.log('User Result:', userResult);
    console.log('');
    
    // Test 4: Test Steam login redirect
    console.log('4️⃣ Testing Steam Login URL...');
    console.log('Steam Login URL:', `${baseUrl}/api/auth/steam`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test API connectivity
async function testApiConnectivity() {
  console.log('🔗 Testing API Connectivity...');
  
  try {
    const response = await fetch('http://localhost:3001/api/health');
    console.log('Health Check Status:', response.status);
    const result = await response.json();
    console.log('Health Check Result:', result);
  } catch (error) {
    console.error('❌ API not reachable:', error);
  }
}

// Run tests
console.log('🚀 Starting Authentication Debug Tests\n');
testApiConnectivity();
console.log('');
testAuthEndpoints();
