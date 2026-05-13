# Yelkenli Yaşam Tycoon - App.tsx Responsibility Map

## Main Responsibilities Still Inside App.tsx
- Application initialization and setup
- Routing and navigation management
- Global state management (if any)
- Error handling and logging

## Responsibilities That Should Stay in App.tsx
- Core application logic that doesn't fit well into components or hooks
- High-level flow control such as saving/loading game state, advancing days, etc.

## Responsibilities That Could Later Move to Components/Hooks
- UI-specific logic that can be encapsulated within components
- Business logic that can be abstracted into hooks for reusability

## Risky Areas to Refactor
- Any code that is tightly coupled with the App component's lifecycle
- Code that is difficult to test or maintain due to its complexity

## Recommended Next Refactor Batches
1. Extract UI-specific logic into components.
2. Abstract business logic into hooks.
3. Refactor global state management if necessary.
