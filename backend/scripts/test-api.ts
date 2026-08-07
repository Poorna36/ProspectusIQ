import fs from 'fs';

async function testApi() {
  const baseUrl = 'http://localhost:3001';
  let accessToken = '';
  let filingId = '';

  const log = (msg: string) => console.log(`[TEST] ${msg}`);
  const error = (msg: string) => console.error(`[ERROR] ${msg}`);

  try {
    // 1. Wait for server to be up
    log('Waiting for server to boot...');
    await new Promise(r => setTimeout(r, 2000));

    // 2. Register a new user
    log('Testing POST /auth/register...');
    const registerRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test-${Date.now()}@prospectusiq.com`,
        password: 'password123',
        fullName: 'Test Promoter',
        role: 'PROMOTER',
        companyName: 'Test Corp'
      })
    });
    const registerData = await registerRes.json();
    if (!registerData.success) throw new Error(`Register failed: ${JSON.stringify(registerData)}`);
    log('✓ Register successful');

    // 3. Login
    log('Testing POST /auth/login...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: registerData.data.email,
        password: 'password123',
        otpCode: '123456'
      })
    });
    const loginData = await loginRes.json();
    if (!loginData.success) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    accessToken = loginData.data.accessToken;
    log('✓ Login successful');

    // 4. Create a filing
    log('Testing POST /filings...');
    const createFilingRes = await fetch(`${baseUrl}/filings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        companyName: 'Test Corp',
        cin: 'U12345MH2024PTC123456',
        sector: 'Technology'
      })
    });
    const createFilingData = await createFilingRes.json();
    if (!createFilingData.success) throw new Error(`Create Filing failed: ${JSON.stringify(createFilingData)}`);
    filingId = createFilingData.data.filingId;
    log(`✓ Create Filing successful (ID: ${filingId})`);

    // 5. Get Filing Details
    log('Testing GET /filings/:filingId...');
    const getFilingRes = await fetch(`${baseUrl}/filings/${filingId}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const getFilingData = await getFilingRes.json();
    if (!getFilingData.success) throw new Error(`Get Filing failed`);
    log('✓ Get Filing successful');

    // 6. Test Readiness Index (Enterprise route)
    log('Testing GET /filings/:filingId/readiness-index...');
    const readinessRes = await fetch(`${baseUrl}/filings/${filingId}/readiness-index`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const readinessData = await readinessRes.json();
    if (!readinessData.success) throw new Error(`Readiness Index failed`);
    log('✓ Readiness Index successful');

    // 7. Test Variables Reconcile (New Enterprise route)
    log('Testing GET /filings/:filingId/variables/reconcile...');
    const variablesRes = await fetch(`${baseUrl}/filings/${filingId}/variables/reconcile`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const variablesData = await variablesRes.json();
    if (!variablesData.success) throw new Error(`Variables Reconcile failed`);
    log('✓ Variables Reconcile successful');

    log('');
    log('All core API routes tested successfully! 🎉');
    process.exit(0);

  } catch (e: any) {
    error(e.message);
    process.exit(1);
  }
}

testApi();
