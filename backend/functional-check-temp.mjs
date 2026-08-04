import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
const errors = [];
const consoleErrors = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', (err) => errors.push(err.message));
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

await page.goto(`${BASE}/connexion`, { waitUntil: 'networkidle' });
await page.fill('input[name="username"]', 'admin');
await page.fill('input[name="password"]', 'ChangeMe123!');
await page.getByRole('button', { name: 'Se connecter' }).click();
await page.waitForURL('**/students', { timeout: 8000 }).catch(() => {});

await page.evaluate(() => { window.__navMarker = 'still-here'; });
await page.getByRole('link', { name: 'Moniteurs' }).click();
await page.waitForURL('**/instructors', { timeout: 5000 }).catch(() => {});
const spaNav = await page.evaluate(() => window.__navMarker) === 'still-here';
console.log(`${spaNav ? 'OK  ' : 'FAIL'} - Navigation SPA (pas de rechargement complet)`);

const activeClass = await page.locator('a.nav-item-link.active').count();
console.log(`${activeClass > 0 ? 'OK  ' : 'FAIL'} - Lien actif a bien la classe .active`);

await page.goto(`${BASE}/students`, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: 'Ajouter un étudiant' }).click();
await page.waitForTimeout(500);
const invalidCount = await page.locator('.form-control.is-invalid').count();
console.log(`${invalidCount > 0 ? 'OK  ' : 'FAIL'} - Validation affiche is-invalid sur formulaire vide (${invalidCount} champs)`);

await page.fill('input[placeholder="Entrez le nom ou le prénom"]', 'Ben');
await page.waitForTimeout(300);
const cardCount = await page.locator('.student-card').count();
console.log(`${cardCount > 0 ? 'OK  ' : 'FAIL'} - Recherche filtre bien la liste (${cardCount} résultat(s))`);

console.log('\n=== Page errors ===');
console.log(errors.length ? errors.join('\n') : 'Aucune');
console.log('\n=== Console errors ===');
const relevant = consoleErrors.filter(e => !e.includes('Failed to fetch') && !e.includes('ERR_CONNECTION_REFUSED'));
console.log(relevant.length ? relevant.join('\n---\n') : 'Aucune');

await browser.close();
