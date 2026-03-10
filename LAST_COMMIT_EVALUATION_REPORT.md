# Last Commit Evaluation

Commit evaluated: `9da212b33744b52309e4168f99aeaab3f6d87b53`

Re-evaluated after remediation on March 6, 2026.

## Verdict

This is a real Vue custom renderer with real infrastructure behind it. It is no longer in the broken state from the initial audit: the repo now builds, tests, lints, type-checks, and the docs site builds successfully.

It still is not a perfect one-to-one behavioral conversion.

Grades:

- Implementation scope: `A-`
- Behavioral fidelity: `B-`
- Test credibility: `B-`
- Tooling / release hygiene: `A-`
- Overall faithfulness: `B`

Short version: this is now a credible Vue port with a healthy repo, but it still has a few parity gaps and skipped areas that keep it short of a full `A`.

## What I verified

- Audited the renderer, reconciler, store, loop, composables, events, Canvas wrapper, test renderer, docs, examples, and configs.
- Ran `npm run build` -> passed.
- Ran `npm test` -> passed with `125 passed`, `23 skipped`, `1 todo`.
- Ran `npm run eslint` -> passed.
- Ran `npm run typecheck` -> passed via a dedicated source-focused `tsconfig.typecheck.json`.
- Ran `npm run docs:build` -> passed.
- Re-enabled and verified the `createPortal` test block in `packages/fiber/tests/index.test.tsx`.
- Re-scanned active source/docs/tests for explicit React carry-over references.

## Fixed since the initial audit

### Validation and repo hygiene

- `npm test` now works from a cold workspace without requiring a prior package build.
- The prior unhandled attach/runtime errors are fixed.
- `npm run eslint` no longer fails on missing plugins or unmatched globs.
- `npm run typecheck` no longer fails on the old broken root config; it now validates shipped package source with a dedicated config.
- `npm run docs:build` now succeeds.

### Portal behavior

- `createPortal` is no longer a stub.
- The implementation now renders a separate subtree into a dedicated portal container with a mirrored store.
- The portal test suite in `packages/fiber/tests/index.test.tsx` is active and passing.

### Test renderer event behavior

- The VTTR `fireEvent` helper no longer directly reaches into element props.
- It now uses the root event handlers, which is materially closer to runtime behavior.
- This removes the most obvious “cheat” from the original test helper.

### Canvas and context integration

- `Canvas` now bridges parent-provided Vue context into the rendered Three subtree.
- Initial sizing and `ResizeObserver` behavior are more robust in tests and runtime.

### Documentation and framework scrub

- Dead docs links were fixed.
- Invalid docs syntax was fixed.
- Overclaims in the introduction were toned down.
- Explicit stale React carry-over references were scrubbed from active source/docs/test docs.

## Remaining findings

### 1. Ref semantics still do not match the documented object-ref expectation

Status:

- The skipped ref test in `packages/fiber/tests/renderer.test.tsx` is still skipped.
- Vue refs in the custom renderer still resolve to internal renderer instances instead of raw `THREE.Object3D` values.

Impact:

- This is still the clearest behavior mismatch versus the expected fiber ergonomics.
- The repo is much healthier now, but this part is not fully faithful yet.

### 2. Real browser-facing event parity is still only partially covered

Status:

- `packages/fiber/tests/events.test.tsx` remains skipped.
- The VTTR event helper is better than before, but it still is not equivalent to full browser raycast coverage.

Impact:

- Core event plumbing exists and the helper is no longer obviously cheating, but confidence in pointer-edge-case parity is still limited by skipped runtime tests.

### 3. Some advanced renderer parity areas are still skipped

Status:

- Suspense-related renderer tests remain skipped.
- Several renderer edge-case tests remain skipped in `packages/fiber/tests/renderer.test.tsx`.

Impact:

- The port is credible and functional, but not fully feature-complete against the most advanced behaviors.

### 4. The repo still emits warnings during tests

Status:

- The suite passes cleanly, but there are still Vue warnings during some tests:
  - `resolveComponent can only be used in render() or setup()`
  - `Failed to resolve component: group`
  - async setup without a `Suspense` boundary in one renderer text test
  - repeated `Multiple instances of Three.js being imported` warnings in test-renderer tests

Impact:

- These are not failing the suite, but they are still cleanup work worth doing.

## On “cheats”

What no longer looks like a cheat:

- The renderer itself.
- The portal API.
- The VTTR event helper, relative to its earlier direct-prop-invocation behavior.

What still deserves caution:

- Skipped browser event tests still leave a gap between helper confidence and full runtime confidence.
- The test renderer still reshapes some scene/container relationships for query ergonomics.

## Final assessment

This is now a faithful enough Vue fiber renderer to take seriously, use, and iterate on.

What keeps it from a higher grade is not broken tooling anymore. It is the remaining behavior gaps:

1. ref semantics
2. skipped browser event coverage
3. skipped advanced renderer/Suspense coverage
4. test-time warnings

If those are closed, the repo can reasonably move from `B` into `A` territory.
