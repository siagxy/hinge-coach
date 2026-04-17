#!/usr/bin/env python3
import datetime
import json
import subprocess
import sys
from pathlib import Path


def output(payload):
    print(json.dumps(payload))


def run(cmd, cwd):
    return subprocess.run(cmd, cwd=cwd, text=True, capture_output=True)


def main():
    raw = sys.stdin.read() or "{}"
    data = json.loads(raw)
    prompt = (data.get("prompt") or "").lower()

    # Only trigger when the user explicitly says "ship it".
    if "ship it" not in prompt:
        output({"permission": "allow"})
        return

    workspace_roots = data.get("workspace_roots") or []
    if not workspace_roots:
        output(
            {
                "permission": "allow",
                "user_message": "Ship-it hook: no workspace detected, skipped.",
            }
        )
        return

    repo_root = Path(workspace_roots[0])

    status = run(["git", "status", "--porcelain"], repo_root)
    if status.returncode != 0:
        output(
            {
                "permission": "allow",
                "user_message": f"Ship-it hook: git status failed: {status.stderr.strip()}",
            }
        )
        return

    if not status.stdout.strip():
        output(
            {
                "permission": "allow",
                "user_message": "Ship-it hook: no local changes to commit.",
            }
        )
        return

    add = run(["git", "add", "-A"], repo_root)
    if add.returncode != 0:
        output(
            {
                "permission": "allow",
                "user_message": f"Ship-it hook: git add failed: {add.stderr.strip()}",
            }
        )
        return

    stamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    commit_msg = f"chore: ship it ({stamp})"
    commit = run(["git", "commit", "-m", commit_msg], repo_root)
    if commit.returncode != 0:
        output(
            {
                "permission": "allow",
                "user_message": f"Ship-it hook: git commit failed: {commit.stderr.strip()}",
            }
        )
        return

    push = run(["git", "push"], repo_root)
    if push.returncode != 0:
        output(
            {
                "permission": "allow",
                "user_message": f"Ship-it hook: commit made, but push failed: {push.stderr.strip()}",
            }
        )
        return

    output(
        {
            "permission": "allow",
            "user_message": "Ship-it hook: changes committed and pushed successfully.",
        }
    )


if __name__ == "__main__":
    main()
