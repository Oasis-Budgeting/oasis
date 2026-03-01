async function testGroupAPI() {
    try {
        console.log('Registering user...');
        const regRes = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: `apigrouptest_${Date.now()}`,
                name: 'API Test Group Creation',
                email: `api-group-test-${Date.now()}@example.com`,
                password: 'password'
            })
        });

        const regData = await regRes.json();
        console.log('Registration:', regData);

        if (!regData.token) {
            console.error('Failed to get token');
            process.exit(1);
        }

        console.log('Creating group...');
        const grpRes = await fetch('http://localhost:3000/api/category-groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${regData.token}`
            },
            body: JSON.stringify({ name: 'Fetch Test Group' })
        });

        const grpData = await grpRes.json();
        console.log('Group status:', grpRes.status);
        console.log('Group response:', grpData);

        console.log('Creating category...');
        const catRes = await fetch('http://localhost:3000/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${regData.token}`
            },
            body: JSON.stringify({ group_id: grpData.id, name: 'Fetch Test Category' })
        });

        const catData = await catRes.json();
        console.log('Category status:', catRes.status);
        console.log('Category response:', catData);

        console.log('Deleting category...');
        const delRes = await fetch(`http://localhost:3000/api/categories/${catData.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${regData.token}`
            }
        });

        const delData = await delRes.json();
        console.log('Delete status:', delRes.status);
        console.log('Delete response:', delData);

    } catch (e) {
        console.error('Fetch failed:', e);
    }
}
testGroupAPI();
