# MyRadSquad · Product Designer Case A

A working iOS prototype (Expo / React Native) for PlusMinusOne's Case A: onboarding that
earns the paywall, a Home built for the first two minutes, Spark (the AI feature) in two
states, and Paywall A vs B.

## Where to start

1. **[Prototype walkthrough.mp4](Submission/Prototype%20walkthrough.mp4)**: the whole flow
   in two minutes, no setup.
2. **[Design file](Submission/Design%20file)**: screenshots of the build in flow order. The
   cover lists the AI tools used; *10b* explains every element on Home.
3. **[Experiment note.pdf](Submission/Experiment%20note.pdf)** and
   **[Test plan.pdf](Submission/Test%20plan.pdf)**: Paywall A vs B, and how the A/B test
   would run.
4. **MyRadSquad - Case A.html**: the whole case on one page (brief, research, problem,
   solution, design file, experiment). GitHub doesn't render HTML, so download the repo
   (**Code → Download ZIP**) and open it from `Submission/` in any browser.

## Run the app

You need a Mac with Xcode 26 and Node.js 22 (about 15 minutes the first time). In the
`myradsquad` folder:

```bash
npm install -g pnpm
pnpm install
LANG=en_US.UTF-8 pnpm ios
```

The small violet tab on the right edge of every screen jumps to any state, including
Paywall B. Full steps, running on an iPhone by cable, and troubleshooting are in
**[README.pdf](README.pdf)**.

## What's here

```
README.pdf          how to open the app, step by step
Submission/         case page, design file, experiment note, test plan, walkthrough video
myradsquad/         the app's source code (Expo SDK 58, React Native)
```
