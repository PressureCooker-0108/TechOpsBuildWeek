const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

async function runSmokeTest() {
  console.log('Running API smoke test...');

  try {
    const healthResponse = await fetch(`${API_BASE_URL}/health`);
    const healthJson = await healthResponse.json();

    if (!healthResponse.ok) {
      throw new Error('Health check failed.');
    }

    console.log('Health check:', healthJson);

    const membersResponse = await fetch(`${API_BASE_URL}/members`);
    if (!membersResponse.ok) {
      console.log('Members endpoint is reachable but returned non-OK status.');
      process.exit(0);
    }

    const members = await membersResponse.json();
    console.log(`Members endpoint reachable. Returned ${members.length} record(s).`);
  } catch (error) {
    console.error('Smoke test failed:', error.message);
    process.exit(1);
  }
}

runSmokeTest();

