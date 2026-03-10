# Parity Execution Plan

Status date: March 6, 2026

Purpose: finish the remaining parity work and make the result measurable enough that a final review can say the gaps are fully covered.

This document is internal engineering guidance. It is not part of the public docs site.

## Goal

Bring `vue-three-fiber` to functional parity for the currently identified gap set:

- ref semantics
- runtime/browser event behavior
- advanced renderer reconciliation behavior
- Suspense/async renderer behavior
- warning-free validation and credible test coverage

This is not “make the repo green.” The repo is already green. This is “close the remaining behavioral gaps with proof.”

## Non-Negotiable Guardrails

Do not close this work by:

- deleting skipped parity tests without replacement coverage
- weakening assertions just to make the suite pass
- bypassing runtime logic in tests with direct prop invocation or other shortcuts
- changing docs/examples to match a broken implementation and then calling that parity
- declaring a behavior “Vue-specific” and therefore out of scope without explicit team lead approval

Any test removal or scope reduction must include:

- written rationale
- replacement coverage
- explicit sign-off from the team lead

## Current Gap Inventory

### Ref parity

Current signal:

- `packages/fiber/tests/renderer.test.tsx`
- `it.skip('should forward ref three object')`

Problem:

- public refs still do not fully behave like object refs to `THREE.Object3D` instances

### Runtime event parity

Current signal:

- `packages/fiber/tests/events.test.tsx`
- `13` skipped tests
- `1` todo

Problem:

- browser-facing event behavior is not fully proven through the real Canvas/raycast pipeline

### Advanced renderer reconciliation parity

Current signal:

- `packages/fiber/tests/renderer.test.tsx`
- `10` skipped tests still relevant to parity

Skipped areas include:

- reactive `args`
- reactive `object`
- unmount/disposal behavior
- array primitive swaps
- interruptibility during tree construction
- Suspense visibility behavior
- `flushSync`

### Warning cleanup / confidence noise

Current signal during `npm test`:

- Vue warnings from `Canvas` tests
- `resolveComponent` warnings in `index.test.tsx`
- async setup warning in one renderer test
- `Multiple instances of Three.js being imported` warnings in test-renderer tests

Problem:

- the suite passes, but not cleanly

## Global Exit Criteria

The project is not done until all of the following are true.

### 1. Validation commands pass

- `npm run build`
- `npm run test`
- `npm run eslint`
- `npm run typecheck`
- `npm run docs:build`

### 2. No parity skips remain in the parity suites

Required:

- `packages/fiber/tests/events.test.tsx`: `0` skipped, `0` todo
- `packages/fiber/tests/renderer.test.tsx`: `0` skipped for parity-related cases

Allowed exception:

- `packages/fiber/tests/index.test.tsx` target-consistency test may be removed or converted to an explicit non-applicable assertion because this repo does not ship a separate native target

### 3. Test run is clean

Required:

- `npm test` exits `0`
- no unhandled errors
- no Vue warnings
- no duplicate-Three warnings

### 4. Public behavior is documented accurately

Required:

- docs and examples match shipped behavior
- refs, events, and Suspense semantics are no longer overstated

### 5. Final parity review package exists

Required evidence in the final handoff:

- list of all skips removed
- list of all new tests added
- command outputs for the full validation stack
- short mapping from each gap in this document to the test(s) proving it is covered

## Workstreams

## Workstream A: Ref Contract

Size:

- `M`
- `3-5` dev days
- `1` senior dev, optional support from `1` additional dev

Scope:

- make public refs resolve to `THREE.Object3D` instances instead of internal renderer instances
- keep internal instance access available only through explicit internal APIs such as `useInstanceHandle`
- update examples/docs if public ref behavior changes

Primary files:

- `packages/fiber/src/core/reconciler.ts`
- `packages/fiber/src/core/renderer.ts`
- `packages/fiber/tests/renderer.test.tsx`
- docs/examples that currently rely on refs

Acceptance criteria:

- unskip `should forward ref three object`
- add coverage for:
  - object ref on `mesh`
  - callback ref on `mesh`
  - ref on `primitive`
  - ref stability across updates
  - unmount resets ref to `null`
- no public docs/examples claim object refs unless the implementation actually returns object refs

Reviewer note:

- this is not done if refs merely return a different wrapper that “acts like” a `THREE.Object3D`

## Workstream B: Runtime Event Parity and Harness

Size:

- `L`
- `5-8` dev days
- `2` devs recommended

Scope:

- build a deterministic event test harness that exercises the actual Canvas/raycast path
- remove skipped runtime event tests
- close the event-prefix todo

Primary files:

- `packages/fiber/tests/events.test.tsx`
- `packages/shared/setupTests.ts`
- `packages/fiber/src/web/Canvas.ts`
- `packages/fiber/src/core/events.ts`
- `packages/test-renderer/src/fireEvent.ts`

