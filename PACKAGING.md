# GFK-Trainer Packaging Guide

## Building the Application

### Prerequisites
- Node.js 16+
- npm 8+
- Electron 27.x

### Development Build
```bash
npm run dev
```
This compiles TypeScript and opens the Electron app.

### Production Build (Distribution Preparation)

#### Windows
```bash
npm run dist:win
```
Creates:
- NSIS installer (installer.exe)
- Portable executable (.exe)

**Requirements:**
- Windows 7 or later
- ~150MB disk space

**Installation:**
Run the NSIS installer and follow prompts. Creates Start Menu shortcuts and optional Desktop shortcut.

#### macOS
```bash
npm run dist:mac
```
Creates:
- DMG (disk image) - drag-and-drop installation
- ZIP archive - direct app bundle

**Requirements:**
- macOS 10.13+
- Apple Developer certificate (for signing/notarization)

**Installation:**
Double-click the DMG and drag GFK-Trainer.app to /Applications.

#### Linux
```bash
npm run dist:linux
```
Creates:
- AppImage - portable single file
- DEB package - for Debian/Ubuntu repositories

**Requirements:**
- Linux (Ubuntu 18.04+, Debian 9+, Fedora 30+)

**Installation:**
```bash
# AppImage (portable)
./GFK-Trainer-1.0.0.AppImage

# DEB package
sudo dpkg -i gfk-trainer-1.0.0.deb
```

### Cross-Platform Distribution
```bash
npm run dist
```
Builds for the current platform's native installer.

## Configuration

### Installer Settings (package.json)
```json
{
  "build": {
    "appId": "de.gfk-trainer",
    "productName": "GFK-Trainer",
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
```

### Code Signing (Optional)

#### Windows Code Signing
Generate a self-signed certificate:
```powershell
# PowerShell
$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=GFK-Trainer"
Export-PfxCertificate -Cert $cert -FilePath gfk-trainer-cert.pfx -Password (ConvertTo-SecureString -String "password" -AsPlainText -Force)
```

Then update package.json:
```json
{
  "build": {
    "win": {
      "certificateFile": "gfk-trainer-cert.pfx",
      "certificatePassword": "password"
    }
  }
}
```

#### macOS Code Signing
Requires Apple Developer account. Set environment variables:
```bash
export APPLE_ID=your-apple-id@example.com
export APPLE_ID_PASSWORD=app-specific-password
export APPLE_TEAM_ID=XXXXXXXXXX
```

Then electron-builder will automatically sign and notarize.

## Release Process

1. **Bump Version**
   ```bash
   npm version patch  # or minor, major
   ```

2. **Build Distribution**
   ```bash
   npm run dist
   ```

3. **Create Release on GitHub**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. **Upload to GitHub Releases**
   - Go to https://github.com/DickHorner/GFK_Trainer/releases
   - Create new release with:
     - Tag: v1.0.0
     - Release notes
     - Attach .exe, .dmg, .AppImage, .deb files from `release/` folder

## Verification

After building, verify the package:

```bash
# Windows
.\release\GFK-Trainer Setup 1.0.0.exe --help

# macOS
xattr -l release/GFK-Trainer.dmg

# Linux
file release/GFK-Trainer-1.0.0.AppImage
```

## Troubleshooting

### "Could not find MSBuild.exe" (Windows)
Install Visual Studio Build Tools or use WSL for building.

### "notarization failed" (macOS)
Ensure Apple credentials are correct and Apple ID has 2FA enabled with app-specific passwords.

### "No SNAP_BUILDNO" (Linux)
Install snapcraft or use AppImage as fallback:
```bash
npm run dist:linux -- --linux AppImage
```

## File Locations

After `npm run dist`, installers are in the `release/` folder:

```
release/
├── GFK-Trainer Setup 1.0.0.exe      (Windows NSIS)
├── GFK-Trainer 1.0.0.exe            (Windows Portable)
├── GFK-Trainer-1.0.0.dmg            (macOS)
├── GFK-Trainer-1.0.0.AppImage       (Linux)
└── gfk-trainer_1.0.0_amd64.deb      (Debian/Ubuntu)
```

## Offline Installer

GFK-Trainer works fully offline:
- All content is bundled (12 chapters, 72 exercises)
- Optional LLM backend via local HTTP endpoint (LM Studio, Ollama)
- No cloud dependencies, no tracking

Users can run the installer on computers without internet and use all features locally.
