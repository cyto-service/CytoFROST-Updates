import { createPrivateKey, sign } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const releasePath = requiredEnvironment("RELEASE_JSON_PATH");
const checksumsPath = requiredEnvironment("CHECKSUMS_PATH");
const signingKey = requiredEnvironment("UPDATE_SIGNING_KEY_PEM");
const requestedChannel = process.env.UPDATE_CHANNEL;

const release = JSON.parse(await readFile(releasePath, "utf8"));
const channel = requestedChannel || (release.prerelease ? "preview" : "stable");
if (!new Set(["preview", "stable"]).has(channel)) {
  throw new Error(`Unsupported update channel: ${channel}`);
}

const assets = Array.isArray(release.assets) ? release.assets : [];
const installer = assets.find((asset) => /^CytoFROST-Setup-.+-x64\.msi$/i.test(asset.name));
if (!installer) throw new Error("The release does not contain one Windows x64 MSI installer.");

const versionMatch = /^CytoFROST-Setup-(.+)-x64\.msi$/i.exec(installer.name);
if (!versionMatch) throw new Error(`Could not determine a version from ${installer.name}.`);
const version = versionMatch[1];
const semanticVersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const semanticVersion = semanticVersionPattern.exec(version);
if (!semanticVersion) throw new Error(`Installer version is not valid semantic versioning: ${version}`);
if (channel === "stable" && semanticVersion[4]) throw new Error("A prerelease cannot be published to the stable channel.");
if (!Number.isSafeInteger(installer.size) || installer.size <= 0 || installer.size > 500 * 1024 * 1024) {
  throw new Error(`Installer size is invalid or exceeds the 500 MiB client limit: ${installer.size}`);
}
const publishedAt = new Date(release.published_at);
if (!Number.isFinite(publishedAt.getTime())) throw new Error("Release publication date is missing or invalid.");

const checksumLines = (await readFile(checksumsPath, "utf8")).split(/\r?\n/);
const checksumLine = checksumLines.find((line) => line.trim().endsWith(`  ${installer.name}`));
const sha256 = checksumLine?.trim().split(/\s+/)[0]?.toLowerCase();
if (!sha256 || !/^[a-f0-9]{64}$/.test(sha256)) {
  throw new Error(`SHA-256 checksum for ${installer.name} is missing or invalid.`);
}

const manifest = {
  schemaVersion: 1,
  channel,
  version,
  publishedAt: publishedAt.toISOString(),
  releaseUrl: release.html_url,
  assets: {
    windowsX64: {
      name: installer.name,
      url: installer.browser_download_url,
      sha256,
      size: installer.size
    }
  }
};

const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`, "utf8");
const signature = sign(null, manifestBytes, createPrivateKey(signingKey)).toString("base64");
const outputDirectory = path.resolve(process.env.UPDATE_OUTPUT_DIRECTORY || "channels");
await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, `${channel}.json`), manifestBytes);
await writeFile(path.join(outputDirectory, `${channel}.sig`), `${signature}\n`, "utf8");

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
