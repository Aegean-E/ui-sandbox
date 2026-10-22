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
- **Decision**: Commit .aikit/ui.json with surface pp over src/**, 
pm run build as the fast proof and 
pm run ui:snapshot as the inventory proof; color and font literals live only in src/theme.css.
- **Consequences**: UI edits run through ikit ui begin, erify and inish; every interactive control carries data-ui and must keep its inventory line; a style literal outside src/theme.css fails verify.
