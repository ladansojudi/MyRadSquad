# Test plan · Paywall A vs B

How we would run the experiment in the note, step by step. Numbers are planning
assumptions until we have our own baseline.

## 1. Before launch

- **Write it down first.** Hypothesis, the one deciding metric, guardrails, sample size,
  stop date and decision rule are fixed before the first user sees B. No new success
  metric after the fact.
- **Who is in.** New users who joined by invite and reach the paywall at the end of
  onboarding. Users who start their own table are out: B's "5 of 5 seats taken" isn't
  true for them.
- **How they're split.** 50/50 by account at the first paywall view, and sticky: a user
  sees the same paywall every time. Both arms sell the same two products ($3.99/week,
  $29.99/year, 3-day trial); only the screen changes. Run it with RevenueCat Experiments
  (two Offerings on the same placement) or a remote feature flag.
- **QA both arms** on a real iPhone, including the under-18 Ask to Buy path, and check
  that every event (paywall view, trial start, paid, refund) arrives once per user.

## 2. Sample size and length

| | |
|---|---|
| Baseline | 2.75% paywall view → paid (industry, Adapty) |
| Smallest lift worth shipping | +20% relative (2.75% → 3.30%) |
| Significance / power | 5% two-sided / 80% |
| Sample | **~15,200 paywall views per arm** (~30,500 total) |
| Enrolment | at least 14 days (two full weeks, weekday and weekend), at most 28 |
| Read-out | 7 days after the last user enrols (3-day trial + 24 h Ask to Buy + early refunds) |

If 28 days can't reach the sample, we don't run longer: we accept a bigger lift (+30%
needs ~7,100 per arm) or stop the test.

## 3. While it runs

- **No peeking at the winner.** We read the deciding metric once, at the planned end.
  Looking every day and stopping when it "looks significant" turns a 5% false-positive
  rate into 25% or more.
- **Daily health checks only:**
  - Split: a sample-ratio mismatch (chi-square p < 0.001) means the tracking is broken;
    pause and fix, and throw away the data.
  - Guardrails (stop B early if it crosses one): Ask to Buy declines 5+ points above A,
    refunds double A's, or any report about the friends B names.

## 4. Reading the result

1. Check the split again (SRM).
2. **Deciding metric:** day-7 paid conversion per paywall view, compared with a
   two-proportion test.
3. **Pre-planned cuts** (to explain, not to pick a winner): under 18 vs 18+ (Ask to Buy),
   yearly vs weekly mix.
4. **Secondary:** trial starts, invites sent, day-7 activity of users who said no.

## 5. Decision

| Result | What we do |
|---|---|
| B wins, guardrails fine | Ship B to invited users. Next: test the seat moment on Home, before any paywall. |
| No significant difference | Keep A (it matches our research and is simpler). |
| B loses, or a guardrail fires | Keep A. Next: test Spark's first spark inside the paywall. |

B changes several things at once (headline, art, named friends, button text), so a win
tells us "seats beat fun", not which part did it. The follow-up test isolates the named
friends.
