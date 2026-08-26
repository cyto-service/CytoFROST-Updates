# CytoFROST Updates

This repository is the public download and update channel for the CytoFROST
desktop application. It intentionally contains no application source code and
no private customer data.

Only maintainers of the `cyto-service` GitHub account can publish releases.
Every channel manifest is signed with an Ed25519 key held in the approval-gated
`update-signing` GitHub Environment, which accepts only `main`. Publishing is a
deliberate manual workflow: a release tag is read only through the GitHub API
and never executed as signing code. The signing job has read-only repository
access; a separate publishing job has write access but never receives the
private key. CytoFROST embeds only the public verification key, checks the exact
manifest signature and verifies the SHA-256 digest and size of a downloaded
installer before it offers an update.

Automatic update checks are opt-in. Preview builds may notify and download only;
unattended installation stays disabled until the Windows installer is signed
with the Cyto Service GmbH Authenticode certificate.

Published channel files live in [`channels/`](channels/). Stable releases also
advance the preview channel so preview installations can discover the final
release. Release binaries are attached to GitHub Releases in this repository.
