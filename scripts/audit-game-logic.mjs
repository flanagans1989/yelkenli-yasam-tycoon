import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};
const PASS = `${c.green}${c.bold}PASS${c.reset}`;
const FAIL = `${c.red}${c.bold}FAIL${c.reset}`;
const WARN = `${c.yellow}${c.bold}WARN${c.reset}`;
const INFO = `${c.cyan}${c.bold}INFO${c.reset}`;

let failures = 0;
let warnings = 0;

function pass(msg) { console.log(`  ${PASS} ${msg}`); }
function fail(msg) { console.log(`  ${FAIL} ${msg}`); failures++; }
function warn(msg) { console.log(`  ${WARN} ${msg}`); warnings++; }
function info(msg) { console.log(`  ${INFO} ${msg}`); }
function header(text) { console.log(`\n${c.bold}${c.cyan}=== ${text} ===${c.reset}`); }

function extractRoutes(src) {
  const routes = [];
  const routeBlocks = src.split(/(?=\{\s*\n\s*id:\s*")/);
  for (const block of routeBlocks) {
    const idMatch = block.match(/id:\s*"([^"]+)"/);
    const orderMatch = block.match(/order:\s*(\d+)/);
    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    const reqBlock = block.match(/requirements:\s*\{([^}]+)\}/s);
    if (!idMatch || !orderMatch || !reqBlock) continue;

    const requirements = {};
    for (const [, key, val] of reqBlock[1].matchAll(/(\w+):\s*(\d+)/g)) {
      requirements[key] = Number.parseInt(val, 10);
    }

    routes.push({
      id: idMatch[1],
      order: Number.parseInt(orderMatch[1], 10),
      name: nameMatch?.[1] ?? idMatch[1],
      requirements,
    });
  }
  return routes.filter((route) => route.order > 0).sort((a, b) => a.order - b.order);
}

function extractUpgrades(src) {
  const upgrades = [];
  const upgradeBlocks = src.split(/(?=\{\s*\n\s*id:\s*")/);
  for (const block of upgradeBlocks) {
    const idMatch = block.match(/id:\s*"([^"]+)"/);
    const catMatch = block.match(/categoryId:\s*"([^"]+)"/);
    const nameMatch = block.match(/name:\s*"([^"]+)"/);
    const marinaMatch = block.match(/marinaRequirement:\s*"([^"]+)"/);
    const effectsBlock = block.match(/effects:\s*\{([^}]+)\}/s);
    if (!idMatch || !catMatch || !effectsBlock) continue;

    const effects = {};
    for (const [, key, val] of effectsBlock[1].matchAll(/(\w+):\s*(\d+)/g)) {
      effects[key] = Number.parseInt(val, 10);
    }

    upgrades.push({
      id: idMatch[1],
      categoryId: catMatch[1],
      name: nameMatch?.[1] ?? idMatch[1],
      marinaRequirement: marinaMatch?.[1] ?? "any",
      effects,
    });
  }
  return upgrades.filter((upgrade) => upgrade.categoryId);
}

function getEventCategory(title, desc) {
  const text = `${title} ${desc}`.toLocaleLowerCase("tr-TR");
  if (text.includes("içerik") || text.includes("çekim") || text.includes("hazine") || text.includes("fırsat") || text.includes("yunus") || text.includes("manzara") || text.includes("ada") || text.includes("ticaret") || text.includes("kurtarma")) return "opportunity";
  if (text.includes("motor") || text.includes("arıza") || text.includes("yakıt") || text.includes("sızıntı") || text.includes("teknik") || text.includes("telsiz") || text.includes("ekipman") || text.includes("sabitle")) return "technical";
  if (text.includes("fırtına") || text.includes("korsan") || text.includes("tehlike") || text.includes("hasar") || text.includes("kaza") || text.includes("kayalık") || text.includes("hastalık")) return "danger";
  return "neutral";
}

function getAllowedMarinaRequirements(order) {
  if (order <= 3) return new Set(["any"]);
  if (order <= 7) return new Set(["any", "medium"]);
  if (order <= 9) return new Set(["any", "medium", "large"]);
  return new Set(["any", "medium", "large", "shipyard", "ocean"]);
}

