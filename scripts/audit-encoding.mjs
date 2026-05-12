import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const TARGET_DIRS = ["src", "game-data", "docs"];
const TARGET_FILES = ["package.json"];
const ALLOWED_EXTENSIONS = new Set([".ts", ".tsx", ".css", ".md", ".json"]);
const IGNORE_DIRS = new Set(["node_modules", "dist", ".git"]);
const IGNORE_FILE_PATTERNS = [
  /\.backup\./i,
  /\.encoding-broken-backup\./i,
  /\.patch$/i,
  /package-lock\.json$/i,
  /pnpm-lock\.ya?ml$/i,
  /yarn\.lock$/i,
];

const BAD_PATTERNS = [
  { label: "Ã", regex: /Ã/g },
  { label: "Ä", regex: /Ä/g },
  { label: "Å", regex: /Å/g },
  { label: "ð", regex: /ð/g },
  { label: "Â", regex: /Â/g },
  { label: "ï", regex: /ï/g },
  { label: "replacement-char", regex: /�/g },
  { label: "GÃ¼", regex: /GÃ¼/g },
  { label: "Ä°", regex: /Ä°/g },
  { label: "Ä±", regex: /Ä±/g },
  { label: "Ã§", regex: /Ã§/g },
  { label: "ÅŸ", regex: /ÅŸ/g },
  { label: "ÄŸ", regex: /ÄŸ/g },
  { label: "Ã¶", regex: /Ã¶/g },
  { label: "Ã–", regex: /Ã–/g },
  { label: "Ã¼", regex: /Ã¼/g },
  { label: "â†", regex: /â†/g },
  { label: "âš", regex: /âš/g },
  { label: "â›", regex: /â›/g },
  { label: "âœ", regex: /âœ/g },
  { label: "ğŸ", regex: /ğŸ/g },
  { label: "ğ¥", regex: /ğ¥/g },
  { label: "ğ§", regex: /ğ§/g },
  { label: "ğ”", regex: /ğ”/g },
  { label: "ğ’", regex: /ğ’/g },
  { label: "ğš", regex: /ğš/g },
  { label: "ğœ", regex: /ğœ/g },
  { label: "ğ¤", regex: /ğ¤/g },
  { label: "ğŸ”", regex: /ğŸ”/g },
];

function shouldIgnoreFile(pathValue) {
  return IGNORE_FILE_PATTERNS.some((pattern) => pattern.test(pathValue));
}

function shouldScanFile(pathValue) {
  if (shouldIgnoreFile(pathValue)) return false;
  return ALLOWED_EXTENSIONS.has(extname(pathValue).toLowerCase());
}

function collectFiles(startPath, out) {
  const entries = readdirSync(startPath);
  for (const entry of entries) {
    const fullPath = join(startPath, entry);
    const rel = relative(ROOT, fullPath).replace(/\\/g, "/");
    const st = statSync(fullPath);

    if (st.isDirectory()) {
      if (IGNORE_DIRS.has(entry) || IGNORE_DIRS.has(rel)) continue;
      collectFiles(fullPath, out);
      continue;
    }

    if (shouldScanFile(rel)) out.push(fullPath);
  }
}

function findLineIssues(content) {
  const lines = content.split(/\r?\n/);
  const issues = [];

  lines.forEach((line, idx) => {
    const matches = [];
    for (const pattern of BAD_PATTERNS) {
      if (pattern.regex.test(line)) matches.push(pattern.label);
      pattern.regex.lastIndex = 0;
    }
    if (matches.length > 0) {
      issues.push({ line: idx + 1, lineText: line, matches: Array.from(new Set(matches)) });
    }
  });

  return issues;
}

function previewLine(line) {
  const trimmed = line.trim();
  return trimmed.length <= 180 ? trimmed : `${trimmed.slice(0, 177)}...`;
}

function main() {
  const filesToScan = [];

  for (const dir of TARGET_DIRS) {
    collectFiles(join(ROOT, dir), filesToScan);
  }

  for (const fileName of TARGET_FILES) {
    if (shouldScanFile(fileName)) filesToScan.push(join(ROOT, fileName));
  }

  const findings = [];
  for (const filePath of filesToScan) {
    const rel = relative(ROOT, filePath).replace(/\\/g, "/");
    const content = readFileSync(filePath, "utf8");
    for (const issue of findLineIssues(content)) {
      findings.push({ file: rel, ...issue });
    }
  }

  console.log("\n=== Encoding / Mojibake Audit ===");
  console.log(`Scanned files: ${filesToScan.length}`);
  console.log(`Patterns checked: ${BAD_PATTERNS.length}`);

  if (findings.length === 0) {
    console.log("PASS: No mojibake patterns found.\n");
    process.exit(0);
  }

  console.log(`FAIL: Found ${findings.length} suspicious encoding line(s).\n`);
  for (const finding of findings) {
    console.log(`${finding.file}:${finding.line}`);
    console.log(`  patterns: ${finding.matches.join(", ")}`);
    console.log(`  preview : ${previewLine(finding.lineText)}`);
  }
  console.log("");
  process.exit(1);
}

main();
