# Contributing to Our Hackathon Project

Thanks for contributing! Here's a quick guide to keep things smooth.

## Branch Naming

Use this format: `team-name/feature-or-bugfix/short-description`

**Examples:**
- `team1/feature/login-page`
- `team2/bugfix/navbar-responsive`
- `team3/feature/api-integration`

## Commit Messages

Follow this format: `<type>(scope): short description`

**Allowed types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `chore` - Maintenance tasks
- `style` - Code style/formatting
- `refactor` - Code restructuring
- `test` - Adding or updating tests

**Examples:**
- `feat(ui): add login button`
- `fix(api): resolve authentication error`
- `docs(readme): update setup instructions`

## How to Contribute

1. **Create a branch** from `dev`:
   ```bash
   git checkout dev
   git pull
   git checkout -b your-team/feature/your-feature
   ```

2. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "feat(scope): your description"
   ```

3. **Push your branch**:
   ```bash
   git push origin your-team/feature/your-feature
   ```

4. **Open a Pull Request** to `dev` branch

## Pull Request Rules

- All PRs must target the `dev` branch
- Require at least **1 review** before merging
- Make sure all checks pass (lefthook runs ESLint + Prettier automatically)
- Keep PRs focused and reasonably sized

## Pre-commit Checks

We use **lefthook** to automatically run checks before each commit:
- ESLint for code quality
- Prettier for code formatting

If checks fail, fix the issues and commit again. This keeps our codebase clean! 🚀

---

Happy hacking! 🎉
