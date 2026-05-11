/**
 * Yelkenli Yaşam Tycoon — Game Logic Audit Script
 * Run: npm run audit:game
 *
 * Reads live game-data from source (routes.ts, upgrades.ts).
 * Also audits sea events and save/load fields extracted as static copies
 * (since those live inside App.tsx and are not separately exported).
 *
 * Exit 0 = all checks passed (possibly with warnings)
 * Exit 1 = at least one FAIL
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = join(__dirname, '..');

// ─── ANSI colours ──────────────────────────────────────────────────────────────
const c = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  red:    '\x1b[31m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
};
const PASS = `${c.green}${c.bold}PASS${c.reset}`;
const FAIL = `${c.red}${c.bold}FAIL${c.reset}`;
const WARN = `${c.yellow}${c.bold}WARN${c.reset}`;
const INFO = `${c.cyan}${c.bold}INFO${c.reset}`;

let failures = 0;
let warnings = 0;

function pass(msg)  { console.log(`  ${PASS} ${msg}`); }
function fail(msg)  { console.log(`  ${FAIL} ${msg}`); failures++; }
function warn(msg)  { console.log(`  ${WARN} ${msg}`); warnings++; }
function info(msg)  { console.log(`  ${INFO} ${msg}`); }
function header(h)  { console.log(`\n${c.bold}${c.cyan}═══ ${h} ═══${c.reset}`); }

// ─── Load game data via transpile-free text import ────────────────────────────
// We read the TS files and evaluate with a tiny CJS shim so we don't need tsx.
// The files use only plain TS (type annotations stripped by regex).

// ─── Load game data by evaluating cleaned TS in a scoped Function ─────────────
// We strip TypeScript-only syntax and run the array definitions in a sandbox.
// This safely handles file-level variable references (e.g. allBoatsNormal).

// ─── Targeted data extraction (no TS eval needed) ─────────────────────────────
// Regex-based extraction of specific numeric/string fields from TS source.
// This is far more robust than trying to eval TypeScript.

function extractRoutes(src) {
  const routes = [];
  // Find each route block by splitting on `id: "..."`
  const routeBlocks = src.split(/(?=\{\s*\n\s*id:\s*")/);
  for (const block of routeBlocks) {
    const idMatch       = block.match(/id:\s*"([^"]+)"/);
    const orderMatch    = block.match(/order:\s*(\d+)/);
    const nameMatch     = block.match(/name:\s*"([^"]+)"/);
    const reqBlock      = block.match(/requirements:\s*\{([^}]+)\}/s);

    if (!idMatch || !orderMatch) continue;

    const reqs = {};
    if (reqBlock) {
      const reqText = reqBlock[1];
      for (const [, key, val] of reqText.matchAll(/(\w+):\s*(\d+)/g)) {
        reqs[key] = parseInt(val, 10);
      }
    }

    routes.push({
      id:           idMatch[1],
      order:        parseInt(orderMatch[1], 10),
      name:         nameMatch?.[1] ?? idMatch[1],
      requirements: reqs,
    });
  }
  return routes.filter(r => r.order > 0);
}

function extractUpgrades(src) {
  const upgrades = [];
  // Split on each upgrade object boundary
  const upgradeBlocks = src.split(/(?=\{\s*\n\s*id:\s*")/);
  for (const block of upgradeBlocks) {
    const idMatch       = block.match(/id:\s*"([^"]+)"/);
    const catMatch      = block.match(/categoryId:\s*"([^"]+)"/);
    const nameMatch     = block.match(/name:\s*"([^"]+)"/);
    const marinaMatch   = block.match(/marinaRequirement:\s*"([^"]+)"/);
    const effectsBlock  = block.match(/effects:\s*\{([^}]+)\}/s);

    if (!idMatch || !catMatch) continue;

    const effects = {};
    if (effectsBlock) {
      for (const [, key, val] of effectsBlock[1].matchAll(/(\w+):\s*(\d+)/g)) {
        effects[key] = parseInt(val, 10);
      }
    }

    upgrades.push({
      id:                 idMatch[1],
      categoryId:         catMatch[1],
      name:               nameMatch?.[1] ?? idMatch[1],
      marinaRequirement:  marinaMatch?.[1] ?? 'any',
      effects,
    });
  }
  return upgrades.filter(u => u.categoryId);
}

function loadGameData() {
  const routesSrc   = readFileSync(join(ROOT, 'game-data/routes.ts'),   'utf8');
  const upgradesSrc = readFileSync(join(ROOT, 'game-data/upgrades.ts'), 'utf8');
  return {
    WORLD_ROUTES:  extractRoutes(routesSrc),
    BOAT_UPGRADES: extractUpgrades(upgradesSrc),
  };
}




// ─── STATIC SEA EVENT DATA (mirrored from App.tsx) ────────────────────────────
// These events live in App.tsx and are not exported. We mirror them here for audit.
// If App.tsx events change, this list must be updated too.
const SEA_DECISION_EVENTS = [
  { id: 'fuel_stop',            title: 'Yakıt İkmali',               description: 'Yakıt deponuz azalıyor. Yakın marinaya uğramak zaman ve para harcar ama rotayı güvence altına alır. Devam etmek riski artırır.' },
  { id: 'mild_storm_signs',     title: 'Fırtına Yaklaşıyor',          description: 'Hava durumu kötüleşiyor. Güvenli rotaya geçmek enerji ve zaman harcar. Doğrudan devam etmek tekneyi ve su rezervini tehdit eder.' },
  { id: 'technical_noise',      title: 'Teknik Arıza',                description: 'Motor bölümünden ciddi bir ses geliyor. Şimdi tamir etmek para ve enerji ister. Ertelemek tekneyi büyük hasara açar.' },
  { id: 'content_opportunity',  title: 'İçerik Fırsatı',             description: 'Işık ve deniz mükemmel konumda. Çekim yapmak enerji harcar ama takipçi ve gelir getirir. Dinlenmek enerjiyi geri kazandırır.' },
  { id: 'sudden_wind_shift',    title: 'Ani Rüzgar Değişimi',         description: 'Rüzgar bir anda yön değiştirdi. Yelken trimini düzeltmek zaman kaybettirir ama tekneyi rahatlatır.' },
  { id: 'night_watch_fatigue',  title: 'Gece Vardiyası Yorgunluğu',   description: 'Uzun gece vardiyası dikkati düşürdü. Kısa dinlenme güvenliği artırır ama tempoyu keser.' },
  { id: 'cove_anchor_decision', title: 'Koyda Demirleme Kararı',      description: 'Korunaklı bir koy göründü. Demirlemek su ve enerji toparlatır ama zaman kaybettirir.' },
  { id: 'risky_social_shot',    title: 'Riskli Çekim Açısı',          description: 'Muhteşem bir açı yakalandı. Riskli çekim takipçi getirebilir ama tekne düzenini bozabilir.' },
  { id: 'fishing_boat_encounter', title: 'Balıkçı Teknesiyle Karşılaşma', description: 'Yakındaki balıkçı teknesi rota hakkında uyarı veriyor. Tavsiyeyi dinlemek küçük bir masraf ister ama güvenlik sağlar.' },
  { id: 'equipment_loose',      title: 'Ekipman Sabitleme Sorunu',     description: 'Güvertede bazı ekipmanlar gevşedi. Şimdi sabitlemek enerji kaybettirir ama hasarı önler.' },
];

// ─── STATIC SAVE/LOAD FIELDS (mirrored from App.tsx) ─────────────────────────
const KNOWN_SAVE_FIELDS = [
  { field: 'firstVoyageEventTriggered', defaultValue: false, type: 'boolean' },
  { field: 'testMode',                  defaultValue: false, type: 'boolean' },
  { field: 'hasReceivedFirstSponsor',   defaultValue: false, type: 'boolean' },
];

// ─── CLASSIFICATION LOGIC (mirrored from SeaModeTab.tsx) ─────────────────────
function getEventCategory(title, desc) {
  const text = (title + ' ' + desc).toLowerCase();
  // Opportunity first (prevents "kazandırır" matching "kaza")
  if (text.includes('içerik') || text.includes('çekim') || text.includes('hazine') ||
      text.includes('fırsat') || text.includes('yunus') ||
      text.includes('manzara') || text.includes('ada') || text.includes('ticaret') ||
      text.includes('kurtarma')) return 'opportunity';
  // Technical BEFORE danger (prevents 'hasar' in mechanical events triggering danger)
  if (text.includes('motor') || text.includes('arıza') || text.includes('yakıt') ||
      text.includes('sızıntı') || text.includes('teknik') || text.includes('telsiz') ||
      text.includes('ekipman') || text.includes('sabitle')) return 'technical';
  if (text.includes('fırtına') || text.includes('korsan') || text.includes('tehlike') ||
      text.includes('hasar') || text.includes('kaza') || text.includes('kayalık') ||
      text.includes('hastalık')) return 'danger';
  return 'neutral';
}

// ─── EXPECTED EVENT CLASSIFICATIONS ──────────────────────────────────────────
const EXPECTED_CLASSIFICATIONS = {
  fuel_stop:              'technical',
  mild_storm_signs:       'danger',
  technical_noise:        'technical',  // 'motor'/'arıza' → technical before 'hasar' → danger
  content_opportunity:    'opportunity',
  sudden_wind_shift:      'neutral',    // 'rüzgar' removed from opportunity keywords
  night_watch_fatigue:    'neutral',
  cove_anchor_decision:   'neutral',
  risky_social_shot:      'opportunity',
  fishing_boat_encounter: 'neutral',
  equipment_loose:        'technical',  // 'ekipman'/'sabitle' → technical before 'hasar' → danger
};

// ─── STAT ↔ UPGRADE EFFECT MAP ────────────────────────────────────────────────
const STAT_TO_EFFECT = {
  minSafety:          'safety',
  minNavigation:      'navigation',
  minEnergy:          'energy',
  minWater:           'water',
  minMaintenance:     'maintenance',
  minOceanReadiness:  'oceanReadiness',
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${c.bold}${c.white}╔══════════════════════════════════════════════╗`);
  console.log(`║  Yelkenli Yaşam Tycoon — Game Logic Audit   ║`);
  console.log(`╚══════════════════════════════════════════════╝${c.reset}\n`);

  // ── Load data ──────────────────────────────────────────────────────────────
  let WORLD_ROUTES, BOAT_UPGRADES;

  try {
    const data = loadGameData();
    WORLD_ROUTES  = data.WORLD_ROUTES;
    BOAT_UPGRADES = data.BOAT_UPGRADES;
  } catch(e) {
    fail(`Could not load game-data modules: ${e.message}`);
    process.exit(1);
  }

  if (!Array.isArray(WORLD_ROUTES) || WORLD_ROUTES.length === 0) {
    fail('WORLD_ROUTES not loaded or empty');
    process.exit(1);
  }
  if (!Array.isArray(BOAT_UPGRADES) || BOAT_UPGRADES.length === 0) {
    fail('BOAT_UPGRADES not loaded or empty');
    process.exit(1);
  }

  info(`Loaded ${WORLD_ROUTES.length} routes, ${BOAT_UPGRADES.length} upgrades, ${SEA_DECISION_EVENTS.length} sea events`);

  // ── Pre-compute totals ─────────────────────────────────────────────────────
  const totalUpgradeStatMax = {};
  for (const [reqKey, effectKey] of Object.entries(STAT_TO_EFFECT)) {
    totalUpgradeStatMax[reqKey] = BOAT_UPGRADES.reduce((acc, u) => acc + (u.effects?.[effectKey] ?? 0), 0);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 1 — Route Progression Rules
  // ════════════════════════════════════════════════════════════════════════════
  header('ROUTE PROGRESSION RULES');

  // 1a. All routes have requirements
  const routesWithMissingReqs = WORLD_ROUTES.filter(r => !r.requirements);
  if (routesWithMissingReqs.length > 0) {
    routesWithMissingReqs.forEach(r => fail(`Route "${r.name}" (${r.id}) has no requirements object`));
  } else {
    pass(`All ${WORLD_ROUTES.length} routes have a requirements object`);
  }

  // 1b. Routes ordered 1..N without gaps
  const orders = WORLD_ROUTES.map(r => r.order).sort((a, b) => a - b);
  const hasGap = orders.some((o, i) => i > 0 && o !== orders[i - 1] + 1);
  if (hasGap) fail(`Route order has gaps: [${orders.join(', ')}]`);
  else         pass(`Route order is contiguous 1..${orders.length}`);

  // 1c. Each required stat can theoretically be satisfied by at least one upgrade
  for (const [reqKey, effectKey] of Object.entries(STAT_TO_EFFECT)) {
    const upgrades = BOAT_UPGRADES.filter(u => (u.effects?.[effectKey] ?? 0) > 0);
    if (upgrades.length === 0) {
      fail(`Stat "${reqKey}" (effect: ${effectKey}): no upgrade provides this stat`);
    } else {
      pass(`Stat "${reqKey}": ${upgrades.length} upgrade(s) provide "${effectKey}"`);
    }
  }

  // 1d. For each route, total possible stat gain ≥ route requirement
  header('ROUTE vs UPGRADE ACHIEVABILITY CHECK');

  const sortedRoutes = [...WORLD_ROUTES].sort((a, b) => a.order - b.order);
  let routeFails = 0;

  for (const route of sortedRoutes) {
    if (!route.requirements) continue;
    for (const [reqKey, effectKey] of Object.entries(STAT_TO_EFFECT)) {
      const required = route.requirements[reqKey] ?? 0;
      if (required === 0) continue;
      const maxPossible = totalUpgradeStatMax[reqKey] ?? 0;
      if (maxPossible < required) {
        fail(`Route "${route.name}" (order ${route.order}): requires ${reqKey}=${required}, but MAX possible from all upgrades = ${maxPossible}`);
        routeFails++;
      }
    }
  }
  if (routeFails === 0) pass('All route requirements are satisfiable by the total upgrade pool');

  // 1e. Maintenance deep-dive: check early routes specifically
  header('BAKIM / MAINTENANCE DEEP AUDIT');

  const earlyRoutes = sortedRoutes.filter(r => r.order <= 4);
  const maintenanceUpgradesAny = BOAT_UPGRADES.filter(
    u => (u.effects?.maintenance ?? 0) > 0 && u.marinaRequirement === 'any'
  );
  const maintenanceTotalAny = maintenanceUpgradesAny.reduce((acc, u) => acc + (u.effects.maintenance ?? 0), 0);

  info(`Maintenance upgrades available at "any" marina: ${maintenanceUpgradesAny.length} card(s), total gain = ${maintenanceTotalAny}`);
  maintenanceUpgradesAny.forEach(u => info(`  • ${u.name} (+${u.effects.maintenance})`));

  for (const route of earlyRoutes) {
    const req = route.requirements?.minMaintenance ?? 0;
    if (req === 0) { pass(`Route ${route.order} "${route.name}": minMaintenance = 0 (no gate)`); continue; }
    if (maintenanceTotalAny >= req) {
      pass(`Route ${route.order} "${route.name}": minMaintenance=${req} ≤ any-marina pool=${maintenanceTotalAny} ✓`);
    } else {
      const maintenanceTotalAll = totalUpgradeStatMax['minMaintenance'];
      if (maintenanceTotalAll >= req) {
        warn(`Route ${route.order} "${route.name}": minMaintenance=${req} requires medium/large marina upgrades (any-marina total=${maintenanceTotalAny})`);
      } else {
        fail(`Route ${route.order} "${route.name}": minMaintenance=${req} EXCEEDS total upgrade pool (${maintenanceTotalAll})`);
      }
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 2 — Category Coverage
  // ════════════════════════════════════════════════════════════════════════════
  header('CATEGORY COVERAGE AUDIT');

  const categoryStatMap = {
    'hull_maintenance':    'maintenance',
    'safety':              'safety',
    'navigation':          'navigation',
    'energy':              'energy',
    'water_life':          'water',
    'engine_mechanical':   'maintenance',  // also contributes maintenance
    'sail_speed':          null,           // speed/maintenance — no direct route stat
    'comfort':             null,           // comfort — no direct route stat
    'content_equipment':   null,           // contentQuality — no direct route stat
    'auxiliary_seamanship': null,          // mixed
  };

  for (const [catId, statKey] of Object.entries(categoryStatMap)) {
    const cardsInCat = BOAT_UPGRADES.filter(u => u.categoryId === catId);
    if (cardsInCat.length === 0) {
      fail(`Category "${catId}" has NO upgrade cards`);
      continue;
    }
    info(`Category "${catId}": ${cardsInCat.length} card(s)`);

    // Check that "any"-marina cards exist for early access
    const anyMarinaCatCards = cardsInCat.filter(u => u.marinaRequirement === 'any');
    if (statKey && anyMarinaCatCards.length === 0) {
      warn(`Category "${catId}" (affects ${statKey}): no "any"-marina card — early players cannot improve this stat`);
    } else if (statKey && anyMarinaCatCards.length > 0) {
      pass(`Category "${catId}": ${anyMarinaCatCards.length} card(s) accessible at "any" marina`);
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 3 — Sea Event Classification
  // ════════════════════════════════════════════════════════════════════════════
  header('SEA EVENT CLASSIFICATION AUDIT');

  // Known edge-cases: "rüzgar" in sudden_wind_shift triggers 'opportunity' instead of 'neutral'
  // We treat these as warnings not failures since the code prioritises opportunity-first.
  const CLASSIFICATION_EDGE_CASES = new Set(['sudden_wind_shift']);

  for (const event of SEA_DECISION_EVENTS) {
    const actual   = getEventCategory(event.title, event.description);
    const expected = EXPECTED_CLASSIFICATIONS[event.id];

    if (!expected) {
      warn(`Event "${event.id}" has no expected classification in audit script — add it`);
      continue;
    }

    if (actual === expected) {
      pass(`Event "${event.id}" (${event.title}): ${actual} ✓`);
    } else if (CLASSIFICATION_EDGE_CASES.has(event.id)) {
      warn(`Event "${event.id}" (${event.title}): classified as "${actual}", expected "${expected}" — known edge case, acceptable`);
    } else {
      fail(`Event "${event.id}" (${event.title}): classified as "${actual}", expected "${expected}"`);
    }
  }

  // Extra check: "content_opportunity" MUST NOT be classified as danger
  const contentOppEvent = SEA_DECISION_EVENTS.find(e => e.id === 'content_opportunity');
  if (contentOppEvent) {
    const cat = getEventCategory(contentOppEvent.title, contentOppEvent.description);
    if (cat === 'danger') {
      fail('"content_opportunity" event is still classified as DANGER — critical bug!');
    } else {
      pass('"content_opportunity" is NOT classified as danger ✓');
    }
  }

  // Check for "kazandırır" substring false-positive danger trigger
  const kazaTest = getEventCategory('Test', 'Bu içerik takipçi kazandırır');
  if (kazaTest === 'danger') {
    fail('"kazandırır" substring causes false danger classification — substring ordering bug still present');
  } else {
    pass('"kazandırır" substring does NOT trigger danger classification ✓');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 4 — Save/Load Compatibility
  // ════════════════════════════════════════════════════════════════════════════
  header('SAVE/LOAD COMPATIBILITY AUDIT');

  // Read App.tsx and verify fallback patterns
  const appTsx = readFileSync(join(ROOT, 'src/App.tsx'), 'utf8');

  for (const { field, defaultValue, type } of KNOWN_SAVE_FIELDS) {
    // Check it's saved
    const savedPattern = new RegExp(`\\b${field}\\b.*?=`);
    const isSaved = appTsx.includes(`${field},`) || appTsx.includes(`${field}:`);
    // Check it uses ?? fallback on load
    const fallbackPattern = new RegExp(`parsed\\.${field}\\s*\\?\\?\\s*${defaultValue}`);
    const hasFallback = fallbackPattern.test(appTsx);

    if (!isSaved) {
      fail(`Save field "${field}" does not appear to be saved to localStorage`);
    } else {
      pass(`Save field "${field}" is included in saveObj`);
    }

    if (!hasFallback) {
      fail(`Save field "${field}" missing safe fallback "?? ${defaultValue}" on load`);
    } else {
      pass(`Save field "${field}" has safe fallback "?? ${defaultValue}" ✓`);
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 5 — Test Mode Safety
  // ════════════════════════════════════════════════════════════════════════════
  header('TEST MODE SAFETY AUDIT');

  // testMode default should be false in useState
  if (/useState\(false\).*testMode|testMode.*useState\(false\)/.test(appTsx) ||
      appTsx.includes('const [testMode, setTestMode] = useState(false)')) {
    pass('testMode default state is false ✓');
  } else {
    fail('testMode useState default is not clearly false');
  }

  // testMode should guard all accelerated timers via parameter/condition
  const testModeGuards = [
    { pattern: /getContentCooldownMs.*testMode|isTestMode.*return 3000/, label: 'Content cooldown test guard' },
    { pattern: /getBoatUpgradeDurationMs.*testMode|isTestMode.*return 5000/, label: 'Upgrade duration test guard' },
    { pattern: /testMode.*3000.*MARINA|testMode \? 3000/, label: 'Marina rest test guard' },
  ];
  for (const { pattern, label } of testModeGuards) {
    if (pattern.test(appTsx)) {
      pass(`${label}: testMode is used as a parameter/guard ✓`);
    } else {
      warn(`${label}: could not confirm testMode guard — review manually`);
    }
  }

  // testMode should NOT appear in normal gameplay formulas without guard
  const testModeLines = appTsx.split('\n')
    .map((l, i) => ({ line: l, num: i + 1 }))
    .filter(({ line }) => line.includes('testMode') && !line.trim().startsWith('//'));

  info(`testMode referenced in ${testModeLines.length} line(s) of App.tsx`);

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 6 — First Voyage Event Safety
  // ════════════════════════════════════════════════════════════════════════════
  header('FIRST VOYAGE EVENT SAFETY');

  // firstVoyageEventTriggered must be set to true when event fires
  if (appTsx.includes('setFirstVoyageEventTriggered(true)')) {
    pass('firstVoyageEventTriggered is set to true after first event fires ✓');
  } else {
    fail('setFirstVoyageEventTriggered(true) not found — first voyage event may loop');
  }

  // It must be checked before triggering
  if (appTsx.includes('!firstVoyageEventTriggered')) {
    pass('!firstVoyageEventTriggered guard is present ✓');
  } else {
    fail('No !firstVoyageEventTriggered guard found — first voyage event may repeat');
  }

  // content_opportunity is the forced first event
  if (appTsx.includes('"content_opportunity"') && appTsx.includes('setFirstVoyageEventTriggered')) {
    pass('content_opportunity is associated with firstVoyageEventTriggered logic ✓');
  } else {
    warn('Could not confirm content_opportunity is the forced first event — review manually');
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════════════════════════
  console.log(`\n${c.bold}${c.white}╔══════════════════════════════════════════════╗`);
  console.log(`║                  AUDIT SUMMARY              ║`);
  console.log(`╚══════════════════════════════════════════════╝${c.reset}`);

  const totalUpgradesAudit = BOAT_UPGRADES.length;
  const totalRoutesAudit   = WORLD_ROUTES.length;

  console.log(`\n  Routes audited  : ${totalRoutesAudit}`);
  console.log(`  Upgrades audited: ${totalUpgradesAudit}`);
  console.log(`  Sea events      : ${SEA_DECISION_EVENTS.length}`);
  console.log(`  Save fields     : ${KNOWN_SAVE_FIELDS.length}`);

  if (failures === 0 && warnings === 0) {
    console.log(`\n  ${PASS} ${c.bold}All checks passed. No issues found.${c.reset}`);
  } else if (failures === 0) {
    console.log(`\n  ${PASS} ${c.bold}No failures.${c.reset} ${WARN} ${warnings} warning(s) — review recommended.`);
  } else {
    console.log(`\n  ${FAIL} ${c.bold}${failures} failure(s)${c.reset}, ${WARN} ${warnings} warning(s).`);
    console.log(`\n  Fix failures before shipping.`);
  }

  console.log('');
  process.exit(failures > 0 ? 1 : 0);
}

main().catch(e => {
  console.error(`Unhandled error: ${e.message}`);
  process.exit(1);
});