function sumAccessible(upgrades, effectKey, allowedMarinas, categoryId = null) {
  return upgrades
    .filter((upgrade) => allowedMarinas.has(upgrade.marinaRequirement))
    .filter((upgrade) => (categoryId ? upgrade.categoryId === categoryId : true))
    .reduce((total, upgrade) => total + (upgrade.effects?.[effectKey] ?? 0), 0);
}

function countAccessible(upgrades, effectKey, allowedMarinas, categoryId = null) {
  return upgrades
    .filter((upgrade) => allowedMarinas.has(upgrade.marinaRequirement))
    .filter((upgrade) => (categoryId ? upgrade.categoryId === categoryId : true))
    .filter((upgrade) => (upgrade.effects?.[effectKey] ?? 0) > 0).length;
}

function extractReadinessCategoryMap(appTsx) {
  const match = appTsx.match(/const READINESS_UPGRADE_CATEGORY:[\s\S]*?=\s*\{([\s\S]*?)\};/);
  if (!match) return {};
  const map = {};
  for (const [, label, categoryId] of match[1].matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    map[label] = categoryId;
  }
  return map;
}

const SEA_DECISION_EVENTS = [
  { id: "fuel_stop", title: "Yakıt İkmali", description: "Yakıt deponuz azalıyor. Yakın marinaya uğramak zaman ve para harcar ama rotayı güvence altına alır. Devam etmek riski artırır." },
  { id: "mild_storm_signs", title: "Fırtına Yaklaşıyor", description: "Hava durumu kötüleşiyor. Güvenli rotaya geçmek enerji ve zaman harcar. Doğrudan devam etmek tekneyi ve su rezervini tehdit eder." },
  { id: "technical_noise", title: "Teknik Arıza", description: "Motor bölümünden ciddi bir ses geliyor. Şimdi tamir etmek para ve enerji ister. Ertelemek tekneyi büyük hasara açar." },
  { id: "content_opportunity", title: "İçerik Fırsatı", description: "Işık ve deniz mükemmel konumda. Çekim yapmak enerji harcar ama takipçi ve gelir getirir. Dinlenmek enerjiyi geri kazandırır." },
  { id: "sudden_wind_shift", title: "Ani Rüzgar Değişimi", description: "Rüzgar bir anda yön değiştirdi. Yelken trimini düzeltmek zaman kaybettirir ama tekneyi rahatlatır." },
  { id: "night_watch_fatigue", title: "Gece Vardiyası Yorgunluğu", description: "Uzun gece vardiyası dikkati düşürdü. Kısa dinlenme güvenliği artırır ama tempoyu keser." },
  { id: "cove_anchor_decision", title: "Koyda Demirleme Kararı", description: "Korunaklı bir koy göründü. Demirlemek su ve enerji toparlatır ama zaman kaybettirir." },
  { id: "risky_social_shot", title: "Riskli Çekim Açısı", description: "Muhteşem bir açı yakalandı. Riskli çekim takipçi getirebilir ama tekne düzenini bozabilir." },
  { id: "fishing_boat_encounter", title: "Balıkçı Teknesiyle Karşılaşma", description: "Yakındaki balıkçı teknesi rota hakkında uyarı veriyor. Tavsiyeyi dinlemek küçük bir masraf ister ama güvenlik sağlar." },
  { id: "equipment_loose", title: "Ekipman Sabitleme Sorunu", description: "Güvertede bazı ekipmanlar gevşedi. Şimdi sabitlemek enerji kaybettirir ama hasarı önler." },
];

const EXPECTED_CLASSIFICATIONS = {
  fuel_stop: "technical",
  mild_storm_signs: "danger",
  technical_noise: "technical",
  content_opportunity: "opportunity",
  sudden_wind_shift: "neutral",
  night_watch_fatigue: "neutral",
  cove_anchor_decision: "neutral",
  risky_social_shot: "opportunity",
  fishing_boat_encounter: "neutral",
  equipment_loose: "technical",
};

