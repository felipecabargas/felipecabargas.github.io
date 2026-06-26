---
title: "Introducing Gambit: PM Skills That Actually QA Themselves"
date: "June 26, 2026"
sortDate: "2026-06-26"
type: essay
topics: [ai, product, tools]
tags: [AI, Product Management, Open Source]
excerpt: "I built an open-source library of PM skills for AI assistants. Not to make PMs faster, but to make AI outputs less likely to quietly fail them."
readtime: "5 min read"
slug: introducing-gambit
---

I've been using AI in my PM work long enough to know what the failure mode looks like.

You get faster. Feature requests come out cleaner. Discovery summaries take half the time. And then, three sprints later, you're in a retro trying to explain why a feature that looked solid on paper shipped with the wrong acceptance criteria, or missed an edge case the research should have caught, or solved a problem users never actually had.

The AI didn't lie to you. It gave you a plausible output. You didn't catch it because you were reviewing it the same way you review a colleague's draft, scanning for obvious errors without interrogating the reasoning underneath.

That's the problem Gambit is trying to fix.

## What Gambit Is

[Gambit](https://github.com/felipecabargas/gambit) is an open-source library of PM skills for AI assistants. Structured workflows, built-in quality gates, covering the most common PM tasks: feature requests, discovery mapping, roadmaps, PRDs, user stories, release notes.

It's available as a plugin on [Claude's community marketplace](https://claude.com/plugins) and indexed in the Antigravity/Gemini CLI extensions directory.

The skills aren't prompts. They're workflows. And the difference matters.

A prompt asks the model to produce something. A skill asks the model to produce something and then check whether it actually should have. Every Gambit skill has checkpoints baked in, moments where the model validates its own output against a standard before it reaches you.

The feature request skill won't assemble a FR until it's confirmed that acceptance criteria cover the happy path, the edge cases, and the failure states. The roadmap skill won't output until each initiative maps to a strategic objective. The discovery skill won't just summarize what users said. It'll flag where the evidence is thin and where a pattern might be a coincidence.

## Why This Matters

The default advice for using AI in PM work is better prompting. Be more specific. Add context. Give examples. That advice is correct. It's also not enough.

The problem isn't prompting. It's that AI outputs are epistemically uncertain. You can't reliably know if an output is right, even when it looks right. A well-written feature request with bad acceptance criteria reads almost identically to one with good acceptance criteria. The surface is indistinguishable.

You can't QA an AI output the way you QA a build. A build works or it doesn't. An AI output is always plausible, and plausible is not the same as correct.

Gambit moves the QA into the workflow. If the model has to satisfy a quality gate before generating output, you catch the failure earlier and at a lower cost. Not always. But significantly more often.

The philosophy underneath is simple: reduce uncertainty in the process so you can tolerate uncertainty in the outcome. You're going to ship AI-generated artifacts with imperfect information. The question is whether you do it with or without a structured check on the work.

## What's in the Library

The current skills cover the core PM workflow:

- **`map-discovery`**: Structures raw research findings into patterns, distinguishes validated insights from assumptions, and flags evidence gaps before summary.
- **`write-feature-request`**: Drafts a feature request with acceptance criteria, then verifies coverage across happy paths, edge cases, and failure states before output.
- **`write-roadmap`**: Builds a roadmap narrative and checks each initiative against defined OKRs before returning it.
- **`write-prd`**: Produces a full PRD with sections for problem, hypothesis, success metrics, and out-of-scope, and validates internal consistency.
- **`write-user-stories`**: Breaks features into user stories in standard format, checks for missing context, and flags stories too large to estimate reliably.
- **`write-release-notes`** and **`write-change-log`**: Generates user-facing and internal changelog entries calibrated to the audience.

Each skill is a `SKILL.md` file. The format is open. Fork them, modify the gates, add your own, or contribute back to the repo.

## What It Doesn't Do

Gambit won't write your strategy. It won't tell you what to build. It won't replace the judgment that comes from knowing your users, your market, and your constraints.

What it will do is make sure that once you've made a call, the artifact you generate to execute on it isn't quietly wrong in ways you'll only discover when it's expensive.

That's a narrower promise than most AI tooling makes. I think it's a more honest one.

## How to Get It

**Via Claude:** Install from [claude.com/plugins](https://claude.com/plugins) and search for Gambit. Once installed, the skills are available in any Claude conversation.

**Via Gemini CLI:** The library is indexed in the Antigravity/Gemini CLI extensions directory under `felipecabargasgambit`.

**From source:** The full library is at [github.com/felipecabargas/gambit](https://github.com/felipecabargas/gambit). Clone it, read the SKILL.md files, use them directly, or adapt them for your setup.

## Why Open Source

Because the value in a PM skills library isn't in keeping it proprietary. It's in making it good enough that people actually use it and improve it.

The quality gates I've built reflect my failure modes. Someone else's will be different. The library gets better when more people are finding the holes.

If you use it and something's wrong, open an issue. Or fork it and send a PR. The repo is there for both.

---

*Gambit is open source under MIT. The code is at [github.com/felipecabargas/gambit](https://github.com/felipecabargas/gambit). The Claude plugin is listed at [claude.com/plugins](https://claude.com/plugins).*
