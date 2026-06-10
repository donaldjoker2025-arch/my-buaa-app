import { spawnSync } from "node:child_process";
import process from "node:process";

const REPO_BASE = "/my-buaa-app/";
const RELEASE_PREFIX = "releases";
const [mode, releaseName] = process.argv.slice(2);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function getNpxCommand() {
  return process.platform === "win32" ? "npx.cmd" : "npx";
}

function normalizeReleaseName(value) {
  if (!value) {
    fail("Missing release name. Example: npm run deploy:release -- 2026-06-10-lab-v1");
  }

  const trimmed = value.trim();
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(trimmed)) {
    fail("Release name can only contain letters, numbers, dots, underscores, and hyphens.");
  }

  return trimmed;
}

if (mode !== "stable" && mode !== "release") {
  fail("Usage: node scripts/deploy-gh-pages.mjs <stable|release> [release-name]");
}

const releaseId = mode === "release" ? normalizeReleaseName(releaseName) : "";
const basePath = mode === "stable" ? REPO_BASE : `${REPO_BASE}${RELEASE_PREFIX}/${releaseId}/`;
const destPath = mode === "stable" ? "." : `${RELEASE_PREFIX}/${releaseId}`;
const commitMessage = mode === "stable" ? "Deploy stable site" : `Deploy release ${releaseId}`;
const repoUrl = process.env.GH_PAGES_REPO_URL?.trim();

console.log(`\nBuilding ${mode === "stable" ? "stable" : `release ${releaseId}`} with base: ${basePath}`);
run(getNpxCommand(), ["vite", "build"], {
  env: {
    ...process.env,
    BUAA_APP_BASE: basePath,
  },
});

const publishArgs = [
  "gh-pages",
  "-d",
  "dist",
  "--dest",
  destPath,
  "--add",
  "--message",
  commitMessage,
];

if (repoUrl) {
  publishArgs.push("--repo", repoUrl);
}

console.log(`\nPublishing to gh-pages destination: ${destPath}`);
run(getNpxCommand(), publishArgs);

if (mode === "stable") {
  console.log(`\nStable URL: https://donaldjoker2025-arch.github.io${REPO_BASE}`);
} else {
  console.log(`\nRelease URL: https://donaldjoker2025-arch.github.io${REPO_BASE}${RELEASE_PREFIX}/${releaseId}/`);
}
