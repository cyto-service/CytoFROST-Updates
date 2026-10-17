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

The `main` branch requires linear history and rejects force-pushes and deletion.

Automatic update checks are opt-in. Preview builds may notify and download only;
unattended installation stays disabled until the Windows installer is signed
with the Cyto Service GmbH Authenticode certificate.

Published channel files live in [`channels/`](channels/). Stable releases also
advance the preview channel so preview installations can discover the final
release. Release binaries are attached to GitHub Releases in this repository.

## Choosing a Windows installer

Download the appropriate setup from [Releases](https://github.com/cyto-service/CytoFROST-Updates/releases):

| System | Offline installer |
| --- | --- |
| Windows 10 version 1607 or later / Windows 11, x64 | `CytoFROST-Setup-…-x64.msi` |
| Windows 11 ARM64, including Parallels | Same modern MSI; x64 app emulation with the bundled native ARM64 FTDI driver |
| Updated Windows 7 SP1 / Windows 8.1, x64 | `CytoFROST-Legacy-Setup-…-x64.exe`, including the required Microsoft prerequisites |

The setup packages include the app runtime, background service and FTDI drivers. Portable ZIPs and the inner Legacy MSI do not install all system prerequisites. Windows 8.0 and 32-bit Windows are not covered. Legacy Windows and its runtimes are out of upstream support; see each release's validation notes before use. The Legacy app does not install incompatible modern channel updates.
