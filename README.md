# Infra Flow Assessment

A production-quality React + Vite + TypeScript implementation of an infrastructure topology editor. The app uses ReactFlow for the canvas, shadcn/ui-style Radix components for controls, TanStack Query for server state, Zustand for workspace UI state, and MSW for mock APIs.

## Features

- Top bar, left icon rail, application panel, ReactFlow canvas, and inspector panel
- Desktop inspector sidebar and mobile inspector Sheet drawer
- ReactFlow graph with 3 typed service nodes and 2 animated edges
- Draggable nodes, selectable nodes, Delete/Backspace node removal, dotted background, and Fit View control
- Inspector status badge, Config/Runtime tabs, editable name and description
- Synchronized 0-100 slider and numeric input with persisted node data updates
- Mocked `GET /api/apps` and `GET /api/apps/:id/graph` endpoints with latency and in-memory data
- Loading, error, retry, and cached query states

## Tech Stack

- React 19
- Vite
- TypeScript strict mode
- ReactFlow (`@xyflow/react`)
- shadcn/ui-style components built with Radix primitives
- TanStack Query
- Zustand
- MSW
- Tailwind CSS

## Project Structure

```text
src/
  app/
    App.tsx
  components/
    flow/
      AppFlow.tsx
      ServiceNode.tsx
    inspector/
      InspectorPanel.tsx
    layout/
      AppsPanel.tsx
      IconRail.tsx
      TopBar.tsx
      Workspace.tsx
    ui/
      badge.tsx
      button.tsx
      input.tsx
      label.tsx
      sheet.tsx
      skeleton.tsx
      slider.tsx
      tabs.tsx
      textarea.tsx
  hooks/
    use-app-queries.ts
  lib/
    api.ts
    utils.ts
  mocks/
    browser.ts
    data.ts
    handlers.ts
  store/
    workspace-store.ts
  types/
    domain.ts
  main.tsx
  styles.css
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

## Mock APIs

MSW runs in development and intercepts:

- `GET /api/apps`
- `GET /api/apps/:id/graph`

The mock data is stored in `src/mocks/data.ts`, with request handlers in `src/mocks/handlers.ts`. The browser worker lives at `public/mockServiceWorker.js`.

## State Model

Zustand owns UI workspace state:

- `selectedAppId`
- `selectedNodeId`
- `isMobilePanelOpen`
- `activeInspectorTab`

TanStack Query owns API/server state. Node edits, node moves, edge updates, and deletions update the cached graph for the active app, keeping the canvas and inspector synchronized without prop drilling.

## Verification

The project has been verified with:

```bash
npm run typecheck
npm run lint
npm run build
```
