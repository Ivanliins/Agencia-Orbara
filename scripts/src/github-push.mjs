import { execSync } from "child_process";

const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
const xReplitToken = process.env.REPL_IDENTITY
  ? "repl " + process.env.REPL_IDENTITY
  : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

if (!xReplitToken || !hostname) {
  console.error("Missing Replit token env vars");
  process.exit(1);
}

const connData = await fetch(
  "https://" +
    hostname +
    "/api/v2/connection?include_secrets=true&connector_names=github",
  {
    headers: {
      Accept: "application/json",
      "X-Replit-Token": xReplitToken,
    },
  },
).then((r) => r.json());

const settings = connData.items?.[0]?.settings;
const token =
  settings?.oauth_token || settings?.access_token || settings?.token;

if (!token) {
  console.error("No GitHub token found. Keys:", Object.keys(settings || {}));
  process.exit(1);
}

const remote = `https://Ivanliins:${token}@github.com/Ivanliins/Agencia-Orbara.git`;
try {
  execSync(`git push --force "${remote}" main`, { stdio: "inherit" });
  console.log("Push successful!");
} catch (e) {
  console.error("Push failed");
  process.exit(1);
}