Acceptance criteria:

- `packages/fiber/tests/events.test.tsx` has `0` skips and `0` todo
- tests cover:
  - `onPointerDown`
  - `onPointerMove`
  - `onPointerMissed`
  - miss behavior on same element click
  - miss behavior for parent/child click relationship
  - Canvas-level missed events
  - `stopPropagation`
  - pointer capture release on unmount
  - captured-pointer leave behavior
  - primitives
  - DOM offset canvas
  - event prefixes
- tests exercise runtime event/raycast behavior, not direct prop invocation

Guardrail:

- do not mark this done by moving everything to VTTR-only tests

## Workstream C: Renderer Reconciliation Parity

Size:

- `L`
- `4-6` dev days
- `2` devs recommended

Scope:

- close remaining renderer parity gaps outside Suspense

Primary files:

- `packages/fiber/src/core/reconciler.ts`
- `packages/fiber/src/core/utils.ts`
- `packages/fiber/src/core/renderer.ts`
- `packages/fiber/tests/renderer.test.tsx`

Acceptance criteria:

- unskip and pass tests for:
  - reactive `args`
  - reactive `object`
  - unmount behavior
  - 4-array primitive swap
  - 4-array primitive swap via `attach`
  - graceful interrupt while building the tree
  - `flushSync`
- add any missing regression coverage discovered during implementation

Guardrail:

- do not replace these tests with looser snapshots

## Workstream D: Suspense / Async Behavior Parity

Size:

- `L` to `XL`
- `5-8` dev days
- `2` senior-leaning devs recommended

Scope:

- make async object loading and visibility behavior match the intended fiber semantics closely enough for the existing parity tests to pass

Primary files:

- `packages/fiber/src/core/renderer.ts`
- `packages/fiber/src/core/composables.ts`
- `packages/fiber/tests/renderer.test.tsx`

Acceptance criteria:

- unskip and pass:
  - `should toggle visibility during Suspense non-destructively`
  - `should hide suspended objects when displaying pending content`
- add at least one additional regression test proving repeated fallback/resume cycles do not corrupt visibility or object identity

Guardrail:

- do not close this by deleting the Suspense cases and saying native Vue Suspense is “different”

## Workstream E: Warning Cleanup and Validation Credibility

Size:

- `M`
- `2-4` dev days
- `1` dev can run this in parallel with other workstreams

Scope:

- remove runtime/test warnings so the suite is a credible signal

Primary files:

- `packages/fiber/src/web/Canvas.ts`
- `packages/fiber/tests/index.test.tsx`
- `packages/fiber/tests/canvas.test.tsx`
- `packages/test-renderer/src/index.tsx`
- any supporting config/setup files

Acceptance criteria:

- `npm test` prints no Vue warnings
- `npm test` prints no duplicate-Three warnings
- `npm test` prints no unhandled errors

Specific warning classes to eliminate:

- `Failed to resolve component: group`
- `resolveComponent can only be used in render() or setup()`
- async setup without `Suspense`
- `Multiple instances of Three.js being imported`

## Workstream F: Docs and Example Alignment

Size:

- `S`
- `1-2` dev days
- can be done by the team lead or a docs-focused dev after A-D land

Scope:

- update docs/examples to match the final shipped behavior exactly

Acceptance criteria:

- no stale statements about current limitations or behavior
- all examples using refs still match the implemented ref contract
- docs for events/Suspense do not overclaim

## Recommended Staffing Plan

Recommended team shape:

- `1` team lead
- `3-4` implementation devs
- keep external review running in parallel after each workstream lands

Suggested split:

- Dev 1: Workstream A
- Devs 2 and 3: Workstream B
- Devs 1 and 4: Workstream C
- Devs 3 and 4 or lead plus Dev 4: Workstream D
- Lead or support dev: Workstream E
- Lead or docs dev: Workstream F

Expected elapsed time with parallel work:

- about `1.5` to `2.5` weeks depending on how hard Suspense parity turns out to be

## Sequencing

Recommended order:

1. Workstream B
2. Workstream A
3. Workstream C
4. Workstream D
5. Workstream E
6. Workstream F

Reasoning:

- event harness and ref contract reduce churn for the rest
- Suspense work should start only after the core reconciliation behavior is stable

## Final Review Checklist

Before calling this finished, the team lead should hand over:

- the PRs or commit range
- the list of removed skips/todos
- the exact command outputs for:
  - `npm run build`
  - `npm run test`
  - `npm run eslint`
  - `npm run typecheck`
  - `npm run docs:build`
- a short matrix showing:
  - ref parity -> proving tests
  - runtime event parity -> proving tests
  - renderer parity -> proving tests
  - Suspense parity -> proving tests
  - warning cleanup -> proving clean test output

At that point, a final review can verify the result against this document and the latest evaluation report.
