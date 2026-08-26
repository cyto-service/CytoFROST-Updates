# CytoFROST Updates

This repository is the public download and update channel for the CytoFROST
desktop application. It intentionally contains no application source code and
no private customer data.

Only maintainers of the `cyto-service` GitHub account can publish releases.
Every channel manifest is signed with an Ed25519 key held as a GitHub Actions
secret. CytoFROST embeds only the public verification key, checks the manifest
signature and verifies the SHA-256 digest of a downloaded installer before it
offers an update.

Automatic update checks are opt-in. Preview builds may notify and download only;
unattended installation stays disabled until the Windows installer is signed
with the Cyto Service GmbH Authenticode certificate.

Published channel files live in [`channels/`](channels/). Release binaries are
attached to GitHub Releases in this repository.
