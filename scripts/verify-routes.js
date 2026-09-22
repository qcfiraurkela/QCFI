const http = require('http');

const routes = [
  { path: '/', expected: [200] },
  { path: '/events', expected: [200] },
  { path: '/quality-concepts', expected: [200] },
  { path: '/quality_concepts', expected: [200] },
  { path: '/quiz', expected: [200] },
  { path: '/magazine', expected: [200] },
  { path: '/admin/login', expected: [200] },
  { path: '/admin_login', expected: [200] },
  { path: '/admin/dashboard', expected: [307, 308, 302, 303, 200] },
  { path: '/admin_dashboard', expected: [307, 308, 302, 303, 200] },
  { path: '/admin_logout', expected: [307, 308, 302, 303] },
  { path: '/add_hero', expected: [307, 308, 302, 303] },
  { path: '/add_event', expected: [307, 308, 302, 303] },
  { path: '/add_concept', expected: [307, 308, 302, 303] },
  { path: '/add_quiz', expected: [307, 308, 302, 303] },
  { path: '/add_magazine', expected: [307, 308, 302, 303] },
  { path: '/delete_hero/999', expected: [307, 308, 302, 303, 200] },
  { path: '/delete_event/999', expected: [307, 308, 302, 303, 200] },
  { path: '/delete_concept/999', expected: [307, 308, 302, 303, 200] },
  { path: '/delete_quiz/999', expected: [307, 308, 302, 303, 200] },
  { path: '/delete_magazine/999', expected: [307, 308, 302, 303, 200] },
  { path: '/api/auth/check', expected: [200] },
  { path: '/api/hero', expected: [200] },
  { path: '/api/events', expected: [200] },
  { path: '/api/concepts', expected: [200] },
  { path: '/api/quizzes', expected: [200] },
  { path: '/api/magazines', expected: [200] },
];

const PORT = process.env.PORT || 3000;

async function checkRoute(route) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}${route.path}`, (res) => {
      const ok = route.expected.includes(res.statusCode);
      resolve({ path: route.path, status: res.statusCode, ok });
    });
    req.on('error', (err) => {
      resolve({ path: route.path, status: err.message, ok: false });
    });
    req.setTimeout(25000, () => {
      req.destroy();
      resolve({ path: route.path, status: 'TIMEOUT', ok: false });
    });
  });
}

async function run() {
  console.log(`Verifying all 27 routes on http://localhost:${PORT}...\n`);
  let allPass = true;
  for (const r of routes) {
    const res = await checkRoute(r);
    const mark = res.ok ? 'PASS' : 'FAIL';
    console.log(`[${mark}] ${res.path.padEnd(25)} → Status ${res.status}`);
    if (!res.ok) allPass = false;
  }
  console.log('\nResult:', allPass ? 'ALL 27 ROUTES PASSED!' : 'SOME ROUTES FAILED');
}

run();
