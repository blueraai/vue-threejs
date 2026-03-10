# Project Origin

This repository was reset as an independent project for the `1.0.0` release.

## Origin

- Pre-`1.0.0` development lived in the `vue-conversion` branch and in a GitHub fork network descended from `react-three-fiber`.
- The final pre-reset tip used for the `1.0.0` cut was commit `83f3003b029ee2a57abd35923292fd6bfa7dd160`.

## Why the reset happened

The history was intentionally squashed to establish `vue-three-fiber` as a standalone project:

- with independent versioning
- with repository metadata pointing at its own GitHub home
- without inherited fork history from the original React lineage

## What was preserved

The codebase and documentation at the `1.0.0` cut reflect the completed Vue port plus the Vue-native API work that followed:

- maximum-achievable feature parity under unmodified Vue core
- explicit documentation of remaining platform divergences
- Vue-native additions such as `useObjectRef`, render lifecycle composables, Canvas overlay/error slots, and reactive demand-render helpers
