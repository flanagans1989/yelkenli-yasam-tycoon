import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const css = readFileSync(join(ROOT, "src", "App.css"), "utf8");
const sea = readFileSync(join(ROOT, "src", "components", "SeaModeTab.tsx"), "utf8");
const onboarding = readFileSync(join(ROOT, "src", "components", "Onboarding.tsx"), "utf8");
const docs = readFileSync(join(ROOT, "docs", "GAME_LOGIC_AUDIT.md"), "utf8");

const results = [];
const pass = (message) => results.push({ ok: true, message });
const fail = (message) => results.push({ ok: false, message });
const expect = (condition, okMessage, failMessage) => condition ? pass(okMessage) : fail(failMessage);

const hasBoatScrollClass = css.includes('.ob-boat-screen-v2 .ob-boat-scroll') && onboarding.includes('className="ob-boat-scroll"');
const hasStickyBoatActions = css.includes('.ob-boat-screen-v2 .ob-screen-actions') && css.includes('position: sticky') && css.includes('bottom: 0');
const hasBoatScrollPadding = css.includes('.ob-boat-screen-v2 .ob-boat-scroll') && css.includes('padding-bottom: calc(108px + env(safe-area-inset-bottom, 0px));');
expect(
  hasBoatScrollClass && hasStickyBoatActions && hasBoatScrollPadding,
  'PASS Boat selection keeps a sticky CTA with matching bottom-safe scroll padding.',
  'FAIL Boat selection sticky CTA safety is incomplete. Check .ob-boat-scroll, sticky .ob-screen-actions, and bottom safe-area padding in src/App.css / src/components/Onboarding.tsx.'
);

const hasShortScreenBreakpoint = /@media \(max-height:\s*700px\)/.test(css) && css.includes('.ob-boat-screen-v2 .ob-boat-scroll');
expect(
  hasShortScreenBreakpoint,
  'PASS Short-screen breakpoint exists for compact boat selection behavior.',
  'FAIL Missing short-screen mobile breakpoint around 700px for boat selection compaction in src/App.css.'
);

const hasWidthProtection = /@media \(max-width:\s*(390|420|430)px\)/.test(css) && css.includes('.ob-boat-screen-v2 .ob-boat-scroll');
expect(
  hasWidthProtection,
  'PASS Narrow-width mobile protection exists for onboarding density.',
  'FAIL Missing mobile width protection around 390-430px for onboarding / boat selection in src/App.css.'
);

const hasOnboardingOverflowHidden = css.includes('overflow: hidden;');
const hasInnerBoatScroll = css.includes('.ob-boat-screen-v2 .ob-boat-scroll') && css.includes('overflow-y: auto;');
expect(
  !hasOnboardingOverflowHidden || hasInnerBoatScroll,
  'PASS Onboarding hidden-overflow usage is paired with a clear inner boat scroll strategy.',
  'FAIL Onboarding uses overflow:hidden without a clear inner scroll strategy for boat selection. Check src/App.css.'
);

const hasSeaChoicePreviewRender = sea.includes('sea-choice-effects') && sea.includes('sea-choice-effect-pill') && sea.includes('getChoiceEffectPills');
const hasSeaChoicePreviewStyles = css.includes('.sea-choice-effects') && css.includes('.sea-choice-effect-pill--positive') && css.includes('.sea-choice-effect-pill--negative');
expect(
  hasSeaChoicePreviewRender && hasSeaChoicePreviewStyles,
  'PASS Sea event choice outcome previews exist in component render and CSS.',
  'FAIL Sea choice outcome preview guardrails are missing. Check src/components/SeaModeTab.tsx and src/App.css.'
);

const helperClasses = ['.ui-helper-card', '.ui-helper-note', '.ui-helper-title', '.ui-helper-copy'];
const missingHelpers = helperClasses.filter((token) => !css.includes(token));
expect(
  missingHelpers.length === 0,
  'PASS Shared helper UI classes exist for compact guidance blocks.',
  `FAIL Missing shared helper classes in src/App.css: ${missingHelpers.join(', ')}`
);

const docsChecks = [
  '390x667',
  'Sticky CTAs must never cover the final readable content',
  'Sea event choices must show the expected outcome before tap',
  'audit:mobile-ui',
];
const missingDocChecks = docsChecks.filter((token) => !docs.includes(token));
expect(
  missingDocChecks.length === 0,
  'PASS Mobile UI consistency documentation includes required guardrails.',
  `FAIL Missing Mobile UI Consistency Checklist guardrails in docs/GAME_LOGIC_AUDIT.md: ${missingDocChecks.join(', ')}`
);

console.log("\n=== Mobile UI Guardrail Audit ===");
console.log(`Checks run: ${results.length}`);
for (const result of results) console.log(result.message);
const failed = results.filter((result) => !result.ok);
if (failed.length > 0) {
  console.log(`\nFAIL: ${failed.length} mobile UI guardrail check(s) failed.\n`);
  process.exit(1);
}
console.log("\nPASS: Mobile UI guardrails are present. Manual phone testing is still required.\n");
