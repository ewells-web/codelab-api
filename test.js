const http = require('http');

const checks = [
  { path: '/users', expect: 200 },
  { path: '/users/1', expect: 200 },
  { path: '/users/99', expect: 404 },
  { path: '/products', expect: 200 },
];

let passed = 0;
let failed = 0;

function check(path, expectedStatus) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      const ok = res.statusCode === expectedStatus;
      console.log(`${ok ? 'PASS' : 'FAIL'} ${path} → ${res.statusCode} (expected ${expectedStatus})`);
      ok ? passed++ : failed++;
      resolve();
    }).on('error', (e) => {
      console.log(`FAIL ${path} → error: ${e.message}`);
      failed++;
      resolve();
    });
  });
}

(async () => {
  for (const c of checks) await check(c.path, c.expect);
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
})();
