# App Store Compliance Testing Skill

## Purpose
Comprehensive pre-submission testing to ensure 100% App Store approval rate. This skill acts as a simulated App Store reviewer, catching all potential rejection reasons before submission.

## When to Use
- Before submitting any game to the App Store
- After completing development, before `/build`
- When the "Compliance and Publishing Test" focus is selected in Chad

## Critical Deadlines (2026)
- **January 31, 2026**: Complete updated age rating questionnaire
- **April 2026**: All apps must be built with iOS 26 SDK

## Compliance Testing Process

### Phase 1: Automated Checks (10 minutes)

#### 1.1 App Icon Validation
```bash
# Check icon exists and dimensions
file assets/icon.png
identify -format "%wx%h" assets/icon.png  # Must be 1024x1024

# Check for transparency (should have NO alpha)
identify -verbose assets/icon.png | grep -i "alpha"
```

**Requirements:**
- [ ] Exactly 1024x1024 pixels
- [ ] PNG format
- [ ] No transparency/alpha channel
- [ ] Fills entire square (no rounded corners)
- [ ] sRGB or Display P3 color space

#### 1.2 Screenshot Validation
```bash
# List screenshots
ls -la store/screenshots/

# Check dimensions
for f in store/screenshots/*.png; do identify -format "%f: %wx%h\n" "$f"; done
```

**Required Screenshots (2026):**
| Device | Dimensions (Portrait) |
|--------|----------------------|
| iPhone 6.9" | 1320 x 2868 px |
| iPad 13" | 2064 x 2752 px |

- [ ] At least 1 iPhone screenshot (1320x2868 or 1284x2778)
- [ ] At least 1 iPad screenshot (2064x2752)
- [ ] PNG or JPEG format
- [ ] No device frames or hands
- [ ] Actual app UI (no fake mockups)

#### 1.3 Metadata Validation
```bash
# Check character counts
wc -c store/description.txt    # Max 4000
wc -c store/keywords.txt       # Max 100
```

**Character Limits:**
| Field | Max Length |
|-------|-----------|
| App Name | 30 |
| Subtitle | 30 |
| Description | 4000 |
| Keywords | 100 |
| Promotional Text | 170 |

- [ ] App name <= 30 characters
- [ ] No placeholder/Lorem Ipsum text
- [ ] Keywords don't duplicate app name

#### 1.4 Privacy Manifest Validation
```bash
# Check for privacy manifest
find . -name "PrivacyInfo.xcprivacy" -o -name "privacyManifests"

# For Expo apps, check app.json
grep -A 20 "privacyManifests" app.json
```

**Required in app.json (Expo):**
```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      },
      "privacyManifests": {
        "NSPrivacyAccessedAPITypes": [
          {
            "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
            "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
          }
        ]
      }
    }
  }
}
```

- [ ] PrivacyInfo.xcprivacy exists OR privacyManifests in app.json
- [ ] ITSAppUsesNonExemptEncryption set
- [ ] Required Reason APIs declared

#### 1.5 Build Configuration
```bash
# Check app.json configuration
cat app.json | jq '.expo.ios'
```

**Required Configuration:**
- [ ] bundleIdentifier set (com.yourcompany.gamename)
- [ ] version in X.Y.Z format
- [ ] supportsTablet: true (for universal apps)
- [ ] requireFullScreen: true (for games)

### Phase 2: Device Compatibility Testing (20 minutes)

Test on ALL required device sizes using the device selector:

#### 2.1 iPhone SE (375x667) - Smallest
- [ ] All UI elements visible
- [ ] Text readable
- [ ] Touch targets accessible (minimum 44x44 pt)
- [ ] No content cut off

#### 2.2 iPhone 14 (390x844) - Standard
- [ ] Layout correct
- [ ] Safe areas respected
- [ ] Gameplay functional

#### 2.3 iPhone 16 Pro Max (440x956) - Largest
- [ ] Content scales appropriately
- [ ] No excessive whitespace
- [ ] Dynamic Island area clear

#### 2.4 iPad Pro 12.9" (1024x1366) - Tablet
- [ ] Layout adapts to larger screen
- [ ] Touch targets scaled appropriately
- [ ] No iPhone-only layouts stretched

