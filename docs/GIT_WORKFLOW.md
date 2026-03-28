# Git Workflow with ClickUp Integration

## Branch Structure

```
main (production)
  └── develop (staging)
       ├── feature/feature-name
       ├── bugfix/bug-name
       ├── hotfix/critical-fix
       └── task/task-name
```

### Branch Types

- **main** - Production-ready code, deployed to Netlify
- **develop** - Integration branch for features, staging environment
- **feature/** - New features or enhancements
- **bugfix/** - Bug fixes
- **hotfix/** - Critical production fixes
- **task/** - General tasks from ClickUp

---

## ClickUp Integration

### Branch Naming with ClickUp Task IDs

When working on a ClickUp task, include the task ID in your branch name:

```bash
# Format: type/CU-taskid-short-description
feature/CU-abc123-add-product-filters
bugfix/CU-xyz789-fix-cart-total
task/CU-123456-update-documentation
```

### Commit Message Format for ClickUp

ClickUp automatically links commits when you include the task ID:

```bash
git commit -m "[CU-abc123] Add product filtering functionality

- Add filter by category
- Add filter by price range
- Add search debouncing
"
```

**Format:**
```
[CU-TASKID] Brief description

- Detailed change 1
- Detailed change 2
- Detailed change 3
```

---

## Workflow Steps

### 1. Starting a New Task

```bash
# Make sure you're on develop branch and it's up to date
git checkout develop
git pull origin develop

# Create a new feature branch with ClickUp task ID
git checkout -b feature/CU-abc123-add-wishlist

# Work on your feature...
# Make commits with ClickUp task ID
git add .
git commit -m "[CU-abc123] Add wishlist functionality

- Create wishlist model
- Add wishlist API endpoints
- Create wishlist UI components
"

# Push branch to GitHub
git push -u origin feature/CU-abc123-add-wishlist
```

### 2. Creating a Pull Request

After pushing your branch:

1. Go to GitHub repository
2. Click "Compare & pull request"
3. Set base branch to `develop` (not main!)
4. Title: `[CU-abc123] Add wishlist functionality`
5. Description:
   ```
   ## ClickUp Task
   CU-abc123

   ## Changes
   - Added wishlist model to database
   - Created wishlist API endpoints
   - Built wishlist UI components

   ## Testing
   - [ ] Tested adding items to wishlist
   - [ ] Tested removing items from wishlist
   - [ ] Tested wishlist persistence

   ## Screenshots
   (Add screenshots if applicable)
   ```
6. Create pull request
7. ClickUp will automatically link the PR to your task

### 3. Merging to Develop

After code review:

```bash
# Merge PR on GitHub
# Delete feature branch on GitHub

# Locally, switch to develop and pull changes
git checkout develop
git pull origin develop

# Delete local feature branch
git branch -d feature/CU-abc123-add-wishlist
```

### 4. Releasing to Production

When ready to deploy to production:

```bash
# Create a release branch
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# Make any final adjustments
# Update version numbers if needed

# Push release branch
git push -u origin release/v1.1.0

# Create PR from release/v1.1.0 to main
# After approval, merge to main

# Tag the release
git checkout main
git pull origin main
git tag -a v1.1.0 -m "Release version 1.1.0

- Feature 1
- Feature 2
- Bug fixes
"
git push origin v1.1.0

# Merge main back to develop
git checkout develop
git merge main
git push origin develop
```

---

## Quick Commands Reference

### Daily Workflow

```bash
# Start work
git checkout develop
git pull origin develop
git checkout -b feature/CU-123-my-feature

# Make changes and commit
git add .
git commit -m "[CU-123] Implement feature"

# Push to GitHub
git push -u origin feature/CU-123-my-feature
```

### Create Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/CU-TASKID-description
```

### Create Bugfix Branch

```bash
git checkout develop
git pull origin develop
git checkout -b bugfix/CU-TASKID-description
```

### Create Hotfix Branch (from main)

```bash
git checkout main
git pull origin main
git checkout -b hotfix/CU-TASKID-description
```

### Update Your Branch with Latest Develop

```bash
# While on your feature branch
git fetch origin
git rebase origin/develop

# Or if you prefer merge
git merge origin/develop
```

### Clean Up Old Branches

```bash
# Delete local branches already merged
git branch --merged | grep -v "main\|develop" | xargs git branch -d

# Delete remote tracking branches that no longer exist
git fetch --prune
```

---

## Current Branch Status

Your repository now has:
- ✅ `main` - Production branch
- ✅ `develop` - Development branch
- ✅ `feature/netlify-auth-fix` - Your Netlify authentication fix

---

## ClickUp Auto-Linking

ClickUp automatically detects:
- Branch names with `CU-TASKID`
- Commit messages with `[CU-TASKID]` or `CU-TASKID`
- Pull request titles with `CU-TASKID`

**Example:**
```bash
# Branch
git checkout -b feature/CU-8xy4m2-add-reviews

# Commits
git commit -m "[CU-8xy4m2] Add review model and API"
git commit -m "[CU-8xy4m2] Create review UI component"

# Pull Request Title
[CU-8xy4m2] Add product reviews feature
```

All of these will automatically link to task CU-8xy4m2 in ClickUp!

---

## Best Practices

1. **Always branch from develop** (except hotfixes)
2. **Keep feature branches short-lived** (1-3 days max)
3. **One feature per branch** - don't mix multiple features
4. **Include ClickUp task ID** in branch name and commits
5. **Write descriptive commit messages**
6. **Pull latest develop** before starting new work
7. **Delete branches after merging**
8. **Never commit directly to main**
9. **Test locally before pushing**
10. **Keep develop in sync with main** after production releases

---

## Troubleshooting

### I forgot to create a branch and committed to develop

```bash
# Create the branch you should have been on
git checkout -b feature/CU-123-my-feature

# Go back to develop and reset it
git checkout develop
git reset --hard origin/develop
```

### I need to move my commits to a different branch

```bash
# On your current branch, note the commit hashes
git log --oneline -3

# Create new branch from the correct base
git checkout develop
git checkout -b feature/CU-123-correct-branch

# Cherry-pick your commits
git cherry-pick <commit-hash-1>
git cherry-pick <commit-hash-2>

# Push new branch
git push -u origin feature/CU-123-correct-branch
```

### My branch is behind develop

```bash
# Update your branch
git checkout feature/CU-123-my-feature
git fetch origin
git rebase origin/develop

# If conflicts, resolve them, then:
git add .
git rebase --continue

# Force push if you've already pushed this branch
git push --force-with-lease
```

---

## Example: Complete Feature Development

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch with ClickUp task ID
git checkout -b feature/CU-8xy4m2-product-reviews

# 3. Make your changes and commit
git add app/api/reviews/
git commit -m "[CU-8xy4m2] Add review API endpoints

- POST /api/reviews - Create review
- GET /api/reviews/:id - Get review
- DELETE /api/reviews/:id - Delete review
"

git add components/reviews/
git commit -m "[CU-8xy4m2] Create review UI components

- ReviewForm component
- ReviewList component
- ReviewCard component
"

# 4. Push to GitHub
git push -u origin feature/CU-8xy4m2-product-reviews

# 5. Create Pull Request on GitHub
# - Base: develop
# - Title: [CU-8xy4m2] Add product reviews feature
# - ClickUp automatically links this PR to task CU-8xy4m2

# 6. After PR is approved and merged, clean up
git checkout develop
git pull origin develop
git branch -d feature/CU-8xy4m2-product-reviews
```

---

## Integration with Netlify

### Branch Deployments

Configure Netlify to deploy:
- **main** → Production (silly-longma-69e139.netlify.app)
- **develop** → Staging (develop--silly-longma-69e139.netlify.app)
- **feature/** → Preview deploys

In Netlify:
1. Go to Site settings → Build & deploy → Deploy contexts
2. Set:
   - Production branch: `main`
   - Branch deploys: `develop`
   - Deploy previews: All pull requests

This way every feature branch gets its own preview URL!

---

## Summary

✅ **Branches Created:**
- `main` - Production
- `develop` - Staging
- `feature/netlify-auth-fix` - Current feature

✅ **ClickUp Integration:**
- Use `CU-TASKID` in branch names
- Use `[CU-TASKID]` in commit messages
- ClickUp auto-links branches, commits, and PRs

✅ **Next Steps:**
1. Create PR from `feature/netlify-auth-fix` to `develop`
2. After testing on develop, merge to `main`
3. Start using this workflow for all future tasks
