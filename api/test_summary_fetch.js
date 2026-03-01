async function testSummaryAPI() {
    try {
        console.log('Registering user...');
        const regRes = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: `apisummarytest_${Date.now()}`,
                name: 'API Test Summary',
                email: `api-summary-test-${Date.now()}@example.com`,
                password: 'password'
            })
        });

        const regData = await regRes.json();
        const token = regData.token;

        console.log('Fetching summary...');
        const sumRes = await fetch('http://localhost:3000/api/budget/summary/2026-03', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const sumData = await sumRes.json();
        console.log('Summary status:', sumRes.status);
        console.log('Summary response:', sumData);

    } catch (e) {
        console.error('Fetch failed:', e);
    }
}
testSummaryAPI();
