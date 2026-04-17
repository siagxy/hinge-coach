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


def changed_paths_from_status(status_output):
    paths = []
    for line in status_output.splitlines():
        if not line.strip():
            continue
        # porcelain format: XY <path> [-> <new_path>]
        raw_path = line[3:].strip()
        if " -> " in raw_path:
            raw_path = raw_path.split(" -> ", 1)[1].strip()
        paths.append(raw_path)
    return paths


def infer_commit_message(paths):
    files = set(paths)

    touched_tone_setup = "components/ToneSetup.tsx" in files
    touched_prompts = "lib/prompts.ts" in files
    touched_types = "lib/types.ts" in files

    if touched_tone_setup and (touched_prompts or touched_types):
        return "feat: revamp onboarding profile flow and AI prompt context"

    if touched_tone_setup:
        return "feat: redesign tone setup onboarding experience"

    if touched_prompts:
        return "feat: improve AI system prompt personalization"

    if touched_types:
        return "chore: expand profile types for onboarding data"

    if len(files) == 1:
        only = next(iter(files))
        return f"chore: update {only}"

    if len(files) <= 3:
        compact = ", ".join(sorted(files))
        return f"chore: update {compact}"

    stamp = datetime.datetime.now().strftime("%Y-%m-%d")
    return f"chore: ship changes ({len(files)} files, {stamp})"


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

    changed_paths = changed_paths_from_status(status.stdout)

    add = run(["git", "add", "-A"], repo_root)
    if add.returncode != 0:
        output(
            {
                "permission": "allow",
                "user_message": f"Ship-it hook: git add failed: {add.stderr.strip()}",
            }
        )
        return

    commit_msg = infer_commit_message(changed_paths)
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
