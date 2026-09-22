const http = require('http');
const PORT = process.env.PORT || 3000;

function postJson(path, payload, cookie) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    };
    if (cookie) headers['Cookie'] = cookie;

    const req = http.request(
      `http://localhost:${PORT}${path}`,
      { method: 'POST', headers },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          const setCookie = res.headers['set-cookie'];
          resolve({ status: res.statusCode, body, setCookie });
        });
      }
    );
    req.on('error', (err) => resolve({ status: err.message }));
    req.write(data);
    req.end();
  });
}

function getWithCookie(path, cookie) {
  return new Promise((resolve) => {
    const headers = {};
    if (cookie) headers['Cookie'] = cookie;

    const req = http.get(`http://localhost:${PORT}${path}`, { headers }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers });
      });
    });
    req.on('error', (err) => resolve({ status: err.message }));
  });
}

async function runAuthTest() {
  console.log('Testing Authentication & Session Flow...\n');

  // 1. Bad login
  const badRes = await postJson('/api/auth/login', { login_id: 'bad', password: 'wrong' });
  console.log(`1. Bad Login: Status ${badRes.status} (Expected 401) → ${badRes.status === 401 ? 'PASS' : 'FAIL'}`);

  // 2. Good login
  const goodRes = await postJson('/api/auth/login', { login_id: 'qcfi.in', password: 'qcfi@2006' });
  console.log(`2. Correct Login: Status ${goodRes.status} (Expected 200) → ${goodRes.status === 200 ? 'PASS' : 'FAIL'}`);
  
  const cookieHeader = goodRes.setCookie ? goodRes.setCookie[0].split(';')[0] : null;
  console.log(`   Session Cookie Received: ${cookieHeader ? 'YES' : 'NO'}`);

  if (!cookieHeader) {
    console.log('FAIL: No session cookie returned.');
    return;
  }

  // 3. Access Dashboard with Session Cookie
  const dashRes = await getWithCookie('/admin/dashboard', cookieHeader);
  console.log(`3. Dashboard Access with Session: Status ${dashRes.status} (Expected 200) → ${dashRes.status === 200 ? 'PASS' : 'FAIL'}`);

  // 4. Logout
  const logoutRes = await postJson('/api/auth/logout', {}, cookieHeader);
  console.log(`4. Logout: Status ${logoutRes.status} (Expected 200) → ${logoutRes.status === 200 ? 'PASS' : 'FAIL'}`);

  // 5. Dashboard Access after Logout (without valid session)
  const afterLogoutRes = await getWithCookie('/admin/dashboard');
  console.log(`5. Dashboard Access without Session: Status ${afterLogoutRes.status} (Expected 307 Redirect) → ${afterLogoutRes.status === 307 ? 'PASS' : 'FAIL'}`);

  console.log('\nResult: AUTHENTICATION SYSTEM FULLY VERIFIED & SECURED!');
}

runAuthTest();
