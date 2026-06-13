import https from "node:https";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = "donaldjoker2025-arch/my-buaa-app";

// Fetch issues from GitHub API
function fetchIssues() {
  return new Promise((resolve, reject) => {
    // We fetch all issues and filter locally since label might be URL encoded weirdly or omitted
    const options = {
      hostname: "api.github.com",
      path: `/repos/${REPO}/issues?state=all&per_page=100`,
      headers: {
        "User-Agent": "NodeJS/Automated-Feedback-Fetcher",
        "Accept": "application/vnd.github.v3+json",
      },
    };

    https.get(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error("Failed to parse JSON response"));
          }
        } else {
          reject(new Error(`GitHub API returned status ${res.statusCode}: ${data}`));
        }
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    console.log(`Fetching issues for ${REPO}...`);
    const issues = await fetchIssues();
    
    // Filter out pull requests
    const feedbackIssues = issues.filter(issue => !issue.pull_request);
    
    const dumpData = {
      fetchedAt: new Date().toISOString(),
      repo: REPO,
      issues: feedbackIssues.map(issue => ({
        number: issue.number,
        title: issue.title,
        user: issue.user.login,
        state: issue.state,
        body: issue.body,
        commentsCount: issue.comments,
        labels: issue.labels.map(l => l.name),
        url: issue.html_url,
        createdAt: issue.created_at,
      })),
    };

    const dumpPath = path.resolve(__dirname, "../feedback_dump.json");
    await fs.writeFile(dumpPath, JSON.stringify(dumpData, null, 2), "utf-8");
    console.log(`Successfully saved ${feedbackIssues.length} issues to ${dumpPath}`);
  } catch (error) {
    console.error("Failed to fetch feedback:", error.message);
    process.exit(1);
  }
}

main();
