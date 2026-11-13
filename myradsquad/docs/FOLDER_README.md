# MyRadSquad · Case A

How to open the app. MyRadSquad is a working iOS app (Expo / React Native). There is no
link: you run it on your own Mac, in the iPhone Simulator, or on your iPhone by cable.

**Just want to see it?** `Submission/Prototype walkthrough.mp4` shows the whole flow on the
iPhone Simulator in two minutes, no setup.

The rest of the submission (research, design file, experiment note, test plan) is in the
`Submission` folder; open `MyRadSquad - Case A.html` there in any browser.

## What you need

- A **Mac** with **Xcode 26** or newer (free, from the Mac App Store).
- **Node.js 22** or newer (free, from nodejs.org; the LTS version is fine).
- About **15 minutes** for the first build. After that it opens in seconds.

## Open the app in the iPhone Simulator

1. **Install Xcode** from the Mac App Store and open it once. If it asks to install the
   iOS platform, say yes (or later: Xcode → Settings → Components → iOS).
2. **Install Node.js** from nodejs.org.
3. **Open Terminal** (Applications → Utilities → Terminal) and install pnpm:

```bash
npm install -g pnpm
```

4. **Go to the app folder.** Type `cd ` (with a space), drag the `myradsquad` folder from
   Finder into the Terminal window, and press Return.
5. **Install the app's packages:**

```bash
pnpm install
```

6. **Build and open the app:**

```bash
LANG=en_US.UTF-8 pnpm ios
```

The iPhone Simulator opens and the app starts on its first screen. Keep the Terminal
window open while you use the app: it serves the app's code.

**Next time:** open Terminal, go to the `myradsquad` folder again (step 4), and run
`LANG=en_US.UTF-8 pnpm ios`. It skips the long build.

## Open it on your iPhone instead (optional)

1. Connect the iPhone to the Mac with a cable and unlock it.
2. In the `myradsquad` folder, run:

```bash
LANG=en_US.UTF-8 pnpm ios --device
```

3. Pick your iPhone from the list. If it asks for a development team, open Xcode once,
   sign in with your Apple ID (Xcode → Settings → Accounts) and run the command again.
4. On the iPhone: Settings → Privacy & Security → **Developer Mode** → on (the phone
   restarts), then Settings → General → VPN & Device Management → trust your Apple ID.
5. The iPhone and the Mac must be on the same Wi-Fi, and Terminal stays open.

## Once it's open

- It starts on the **age gate**: spin the date wheel to any birthday 13+ years ago, then
  Continue. Then the feature screens → "What are you here for?" → the paywall → Home.
- The **AI feature**: Home → Study Hall → ⚙️ → Add Spark (a member turns it on); the Lunch
  Table Legends chat and Cousins on Home (what the squad sees).
- The small **violet tab** on the right edge of every screen jumps to any state, including
  Paywall B. **Reset** in that menu starts over.

## If something goes wrong

| Problem | Fix |
|---|---|
| `pnpm: command not found` | Install pnpm (step 3), then open a new Terminal window. |
| An error about **CocoaPods** or "Unicode" | Run the command with `LANG=en_US.UTF-8` in front, as above. |
| "No simulator" or "iOS platform not installed" | Xcode → Settings → Components → install iOS, then run again. |
| "Port 8081 is in use" | Close other Terminal windows running the app, then run again. |
| The app shows a red error screen | In Terminal, press `r` to reload. |
