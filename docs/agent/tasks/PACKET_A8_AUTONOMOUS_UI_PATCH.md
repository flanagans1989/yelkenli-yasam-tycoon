PACKET A8 - Autonomous UI Safety Patch

You are working on Yelkenli Yaşam Tycoon.

Goal:
Create one small CSS patch snippet for safer mobile UI behavior.

Important:
Do not edit src/App.css directly.
Do not ask to add src/App.css to the chat.
Only write the CSS patch into docs/agent/A8_UI_SAFETY_PATCH.css.

Allowed files:
- docs/agent/A8_UI_SAFETY_PATCH.css
- docs/agent/A8_AUTONOMOUS_RUN_REPORT.md
- progress.md
- errors_log.md

Strict rules:
- Do not edit source code directly.
- Do not edit src/App.tsx.
- Do not edit any component file.
- Do not edit package.json.
- Do not edit package-lock.json.
- Do not edit vite.config.ts.
- Do not edit tsconfig files.
- Do not edit public/.
- Do not edit index.html.
- Do not install packages.
- Do not commit.
- Do not push.
- Do not ask questions.

CSS patch requirements:
- Keep the patch small.
- Use only safe mobile UI protection.
- Do not redesign the UI.
- Do not remove existing styles.
- Do not use external dependencies.
- Include this exact marker:
  /* A8 autonomous mobile UI safety patch */

Recommended CSS content:
- safe touch target minimums for buttons and clickable elements
- safe line-height for mobile readability
- text wrapping protection for headings and cards
- mobile-only rules inside @media (max-width: 640px)

Tasks:
1. Create or update docs/agent/A8_UI_SAFETY_PATCH.css.
2. Write a small CSS patch with the required marker.
3. Create or update docs/agent/A8_AUTONOMOUS_RUN_REPORT.md.
4. In the report write:
   - What the patch does
   - Why it is low risk
   - Files intended to change
   - Source logic touched: NO
   - Build required: YES
   - Manual checks needed
5. Update progress.md with this exact line:
   - PACKET A8 completed.
6. If a problem occurs, write it to errors_log.md.
