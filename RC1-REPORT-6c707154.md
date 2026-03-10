# RC1 Report — 6c707154

Date: March 10, 2026
Branch: `vue-conversion`
Commit: `6c707154`

## Scope

This RC1 inspection answers two questions:

1. Has `vue-three-fiber` ported as much of the React version's functionality as is realistically possible without Vue core changes?
2. Has the project taken real advantage of Vue and improved its public API and internal design where Vue offers better patterns?

This audit is based on:

- current code in `packages/**`, `docs/**`, and `example/**`
- the documented divergence contract in `docs/advanced/vue-divergences.md`
- the Vue-native roadmap in `VUE_NATIVE_EVOLUTION_PLAN.md`
- the current test suite and validation commands

## Executive Verdict

### 1. Maximum-achievable port status

Yes.

This repository now appears to be a credible maximum-achievable port of the React version under unmodified Vue core, not merely a surface-level API clone.

Why:

- Build, test, typecheck, and docs build all pass in the current working tree.
- The suite is down to one skipped test, and that skip is explicitly about the absence of a separate native target, not missing web parity.
- The remaining behavioral differences are narrow, documented, and tied to Vue platform constraints rather than unfinished renderer work.

This is not a perfect one-to-one behavioral clone of react-three-fiber, and it should not be presented that way. But within the constraint of "no Vue core changes," the port is functionally close to the ceiling.

### 2. Vue-native improvement status

Yes.

The project is no longer just "React behavior translated into Vue syntax." It now has meaningful Vue-native APIs and composition patterns that improve clarity and fit the framework better than strict parity would.

The strongest evidence is that the repo now ships explicit Vue-first answers for the exact places where parity was structurally weak:

- object access via `useObjectRef`
- render coordination via `useAfterRender`, `useNextFrame`, and `useRenderCommit`
- DOM/scene composition via `Canvas` overlay and error slots
- shared DOM/scene state via `provide` / `inject` and the `SceneServices` demo
- reactive demand rendering via `watchInvalidate`
- explicit async scene strategy guidance rather than pretending Vue Suspense behaves like React Suspense

## Evidence

### Validation status

The following commands passed during this audit:

- `npm run build`
- `npm test`
- `npm run typecheck`
- `npm run docs:build`

Observed test result:

- `164 passed`
- `1 skipped`

The remaining skipped test is `packages/fiber/tests/index.test.tsx`'s native-target consistency check. The repo does not ship a separate native target, so this is not a web parity blocker.

### Parity coverage that now looks solid

The port covers the major runtime and authoring surface expected from the React version:

- custom renderer and reconciler flow
- `Canvas`, `createRoot`, and `createPortal`
- event system and `eventPrefix` behavior
- attach / detach behavior and primitive reconstruction
- loader caching and `useLoader`
- `useFrame`, `useThree`, and `useGraph`
- test renderer support
- demand rendering and invalidation
- compatibility `flushSync`

The testing map in `packages/fiber/TESTING.md` is now credible and aligns with the public claims. The important difference from earlier audits is that the repo is no longer hiding behind skipped parity suites.

### Remaining parity divergences

The remaining differences from react-three-fiber are narrow and appear to be platform-shaped rather than "unfinished port" bugs.

#### Ref identity

Template refs still resolve to a proxy-backed handle, not a raw `THREE.Object3D`.

What this means:

- property access works
- method calls work
- `instanceof` works
- raw identity comparison does not

This is the correct "maximum achievable" answer under Vue's host-ref model, and the repo now handles it honestly by documenting the divergence and providing `useObjectRef` for raw-object access.

Relevant files:

- `docs/advanced/vue-divergences.md`
- `packages/fiber/src/core/composables.ts`
- `docs/tutorials/object-handles.md`

#### Suspense re-entrance

Vue keeps previously resolved content visible while a new async branch loads. React Suspense hides old content in place.

This is still a real behavioral divergence, but it is:

- documented
- tested
- reframed productively in the docs

Relevant files:

- `docs/advanced/vue-divergences.md`
- `docs/tutorials/scene-transitions.md`
- `packages/fiber/tests/renderer.test.tsx`

#### flushSync caveat

`flushSync` now behaves synchronously and the tests cover nested updates, multi-root behavior, and no double-run semantics.

However, this implementation depends on Vue internal component-effect behavior rather than a stable documented public API. That means the compatibility result is strong for RC1, but the maintenance risk is not zero.

Relevant files:

- `packages/fiber/src/core/renderer.ts`
- `packages/fiber/tests/renderer.test.tsx`
- `docs/advanced/vue-divergences.md`

## Vue-native gains that materially improve the project

### 1. Explicit object access instead of pretending refs are raw objects

`useObjectRef` is the clearest example of the project getting better by stopping the parity fight.

