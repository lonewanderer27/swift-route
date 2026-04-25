# AGENTS.md

## Purpose

This file provides essential instructions and conventions for AI coding agents working in this repository. It is designed to help agents be immediately productive, follow project-specific patterns, and avoid common pitfalls.

## Project Overview

- **Monorepo managed by pnpm**: Contains a NestJS backend (apps/swift-route), an Expo/React Native mobile app (apps/swift-app), and shared types (packages/types).
- **Backend**: Standard NestJS module/controller/service pattern. Entry: apps/swift-route/src/main.ts. Use pnpm scripts for build/test/lint.
- **Mobile App**: Expo Router, file-based routing in app/. Uses @/ alias for local imports and @swift-route/types for shared types.
- **Shared Types**: All runtime enums must be exported as `enum`, not `type`, to allow value usage in both apps.

## Key Conventions

- **pnpm** is the only supported package manager. Use `pnpm install`, `pnpm start:dev`, etc.
- **NestJS**: Add new features as modules in apps/swift-route/src/, import into AppModule.
- **Expo Router**: Place screens in app/(tabs)/, use _layout.tsx for navigation structure.
- **Shared Types**: Update packages/types/src/enums.ts for enums, re-export from packages/types/src/index.ts.
- **Testing**: Use Jest for backend (pnpm test), and Expo's test runner for mobile.

## Build & Test Commands

- Install: `pnpm install`
- Backend dev: `pnpm start:dev`
- Backend test: `pnpm test`
- Mobile dev: `pnpm --filter ./apps/swift-app start`
- Lint: `pnpm lint`
- Format: `pnpm format`

## Documentation

- See [CLAUDE.md](CLAUDE.md) for detailed monorepo and package structure.
- See [README.md](README.md) for quickstart and setup.

## Agent Guidance

- Link to existing documentation where possible, do not duplicate.
- Follow the minimal-by-default principle: only include what is not easily discoverable.
- If a convention is unclear, ask for feedback or clarification.

---

_Last updated: 2026-04-25_