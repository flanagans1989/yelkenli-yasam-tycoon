PACKET A6R - Targeted CSS Patch Test

You are working on Yelkenli Yaşam Tycoon.

Goal:
Create a very small, safe CSS patch snippet for mobile overflow and text wrapping protection.

Important:
Do not edit src/App.css directly.
Do not ask to add src/App.css to the chat.
Only write the CSS patch into docs/agent/A6R_CSS_PATCH.css.

Allowed files:
- docs/agent/A6R_CSS_PATCH.css
- docs/agent/A6R_TARGETED_CSS_TEST_REPORT.md
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
- Use only safe global/mobile overflow protection.
- Do not redesign the UI.
- Do not remove existing styles.
- Do not use external dependencies.
- Include a comment marker: /* A6R targeted mobile safety patch */

Recommended CSS content:
- box-sizing safety
- img/svg/video max-width safety
- button/input/select/textarea font inherit and max-width
- text wrapping protection for common containers
- mobile-only overflow protection with @media (max-width: 640px)

Tasks:
1. Create or update docs/agent/A6R_CSS_PATCH.css.
2. Write a small CSS patch with the required marker.
3. Create or update docs/agent/A6R_TARGETED_CSS_TEST_REPORT.md.
4. In the report write:
   - What the patch does
   - Why this is low risk
   - Files intended to change
   - Source logic touched: NO
   - Build required: YES
   - Manual checks needed
5. Update progress.md with this exact line:
   - PACKET A6R completed.
6. If a problem occurs, write it to errors_log.md.
