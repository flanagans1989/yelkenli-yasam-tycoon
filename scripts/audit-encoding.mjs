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
  { label: "ï¸", regex: /ï¸/g },
  { label: "�", regex: /�/g },
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
];

function shouldIgnoreFile(pathValue) {
  return IGNORE_FILE_PATTERNS.some((pattern) => pattern.test(pathValue));
}

function shouldScanFile(pathValue) {
  if (shouldIgnoreFile(pathValue)) return false;
  const ext = extname(pathValue).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
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

    if (!shouldScanFile(rel)) continue;
    out.push(fullPath);
  }
}

function findLineIssues(content) {
  const lines = content.split(/\r?\n/);
  const issues = [];

  lines.forEach((line, idx) => {
    const matches = [];
    for (const p of BAD_PATTERNS) {
      if (p.regex.test(line)) matches.push(p.label);
      p.regex.lastIndex = 0;
    }
    if (matches.length > 0) {
      issues.push({
        line: idx + 1,
        lineText: line,
        matches: Array.from(new Set(matches)),
      });
    }
  });

  return issues;
}

function previewLine(line) {
  const trimmed = line.trim();
  if (trimmed.length <= 180) return trimmed;
  return `${trimmed.slice(0, 177)}...`;
}

function main() {
  const filesToScan = [];

  for (const dir of TARGET_DIRS) {
    const dirPath = join(ROOT, dir);
    collectFiles(dirPath, filesToScan);
  }

  for (const fileName of TARGET_FILES) {
    const fullPath = join(ROOT, fileName);
    if (shouldScanFile(fileName)) filesToScan.push(fullPath);
  }

  const allFindings = [];

  for (const filePath of filesToScan) {
    const rel = relative(ROOT, filePath).replace(/\\/g, "/");
    const content = readFileSync(filePath, "utf8");
    const issues = findLineIssues(content);

    for (const issue of issues) {
      allFindings.push({
        file: rel,
        line: issue.line,
        lineText: issue.lineText,
        matches: issue.matches,
      });
    }
  }

  console.log("\n=== Encoding / Mojibake Audit ===");
  console.log(`Scanned files: ${filesToScan.length}`);
  console.log(`Patterns checked: ${BAD_PATTERNS.length}`);

  if (allFindings.length === 0) {
    console.log("PASS: No mojibake patterns found.\n");
    process.exit(0);
  }

  console.log(`FAIL: Found ${allFindings.length} suspicious encoding line(s).\n`);
  for (const finding of allFindings) {
    console.log(`${finding.file}:${finding.line}`);
    console.log(`  patterns: ${finding.matches.join(", ")}`);
    console.log(`  preview : ${previewLine(finding.lineText)}`);
  }
  console.log("");
  process.exit(1);
}

main();