### Phase 3: Gameplay Testing (15 minutes)

#### 3.1 Core Functionality
- [ ] App launches without crash
- [ ] Main menu loads correctly
- [ ] Game starts when play is tapped
- [ ] Gameplay is functional
- [ ] Win condition triggers correctly
- [ ] Lose condition triggers correctly
- [ ] Score updates correctly
- [ ] Game over screen displays
- [ ] Restart works
- [ ] Return to menu works

#### 3.2 Audio & Haptics
- [ ] Sound effects play (if present)
- [ ] Background music plays (if present)
- [ ] Mute toggle works
- [ ] Haptic feedback fires (test on device)
- [ ] Audio respects system silent mode

#### 3.3 State Persistence
- [ ] High score saves across sessions
- [ ] Settings persist
- [ ] App handles backgrounding gracefully
- [ ] App handles force quit and relaunch

#### 3.4 Error Handling
- [ ] No crashes during extended play
- [ ] Handles rapid input without crashing
- [ ] Handles device rotation (if supported)
- [ ] Handles interruptions (calls, notifications)

### Phase 4: In-App Purchase Validation (if applicable)

- [ ] All purchases use Apple IAP (no external payments)
- [ ] Restore purchases button exists
- [ ] Restore purchases works
- [ ] Purchased items don't expire
- [ ] Prices match App Store Connect
- [ ] IAP names <= 30 characters
- [ ] IAP descriptions <= 45 characters

### Phase 5: Privacy & Legal (5 minutes)

- [ ] Privacy Policy URL accessible
- [ ] Privacy Policy link in app (Settings/About)
- [ ] Privacy Policy includes:
  - What data is collected
  - How data is used
  - Third-party sharing
  - Data retention/deletion

- [ ] Age rating accurate for content:
  - 4+: No objectionable content
  - 9+: Mild content
  - 13+: Moderate content
  - 16+: Mature content
  - 18+: Adults only

- [ ] Loot box odds disclosed (if present)
- [ ] No real money gambling (unless licensed)

### Phase 6: Final Review Simulation

Act as App Store reviewer:

1. **Fresh Install Test**
   - Delete app, reinstall
   - Complete onboarding
   - Play for 5 minutes
   - Check all screens

2. **Metadata Accuracy**
   - Screenshots match actual app
   - Description matches features
   - Age rating matches content

3. **Common Rejection Check**
   - No crashes
   - No placeholder content
   - No broken links
   - No hidden features
   - No misleading claims

## Compliance Score Calculation

```
Score = (Critical Pass Rate * 50) + (High Pass Rate * 30) + (Medium Pass Rate * 20)

Requirements:
- Critical: 100% must pass
- High: 90%+ must pass
- Medium: 70%+ must pass

Total Score >= 95% = READY FOR SUBMISSION
Total Score < 95% = FIX ISSUES BEFORE SUBMISSION
```

## Output Format

Generate compliance report:

```markdown
# App Store Compliance Report
**Game**: [name]
**Date**: [date]
**Overall Score**: [X]%

## Critical Issues (Must Fix)
- [ ] Issue 1
- [ ] Issue 2

## High Priority Issues
- [ ] Issue 1

## Recommendations
- Suggestion 1
- Suggestion 2

## Verdict
[ ] READY FOR SUBMISSION
[ ] NEEDS FIXES (see issues above)
```

## Common Rejection Reasons to Check

1. **Guideline 2.1 - Performance**: Crashes, slow loading
2. **Guideline 2.3 - Metadata**: Inaccurate screenshots/description
3. **Guideline 3.1.1 - IAP**: Missing restore, incorrect implementation
4. **Guideline 5.1.1 - Privacy**: Missing privacy manifest, undisclosed tracking
5. **Guideline 4.3 - Spam**: Too similar to existing app

## Integration with Chad Loop

When "Compliance and Publishing Test" focus is selected:
1. Load this skill
2. Run all automated checks
3. Test on all device sizes using device selector
4. Generate compliance report
5. If score < 95%, list fixes needed
6. If score >= 95%, mark ready for `/build` and `/submit`
