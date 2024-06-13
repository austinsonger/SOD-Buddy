# SODBuddy

**Enforce Segregation of Duties GitHub Action**

> This GitHub Action enforces segregation of duties by checking the CODEOWNERS file and ensuring that no committer can approve or merge their own code.

## Usage

Create a workflow file in your repository (e.g., `.github/workflows/enforce_sod.yml`) with the following content:

```yaml
name: Enforce Segregation of Duties


on:
  pull_request:
    types: [opened, edited, synchronize]

jobs:
  enforce-sod:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout Repository
      uses: actions/checkout@v2

    - name: Enforce Segregation of Duties
      uses: austinsonger/SODBuddy@v0.0.1
      with:
        GITHUB_TOKEN: ${{ secrets.GH_TOKEN || secrets.GITHUB_TOKEN }}
```

- **Inputs** - `GITHUB_TOKEN:` - The GitHub token for authentication (required).


-------

### CODEOWNERS

The CODEOWNERS.md file should follow this format:

```
@username1,1
@username2,0
@username3,0
@username4,0
@username5,1
@username6,1
```

##### Hierarchy

- Users assigned 0 are Primary CODEOWNERS.
- Users assigned 1 are Backup CODEOWNERS.


### Action Logic

The action follows these steps to enforce segregation of duties:

#### 1. Identify Committers and Approvers:

The action first identifies all committers (users who have made commits) and approvers (users who are requested to review the pull request).

#### 2. Remove Ineligible Approvers:

If any approver has also committed code to the pull request, they are removed from the list of approvers.

#### 3. Find Eligible Approver:

The action then searches for a new approver in the CODEOWNERS.md file. It first checks the Primary CODEOWNERS (users assigned 0).
If all Primary CODEOWNERS have committed code and are thus ineligible, the action moves on to check the Backup CODEOWNERS (users assigned 1).

#### 4. Assign New Approver:

The first eligible user found (who has not committed code to the pull request) is assigned as the new approver.


### Example

**Let's say the action encounters the following scenario:**

- `@username4` cannot approve the pull request because they have at least one commit as part of the PR.
- The action then checks the next Primary CODEOWNER: `@username2` (has at least one commit as part of the PR).
- Then, `@username3` (has at least one commit as part of the PR).
- All Primary CODEOWNERS are ineligible to approve the pull request because they have committed code.

The action then moves to the Backup CODEOWNERS:
- `@username1` is checked and found eligible (no commits in the PR).

Therefore, @username1 is assigned as the new approver.

```
@username1,1
@username2,0
@username3,0
@username4,0
@username5,1
@username6,1
```

- `@username2`, `@username3`, and `@username4` are Primary CODEOWNERS (assigned 0).
- `@username1`, `@username5`, and `@username6` are Secondary CODEOWNERS (assigned 1).


