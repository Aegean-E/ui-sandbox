# ui-sandbox

## ⚡ 30-Second Cold-Start Quick Reference

- **Runtime Prerequisites**: <FILL: each runtime this project needs and its minimum version>
- **Canonical Regression Shield Gate**:
  ```bash
  <FILL: the command that runs the whole test suite from this project root>
  ```

### 🛠️ AIKit Commands (run from the AIKit folder)
| Role | Command |
|---|---|
| Status, task and gates | `python aikit.py status ui-sandbox` |
| Phase 4: every gate | `python aikit.py check ui-sandbox` |
| Repair memory and map, then check | `python aikit.py fix ui-sandbox` |
| Resume an interrupted task | `python aikit.py resume ui-sandbox` |

## 📦 What's Inside

```text
ui-sandbox/
├── .gitignore                <- transient AIKit state excluded
├── README.md
└── .aikit/                   <- this project's memory: record, ledger, decisions
```