const STAT_TO_EFFECT = {
  minSafety: "safety",
  minNavigation: "navigation",
  minEnergy: "energy",
  minWater: "water",
  minMaintenance: "maintenance",
  minOceanReadiness: "oceanReadiness",
};

const LABEL_TO_REQ_KEY = {
  Enerji: "minEnergy",
  Su: "minWater",
  Güvenlik: "minSafety",
  Navigasyon: "minNavigation",
  Bakım: "minMaintenance",
};

const KNOWN_SAVE_FIELDS = [
  { field: "firstVoyageEventTriggered", defaultValue: "false" },
  { field: "testMode", defaultValue: "false" },
  { field: "hasReceivedFirstSponsor", defaultValue: "false" },
  { field: "activeStoryHook", defaultValue: "null" },
];

async function main() {
  console.log(`\n${c.bold}${c.white}╔══════════════════════════════════════════════╗`);
  console.log(`║  Yelkenli Yaşam Tycoon — Game Logic Audit   ║`);
  console.log(`╚══════════════════════════════════════════════╝${c.reset}\n`);

  const routesSrc = readFileSync(join(ROOT, "game-data/routes.ts"), "utf8");
  const upgradesSrc = readFileSync(join(ROOT, "game-data/upgrades.ts"), "utf8");
  const appTsx = readFileSync(join(ROOT, "src/App.tsx"), "utf8");
  const rotaTabTsx = readFileSync(join(ROOT, "src/features/voyage/RotaTab.tsx"), "utf8");

  const WORLD_ROUTES = extractRoutes(routesSrc);
  const BOAT_UPGRADES = extractUpgrades(upgradesSrc);
  const readinessCategoryMap = extractReadinessCategoryMap(rotaTabTsx);

  if (WORLD_ROUTES.length === 0 || BOAT_UPGRADES.length === 0) {
    fail("Could not load routes/upgrades for audit");
    process.exit(1);
  }

  info(`Loaded ${WORLD_ROUTES.length} routes, ${BOAT_UPGRADES.length} upgrades, ${SEA_DECISION_EVENTS.length} sea events`);

  header("ROUTE PROGRESSION RULES");
  const missingReqs = WORLD_ROUTES.filter((route) => !route.requirements);
  if (missingReqs.length > 0) missingReqs.forEach((route) => fail(`Route "${route.name}" has no requirements object`));
  else pass(`All ${WORLD_ROUTES.length} routes have a requirements object`);

  const orders = WORLD_ROUTES.map((route) => route.order);
  const contiguous = orders.every((order, index) => order === index + 1);
  if (contiguous) pass(`Route order is contiguous 1..${orders.length}`);
  else fail(`Route order has gaps: [${orders.join(", ")}]`);

  const totalUpgradeStatMax = {};
  for (const [reqKey, effectKey] of Object.entries(STAT_TO_EFFECT)) {
    totalUpgradeStatMax[reqKey] = BOAT_UPGRADES.reduce((acc, upgrade) => acc + (upgrade.effects?.[effectKey] ?? 0), 0);
    const providers = BOAT_UPGRADES.filter((upgrade) => (upgrade.effects?.[effectKey] ?? 0) > 0);
    if (providers.length === 0) fail(`Stat "${reqKey}" has no upgrade providers`);
    else pass(`Stat "${reqKey}": ${providers.length} upgrade(s) provide "${effectKey}"`);
  }

  header("ROUTE vs UPGRADE ACHIEVABILITY CHECK");
  let routeFailCount = 0;
  for (const route of WORLD_ROUTES) {
    for (const [reqKey] of Object.entries(STAT_TO_EFFECT)) {
      const required = route.requirements?.[reqKey] ?? 0;
      if (required === 0) continue;
      const maxPossible = totalUpgradeStatMax[reqKey] ?? 0;
      if (maxPossible < required) {
        fail(`Route "${route.name}" requires ${reqKey}=${required}, but total upgrade pool only reaches ${maxPossible}`);
        routeFailCount++;
      }
    }
  }
  if (routeFailCount === 0) pass("All route requirements are satisfiable by the total upgrade pool");

  header("PHASED ACCESS AUDIT");
  for (const route of WORLD_ROUTES) {
    const allowed = getAllowedMarinaRequirements(route.order);
    for (const [reqKey, effectKey] of Object.entries(STAT_TO_EFFECT)) {
      const required = route.requirements?.[reqKey] ?? 0;
      if (required === 0) continue;
      const accessibleTotal = sumAccessible(BOAT_UPGRADES, effectKey, allowed);
      if (accessibleTotal < required) {
        fail(`Route ${route.order} "${route.name}": ${reqKey}=${required} but accessible ${[...allowed].join("+")} pool only reaches ${accessibleTotal}`);
      } else {
        pass(`Route ${route.order} "${route.name}": ${reqKey} reachable within ${[...allowed].join("+")} pool`);
      }
    }

    const accessibleMaintenance = sumAccessible(BOAT_UPGRADES, "maintenance", allowed);
    if (route.requirements.minMaintenance > 0) {
      const buffer = accessibleMaintenance - route.requirements.minMaintenance;
      if (buffer <= 0) {
        fail(`Route ${route.order} "${route.name}": maintenance has no accessible buffer (pool ${accessibleMaintenance}, need ${route.requirements.minMaintenance})`);
      } else {
        pass(`Route ${route.order} "${route.name}": maintenance buffer is ${buffer}`);
      }
    }
  }

  header("CATEGORY COVERAGE AUDIT");
  const categoryStatMap = {
    hull_maintenance: "maintenance",
    safety: "safety",
    navigation: "navigation",
    energy: "energy",
    water_life: "water",
    engine_mechanical: "maintenance",
    sail_speed: null,
    comfort: null,
    content_equipment: null,
    auxiliary_seamanship: null,
  };

  for (const [categoryId, statKey] of Object.entries(categoryStatMap)) {
    const cards = BOAT_UPGRADES.filter((upgrade) => upgrade.categoryId === categoryId);
    if (cards.length === 0) {
      fail(`Category "${categoryId}" has no upgrade cards`);
      continue;
    }
    info(`Category "${categoryId}": ${cards.length} card(s)`);
    if (statKey) {
      const anyCards = cards.filter((upgrade) => upgrade.marinaRequirement === "any");
      if (anyCards.length === 0) warn(`Category "${categoryId}" has no any-marina cards`);
      else pass(`Category "${categoryId}": ${anyCards.length} any-marina card(s)`);
    }
  }

  header("READINESS TARGET CATEGORY AUDIT");
  for (const [label, reqKey] of Object.entries(LABEL_TO_REQ_KEY)) {
    const categoryId = readinessCategoryMap[label];
    if (!categoryId) {
      fail(`RotaTab has no readiness upgrade category mapping for "${label}"`);
      continue;
    }
    const effectKey = STAT_TO_EFFECT[reqKey];
    const usefulCards = BOAT_UPGRADES.filter((upgrade) => upgrade.categoryId === categoryId && (upgrade.effects?.[effectKey] ?? 0) > 0);
    if (usefulCards.length === 0) {
      fail(`Readiness target "${label}" points to "${categoryId}" but that category has no useful ${effectKey} upgrades`);
      continue;
    }
    pass(`Readiness target "${label}" points to "${categoryId}" with ${usefulCards.length} useful upgrade(s)`);

    for (const route of WORLD_ROUTES.filter((entry) => (entry.requirements?.[reqKey] ?? 0) > 0 && entry.order <= 9)) {
      const allowed = getAllowedMarinaRequirements(route.order);
      const categoryTotal = sumAccessible(BOAT_UPGRADES, effectKey, allowed, categoryId);
      if (categoryTotal <= 0) {
        fail(`Route ${route.order} "${route.name}": readiness target "${label}" opens "${categoryId}" but phase-accessible category total is 0`);
      } else if (reqKey === "minMaintenance" && categoryTotal < route.requirements[reqKey]) {
        fail(`Route ${route.order} "${route.name}": maintenance target category "${categoryId}" only reaches ${categoryTotal}, below requirement ${route.requirements[reqKey]}`);
      }
    }
  }

  header("SEA EVENT CLASSIFICATION AUDIT");
  for (const event of SEA_DECISION_EVENTS) {
    const actual = getEventCategory(event.title, event.description);
    const expected = EXPECTED_CLASSIFICATIONS[event.id];
    if (actual === expected) pass(`Event "${event.id}" (${event.title}): ${actual}`);
    else fail(`Event "${event.id}" (${event.title}): got ${actual}, expected ${expected}`);
  }

  const kazaTest = getEventCategory("Test", "Bu içerik takipçi kazandırır");
  if (kazaTest === "danger") fail('"kazandırır" still false-triggers danger');
  else pass('"kazandırır" does not false-trigger danger');

  header("SAVE/LOAD COMPATIBILITY AUDIT");
  for (const { field, defaultValue } of KNOWN_SAVE_FIELDS) {
    const isSaved = appTsx.includes(`${field},`) || appTsx.includes(`${field}:`);
    const hasFallback = new RegExp(`parsed\\.${field}\\s*\\?\\?\\s*${defaultValue}`).test(appTsx);
    if (isSaved) pass(`Save field "${field}" is included in saveObj`);
    else fail(`Save field "${field}" is missing from saveObj`);
    if (hasFallback) pass(`Save field "${field}" has safe fallback ?? ${defaultValue}`);
    else fail(`Save field "${field}" is missing safe fallback ?? ${defaultValue}`);
  }

  header("FIRST VOYAGE EVENT SAFETY");
  if (appTsx.includes('const shouldForceFirstVoyageEvent = isFirstVoyage && !firstVoyageEventTriggered;')) {
    pass("First voyage event is forced before normal day resolution");
  } else {
    fail("Could not confirm forced first voyage event guard before day resolution");
  }
  if (appTsx.includes('setFirstVoyageEventTriggered(true)')) pass("firstVoyageEventTriggered is set when forced event fires");
  else fail("firstVoyageEventTriggered setter not found");
  if (appTsx.includes('e.id === "content_opportunity"')) pass("content_opportunity is still the forced first event");
  else fail("Forced first event is no longer content_opportunity");

  // ── Batch 3B: Progression Diagnostics ──

  header("BATCH 3B — ROUTE PROGRESSION MATRIX");

  const phases = [
    { label: "any", marinas: new Set(["any"]) },
    { label: "any+medium", marinas: new Set(["any", "medium"]) },
    { label: "any+med+large", marinas: new Set(["any", "medium", "large"]) },
    { label: "all", marinas: new Set(["any", "medium", "large", "shipyard", "ocean"]) },
  ];

  const statKeys = Object.entries(STAT_TO_EFFECT);

  // Compute per-phase max reachable pools
  info("Per-phase reachable stat pools:");
  for (const phase of phases) {
    const vals = statKeys.map(([rk, ek]) => `${ek}=${sumAccessible(BOAT_UPGRADES, ek, phase.marinas)}`).join(", ");
    info(`  [${phase.label}] ${vals}`);
  }

  // Route-by-route progression summary
  let safeCount = 0, tightCount = 0, riskyCount = 0, impossibleCount = 0;
  const routeSummaries = [];

  for (const route of WORLD_ROUTES) {
    const allowed = getAllowedMarinaRequirements(route.order);
    const phaseLabel = route.order <= 3 ? "any" : route.order <= 7 ? "any+med" : route.order <= 9 ? "any+med+lrg" : "all";
    let worstBuffer = Infinity;
    let worstStat = "";
    let hasImpossible = false;
    const buffers = {};

    for (const [reqKey, effectKey] of statKeys) {
      const required = route.requirements?.[reqKey] ?? 0;
      if (required === 0) continue;
      const pool = sumAccessible(BOAT_UPGRADES, effectKey, allowed);
      const buffer = pool - required;
      buffers[effectKey] = { required, pool, buffer };
      if (buffer < 0) hasImpossible = true;
      if (buffer < worstBuffer) { worstBuffer = buffer; worstStat = effectKey; }
    }

    let status;
    if (hasImpossible) { status = "IMPOSSIBLE"; impossibleCount++; }
    else if (worstBuffer < 3) { status = "RISKY"; riskyCount++; }
    else if (worstBuffer < 5) { status = "TIGHT"; tightCount++; }
    else { status = "SAFE"; safeCount++; }

    routeSummaries.push({ route, phaseLabel, buffers, worstBuffer, worstStat, status });

    // Print compact line
    const tag = status === "IMPOSSIBLE" ? FAIL : status === "RISKY" ? WARN : status === "TIGHT" ? WARN : PASS;
    const bufStr = Object.entries(buffers).map(([k, v]) => `${k}:${v.buffer}`).join(" ");
    console.log(`  ${tag} R${String(route.order).padStart(2)}  ${route.name.padEnd(22)} [${phaseLabel.padEnd(11)}] worst=${worstStat}(${worstBuffer}) | ${bufStr}`);

    // Granular warnings
    if (hasImpossible) {
      for (const [ek, v] of Object.entries(buffers)) {
        if (v.buffer < 0) fail(`R${route.order} "${route.name}": ${ek} IMPOSSIBLE (need ${v.required}, pool ${v.pool})`);
      }
    } else if (worstBuffer === 0) {
      warn(`R${route.order} "${route.name}": exact-edge on ${worstStat} (buffer=0)`);
    } else if (worstBuffer < 3) {
      warn(`R${route.order} "${route.name}": risky buffer on ${worstStat} (buffer=${worstBuffer})`);
    } else if (worstBuffer < 5) {
      warn(`R${route.order} "${route.name}": tight buffer on ${worstStat} (buffer=${worstBuffer})`);
    }
  }

  info(`Summary: ${safeCount} safe, ${tightCount} tight, ${riskyCount} risky, ${impossibleCount} impossible`);

  header("BATCH 3B — UPGRADE CATEGORY LADDER");

  const allCats = [...new Set(BOAT_UPGRADES.map(u => u.categoryId))].sort();
  for (const cat of allCats) {
    const cards = BOAT_UPGRADES.filter(u => u.categoryId === cat);
    const marinaSizes = [...new Set(cards.map(u => u.marinaRequirement))].sort();
    const statTotals = {};
    for (const card of cards) {
      for (const [ek, ev] of Object.entries(card.effects)) {
        statTotals[ek] = (statTotals[ek] || 0) + ev;
      }
    }
    const statsStr = Object.entries(statTotals).map(([k, v]) => `${k}:${v}`).join(" ");
    const hasAny = marinaSizes.includes("any");
    const tag = hasAny ? PASS : WARN;
    console.log(`  ${tag} ${cat.padEnd(22)} cards=${cards.length} marinas=[${marinaSizes.join(",")}] | ${statsStr}`);
    if (!hasAny && ["hull_maintenance","safety","navigation","energy","water_life","engine_mechanical"].includes(cat)) {
      warn(`Category "${cat}" has no any-marina card — early routes may lack access`);
    }
  }

  console.log(`\n${c.bold}${c.white}╔══════════════════════════════════════════════╗`);
  console.log(`║                  AUDIT SUMMARY              ║`);
  console.log(`╚══════════════════════════════════════════════╝${c.reset}`);
  console.log(`\n  Routes audited  : ${WORLD_ROUTES.length}`);
  console.log(`  Upgrades audited: ${BOAT_UPGRADES.length}`);
  console.log(`  Sea events      : ${SEA_DECISION_EVENTS.length}`);
  console.log(`  Save fields     : ${KNOWN_SAVE_FIELDS.length}`);

  if (failures === 0 && warnings === 0) {
    console.log(`\n  ${PASS} ${c.bold}All checks passed. No issues found.${c.reset}`);
  } else if (failures === 0) {
    console.log(`\n  ${PASS} ${c.bold}No failures.${c.reset} ${WARN} ${warnings} warning(s).`);
  } else {
    console.log(`\n  ${FAIL} ${c.bold}${failures} failure(s)${c.reset}, ${WARN} ${warnings} warning(s).`);
  }
  console.log("");
  process.exit(failures > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(`Unhandled error: ${error.message}`);
  process.exit(1);
});
