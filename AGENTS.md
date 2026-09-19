# Development rules

- Preserve the approved ASCII art and camera work. Read `docs/ART_DIRECTION.md` before changing rendering or scene composition.
- Keep `reference/` immutable. New visual directions require comparison with the existing approved reference.
- Prefer small, complete changes. Do not replace the renderer or game engine solely to adopt a framework.
- Edit `src/`, never generated `dist/` output.
- Story checkpoints and scene previews must remain separate. Settings belong outside checkpoint state.
- Every quick-time event needs a coherent missed-input outcome. Pauses, background tabs and menus must stop deadlines.
- Keep the scene unobstructed. Put concise player choices below the scene. Title cards, stingers, the case file and any other game presentation are HTML under the canvas, never drawn into the scene.
- Derive endings, discoveries, the route and the reflex score from existing checkpoint fields where possible. Case records are separate from checkpoints and must survive a new case.
- Use `npm test` after changes to persistence, game flow or rendering. Add tests only for meaningful new behavior or regressions.
- Do not add packages, analytics, online services or an open-source license without a concrete need or user direction.
- Do not publish the game, enable public hosting or change repository visibility merely as part of a code change.
