# Decisions

Why this project is built the way it is, oldest first. One entry per decision that changes a
contract, a dependency, a data format or the architecture; IDs are consecutive and never reused.

<!-- Entry format:
### ADR-NNN: <decision in one line>
- **Date**: YYYY-MM-DD
- **Status**: Accepted
- **Context**: <what forced the decision>
- **Decision**: <what was decided>
- **Consequences**: <what follows, including what it costs>
-->

### ADR-001: Bound UI edits to src/ with a committed surface contract
- **Date**: 2026-10-22
- **Status**: Accepted
- **Context**: The project exists to exercise AIKit's UI guard, so unbounded edits would hide scope drift.
- **Decision**: Commit `.aikit/ui.json` with surface `app` over `src/**`, `npm run build` as the fast proof and `npm run ui:snapshot` as the inventory proof; color and font literals live only in `src/theme.css`.
- **Consequences**: UI edits run through `aikit ui begin`, `verify` and `finish`; every interactive control carries `data-ui` and must keep its inventory line; a style literal outside `src/theme.css` fails verify.

### ADR-002: CI is correct but blocked at the account level
- **Date**: 2026-10-22
- **Status**: Accepted (blocked on an external account setting)
- **Context**: The Verify workflow registered as active, but its first run (`39842053398`) ended in `startup_failure` after 0s with zero jobs and no logs. AIKit recorded the same account-level blocker for private repositories in ADR-042 after a minimal smoke workflow failed identically; inspecting Actions billing needs the `user` OAuth scope, which this project does not widen.
- **Decision**: Keep `.github/workflows/ci.yml` and run its exact steps locally as the delivery gate. Do not make the private repository public to bypass minute billing without the owner's decision.
- **Consequences**: The workflow is ready when Actions can start; until then it provides no remote evidence, and `aikit check --strict` plus the npm scripts remain authoritative.

### ADR-003: The Actions blocker is a billing lock, not a workflow defect
- **Date**: 2026-10-22
- **Status**: Accepted (external account state)
- **Context**: Run `39843687036` on commit `ea8e2a9` queued, ran for 30s, then failed with the annotation "The job was not started because your account is locked due to a billing issue." This confirms ADR-002's likely cause and rules out the workflow file.
- **Decision**: Keep the workflow unchanged. Resolve the lock in account billing settings; do not make the private repository public to avoid minute billing without the owner's decision.
- **Consequences**: No repository change can turn the check green. After billing is restored, rerun the failed jobs; the local strict gate remains the delivery authority until then.

### ADR-004: Migrate new versions to AL-1.1 with ACL-1.0 commercial tier
- **Date**: 2026-10-26
- **Status**: Accepted
- **Context**: The 2026-10-26 portfolio normalization pass moves software projects to the Aegean License 1.1 (AL-1.1) for personal use and the Aegean Commercial License 1.0 (ACL-1.0) for commercial use, with REUSE SPDX metadata and a tagged boundary commit for the prior AGPL-3.0 releases.
- **Decision**: Tag the last AGPL-3.0 commit as `v0.1.2-agpl`, switch `LICENSE` to AL-1.1 and `COMMERCIAL.md` to ACL-1.0, add `REUSE.toml` and `LICENSES/LicenseRef-AL-1.1.txt`, bump `package.json` to `0.2.0` with `SEE LICENSE IN LICENSE`, and curate repository topics and description.
- **Consequences**: Versions up to and including `v0.1.2-agpl` remain available under GNU AGPL-3.0; version `0.2.0` onward is governed by AL-1.1 and ACL-1.0.

### ADR-005: Bind .app text color to theme tokens and enforce ui_required in project config
- **Date**: 2026-10-26
- **Status**: Accepted
- **Context**: Reviewing the last three pushes revealed that `body` sets `color: var(--text)` using `:root`'s dark-mode token (`#e8edf9`), while `.theme-light` is applied to `.app`. Because `.app` did not declare `color: var(--text)`, headings and labels in light theme inherited near-white text on white cards. In addition, `project.json` had `ui_required: false`, so `check --strict` did not verify `.aikit/ui_history.json` surface digests.
- **Decision**: Add `color: var(--text)` to `.app` in `src/styles.css`, add `aria-pressed` to `theme-toggle` and `aria-live="polite"` to `counter-value` in `src/App.jsx`, use `path.extname` in `scripts/ui-inventory.mjs`, set `ui_required: true` and `test_command: "npm test"` in `.aikit/project.json`, sync `package-lock.json` to `0.2.0`, and cover these invariants in `tests/app.test.mjs`.
- **Consequences**: Light theme text contrast is restored, `npm test` guards against raw color literals or missing `.app` color binding, and `aikit check --strict` enforces surface digest evidence on every delivery.

## Licensing migration (v0.1.2-agpl)

- New versions use the Aegean License 1.1 (AL-1.1); versions up to and including `v0.1.2-agpl` remain under GNU AGPL-3.0.
- Rights holder: AegeanWorks; commercial use under ACL-1.0.
- Counsel review of the 1.1 texts remains pending.
