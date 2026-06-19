# Vanciety SkillOpt Index

Generated: 2026-06-15 23:13:55

Every full-time discipline agent is connected to one `best_skill.md`. Existing best skills are preserved.

| Agent | Discipline | best_skill.md | Validation gate | Trajectory log | Rejected edits |
|---|---|---|---|---|---|
| Executive Product Agent | `product` | [`best_skill.md`](product/best_skill.md) | [`validation_gate.md`](product/validation_gate.md) | [`trajectory_log.md`](product/trajectory_log.md) | [`rejected_edits.md`](product/rejected_edits.md) |
| Architecture Agent | `architecture` | [`best_skill.md`](architecture/best_skill.md) | [`validation_gate.md`](architecture/validation_gate.md) | [`trajectory_log.md`](architecture/trajectory_log.md) | [`rejected_edits.md`](architecture/rejected_edits.md) |
| Frontend Agent | `frontend` | [`best_skill.md`](frontend/best_skill.md) | [`validation_gate.md`](frontend/validation_gate.md) | [`trajectory_log.md`](frontend/trajectory_log.md) | [`rejected_edits.md`](frontend/rejected_edits.md) |
| UX/UI Design Agent | `design` | [`best_skill.md`](design/best_skill.md) | [`validation_gate.md`](design/validation_gate.md) | [`trajectory_log.md`](design/trajectory_log.md) | [`rejected_edits.md`](design/rejected_edits.md) |
| Backend/API Agent | `backend` | [`best_skill.md`](backend/best_skill.md) | [`validation_gate.md`](backend/validation_gate.md) | [`trajectory_log.md`](backend/trajectory_log.md) | [`rejected_edits.md`](backend/rejected_edits.md) |
| Database Agent | `database` | [`best_skill.md`](database/best_skill.md) | [`validation_gate.md`](database/validation_gate.md) | [`trajectory_log.md`](database/trajectory_log.md) | [`rejected_edits.md`](database/rejected_edits.md) |
| Auth/Security Agent | `security` | [`best_skill.md`](security/best_skill.md) | [`validation_gate.md`](security/validation_gate.md) | [`trajectory_log.md`](security/trajectory_log.md) | [`rejected_edits.md`](security/rejected_edits.md) |
| AI Integration Agent | `ai` | [`best_skill.md`](ai/best_skill.md) | [`validation_gate.md`](ai/validation_gate.md) | [`trajectory_log.md`](ai/trajectory_log.md) | [`rejected_edits.md`](ai/rejected_edits.md) |
| Payments/Memberships Agent | `payments` | [`best_skill.md`](payments/best_skill.md) | [`validation_gate.md`](payments/validation_gate.md) | [`trajectory_log.md`](payments/trajectory_log.md) | [`rejected_edits.md`](payments/rejected_edits.md) |
| Admin Dashboard Agent | `admin` | [`best_skill.md`](admin/best_skill.md) | [`validation_gate.md`](admin/validation_gate.md) | [`trajectory_log.md`](admin/trajectory_log.md) | [`rejected_edits.md`](admin/rejected_edits.md) |
| Mobile/iOS Agent | `mobile-ios` | [`best_skill.md`](mobile-ios/best_skill.md) | [`validation_gate.md`](mobile-ios/validation_gate.md) | [`trajectory_log.md`](mobile-ios/trajectory_log.md) | [`rejected_edits.md`](mobile-ios/rejected_edits.md) |
| Marketing/SEO Agent | `marketing-seo` | [`best_skill.md`](marketing-seo/best_skill.md) | [`validation_gate.md`](marketing-seo/validation_gate.md) | [`trajectory_log.md`](marketing-seo/trajectory_log.md) | [`rejected_edits.md`](marketing-seo/rejected_edits.md) |
| Analytics/Growth Agent | `analytics` | [`best_skill.md`](analytics/best_skill.md) | [`validation_gate.md`](analytics/validation_gate.md) | [`trajectory_log.md`](analytics/trajectory_log.md) | [`rejected_edits.md`](analytics/rejected_edits.md) |
| QA/Test Agent | `qa` | [`best_skill.md`](qa/best_skill.md) | [`validation_gate.md`](qa/validation_gate.md) | [`trajectory_log.md`](qa/trajectory_log.md) | [`rejected_edits.md`](qa/rejected_edits.md) |
| DevOps/Deployment Agent | `devops` | [`best_skill.md`](devops/best_skill.md) | [`validation_gate.md`](devops/validation_gate.md) | [`trajectory_log.md`](devops/trajectory_log.md) | [`rejected_edits.md`](devops/rejected_edits.md) |
| Customer Support Automation Agent | `support` | [`best_skill.md`](support/best_skill.md) | [`validation_gate.md`](support/validation_gate.md) | [`trajectory_log.md`](support/trajectory_log.md) | [`rejected_edits.md`](support/rejected_edits.md) |
| Compliance/Privacy Agent | `compliance-privacy` | [`best_skill.md`](compliance-privacy/best_skill.md) | [`validation_gate.md`](compliance-privacy/validation_gate.md) | [`trajectory_log.md`](compliance-privacy/trajectory_log.md) | [`rejected_edits.md`](compliance-privacy/rejected_edits.md) |
| Performance/Scaling Agent | `performance` | [`best_skill.md`](performance/best_skill.md) | [`validation_gate.md`](performance/validation_gate.md) | [`trajectory_log.md`](performance/trajectory_log.md) | [`rejected_edits.md`](performance/rejected_edits.md) |
| Documentation Agent | `documentation` | [`best_skill.md`](documentation/best_skill.md) | [`validation_gate.md`](documentation/validation_gate.md) | [`trajectory_log.md`](documentation/trajectory_log.md) | [`rejected_edits.md`](documentation/rejected_edits.md) |
| Launch Manager Agent | `launch-manager` | [`best_skill.md`](launch-manager/best_skill.md) | [`validation_gate.md`](launch-manager/validation_gate.md) | [`trajectory_log.md`](launch-manager/trajectory_log.md) | [`rejected_edits.md`](launch-manager/rejected_edits.md) |

## SkillOpt Protocol

Each agent must follow this protocol before changing implementation:

1. Read current `best_skill.md`.
2. Perform assigned audit or bounded task.
3. Log trajectory in `trajectory_log.md`.
4. Identify missed requirement or failure.
5. Propose bounded skill edit.
6. Run validation gate from `validation_gate.md`.
7. Promote edit only if validation passes and improves future work.
8. Put rejected edits in `rejected_edits.md`.
9. Update `docs/AGENT_STATUS.md`.

