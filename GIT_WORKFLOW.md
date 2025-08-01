# Git Workflow Guide for GigExecs Team

## 🎯 Branching Strategy

We use a **feature branch workflow** with the following structure:

- `main` - Production-ready code (protected)
- `feature/*` - Feature development branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Urgent production fixes

## 📋 Daily Workflow

### 1. Start Your Day - Sync with Main

```bash
# Always start by pulling latest changes
git checkout main
git pull origin main
```

### 2. Create a Feature Branch

```bash
# Create and switch to a new feature branch
git checkout -b feature/your-feature-name

# Examples:
git checkout -b feature/login-page
git checkout -b feature/user-dashboard
git checkout -b bugfix/fix-navigation
```

### 3. Make Your Changes

```bash
# Make your code changes in Cursor
# Then stage and commit your changes
git add .
git commit -m "feat: add user authentication form"

# Or stage specific files
git add src/components/LoginForm.tsx
git commit -m "feat: implement login form validation"
```

### 4. Push Your Branch

```bash
# Push your feature branch to GitHub
git push origin feature/your-feature-name
```

### 5. Create a Pull Request

1. Go to GitHub repository
2. Click "Compare & pull request" for your branch
3. Add description of your changes
4. Request review from your teammate
5. Address any feedback

### 6. Merge and Clean Up

```bash
# After PR is approved and merged
git checkout main
git pull origin main
git branch -d feature/your-feature-name  # Delete local branch
git push origin --delete feature/your-feature-name  # Delete remote branch
```

## 📝 Commit Message Convention

We use **Conventional Commits** format:

```
type(scope): description

Examples:
feat(auth): add login form component
fix(nav): resolve mobile menu overlap
docs(readme): update installation instructions
style(ui): improve button hover states
refactor(api): simplify user data fetching
test(login): add unit tests for validation
```

### Commit Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

## 🔄 Resolving Merge Conflicts

### If conflicts occur during merge:

1. **In Cursor:**
   - Open the conflicted files
   - Look for conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
   - Choose which changes to keep or combine them
   - Remove conflict markers
   - Save the file

2. **In Terminal:**
   ```bash
   # After resolving conflicts
   git add .
   git commit -m "fix: resolve merge conflicts"
   git push origin feature/your-branch
   ```

## 🛡️ Best Practices

### ✅ Do:
- Always pull latest changes before starting work
- Use descriptive branch names
- Write clear commit messages
- Keep commits atomic (one logical change per commit)
- Test your changes before pushing
- Review your teammate's code thoroughly

### ❌ Don't:
- Commit directly to `main`
- Commit large files or build artifacts
- Commit `.env` files or sensitive data
- Force push to shared branches
- Leave branches unmerged for too long

## 🚨 Emergency Procedures

### Hotfix for Production:
```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-fix
# Make urgent changes
git commit -m "fix: resolve critical production issue"
git push origin hotfix/critical-bug-fix
# Create PR and merge immediately
```

### Reverting Changes:
```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert <commit-hash>
```

## 📊 Useful Commands

```bash
# Check branch status
git status
git branch -a

# See commit history
git log --oneline -10

# See what files changed
git diff

# Stash changes temporarily
git stash
git stash pop

# See remote branches
git branch -r

# Check who changed what
git blame filename.tsx
```

## 🎯 Team Coordination

### Before Starting Work:
1. Check if anyone is working on the same area
2. Communicate with your teammate about overlapping changes
3. Consider pair programming for complex features

### During Development:
1. Keep commits small and focused
2. Push frequently to avoid losing work
3. Use descriptive PR titles and descriptions

### Code Review Process:
1. Review for functionality
2. Check code style and consistency
3. Ensure tests are included
4. Verify no sensitive data is exposed
5. Test the changes locally if possible

---

**Remember:** Good communication is key! Always let your teammate know what you're working on and when you're making changes that might affect shared code. 