Benefits:

- raw object access is explicit
- reconstruction is handled for the caller
- mounted state is exposed directly
- docs can teach a stable contract instead of a clever workaround

Relevant files:

- `packages/fiber/src/core/composables.ts`
- `docs/API/hooks.md`
- `docs/tutorials/object-handles.md`
- `example/src/demos/ObjectHandles.tsx`

### 2. Better render lifecycle APIs than a parity-only focus would have produced

`useAfterRender`, `useNextFrame`, and `useRenderCommit` are good Vue answers to common real-world needs:

- screenshot timing
- pixel readback timing
- "wait until the scene is committed" logic
- demand-render coordination

This is a meaningful improvement over centering everything on `flushSync`.

Relevant files:

- `packages/fiber/src/core/composables.ts`
- `docs/API/hooks.md`
- `example/src/demos/ScreenCapture.tsx`

### 3. Stronger DOM/scene composition

The `Canvas` overlay and error slots are a real Vue advantage.

They make it easy to build:

- HUDs
- tool panels
- error states
- loading overlays

without awkward renderer tricks.

Relevant files:

- `packages/fiber/src/web/Canvas.ts`
- `docs/API/canvas.md`
- `docs/tutorials/dom-overlays.md`
- `example/src/demos/DomOverlay.tsx`

### 4. Real use of Vue app architecture

The renderer now leans into `provide` / `inject` rather than inventing a parallel scene-service abstraction.

The `SceneServices` demo is important because it shows:

- shared scene and overlay state
- typed service injection
- DOM and 3D consuming the same application-level state

That is one of the clearest places where this project is now stronger as a Vue library than a strict React clone could be.

Relevant files:

- `packages/fiber/src/web/Canvas.ts`
- `docs/tutorials/dom-overlays.md`
- `example/src/demos/SceneServices.tsx`

### 5. More honest async scene guidance

The project no longer frames Suspense emulation as the only measure of success. Instead, it teaches explicit scene-loading strategies and scopes higher-level transition primitives to a future extras layer.

That is the right product choice.

Relevant files:

- `docs/tutorials/scene-transitions.md`
- `docs/advanced/vue-divergences.md`

## Internal quality assessment

At the RC1 level, the codebase now shows better internal discipline than it did during the parity-audit phase:

- public divergences are documented instead of hidden
- public Vue-native APIs have tests
- examples now align with the newer API direction
- the public story is clearer and less misleading

The renderer no longer feels like it is compensating for obvious missing features with skipped tests or docs overclaiming parity.

## Remaining risks and caveats

These do not block the RC1 conclusion, but they should be tracked before a final release.

### 1. `flushSync` depends on Vue internals

This is the most important technical risk still in the code.

The current implementation appears to work and is tested, but it depends on behavior outside Vue's stable documented public API. If the project intends to keep broad Vue compatibility, this should be watched closely and called out clearly in release notes.

### 2. Typecheck reproducibility is still not branch-clean

`npm run typecheck` passes in the current working tree, but `package.json` points to `tsconfig.typecheck.json`, and that file is still untracked in this repository state.

That means the current branch tip is not fully self-contained from a clean checkout perspective.

This is not a parity problem, but it is an RC-quality packaging/reproducibility issue.

### 3. Browser-driven demo verification was not completed in this audit

I attempted to use the local `cmux` browser workflow, but the `cmux` socket was unavailable in this session. As a result, this RC1 report is based on code, tests, docs, and example inspection rather than manual browser execution of the demos.

### 4. Vue still emits the Suspense experimental warning during tests

This is not a functional failure, but the test run is not completely silent.

## Answer to the RC1 questions

### Question 1

Has the project properly ported as much functionality as is possible without Vue core changes?

Answer: yes.

The remaining behavioral gaps are now narrow, explicit, and tied to Vue platform limits rather than unfinished porting work.

### Question 2

Has the project properly taken advantage of Vue and improved the API and internals where it can?

Answer: yes.

The addition of `useObjectRef`, render lifecycle composables, `Canvas` slots, `watchInvalidate`, scene-service patterns, and explicit transition guidance demonstrates real Vue-native improvement, not just a syntax translation of the React version.

## RC1 Conclusion

This branch is ready to be treated as RC1 for the product direction:

- maximum-achievable react-three-fiber compatibility under unmodified Vue
- plus meaningful Vue-native improvements where exact parity is weak or impossible

I would not describe it as a perfect clone of the React version.

I would describe it as:

"a credible, high-overlap Vue port that now also has a real Vue-native story."

For a final release beyond RC1, the main follow-ups are operational rather than architectural:

- commit the typecheck config used by `npm run typecheck`
- keep a close eye on `flushSync` across supported Vue versions
- run a small browser-level smoke pass on the key demos before release
