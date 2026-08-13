# Repository Guidelines

## Commits

- Keep each commit small, focused, and limited to one logical change.
- Split unrelated changes into separate commits.

## Code Comments

- Write clear comments for non-obvious logic, important decisions, and constraints.
- Keep comments accurate when changing the code they describe.
- Prefer comments that explain why the code exists rather than restating what it does.

## Structure Requirement

- DO NOT modify anything under /
- DO NOT modify anything under src/ unless it's absolutely neccssary. DO NOT modify App.jsx under any occassion unless you are the maintainer.
- Put new feature/page under its own subfolder under src/
- DO NOT modify other subfolders while working new on new feature.
- Rules above may be bypassed if and only if you have justified reasons.

## Branch Requirement

- All features shall have its own branch.
- Only pr from dev to main is accepted.
- dev and main can only modified by pull request

## Codex Code Reviews

- Apply these repository guidelines when Codex performs a code review.
- Flag changes that are too broad for one commit or mix unrelated concerns.
- Flag non-obvious code that lacks clear, accurate comments explaining its rationale.

