# Bodyweight Circuit

## Try it
Live app: https://Aayut1111.github.io/bodyweight-circuit/

## Overview
A no-equipment home workout web app. Pick a duration, focus area, and
difficulty; a randomized circuit is generated and driven by a live
work/rest interval timer, with a streak badge persisted between visits.

## Approach
Exercises live as plain data (id, muscle group, difficulty, instructions)
rather than scattered through app logic. The interval timer is a small
state machine with no DOM knowledge — it only calls back on phase changes,
ticks, and completion — so the UI layer stays a pure listener, same
one-directional pattern as the event-driven UI in my other projects. No
framework or build step: plain HTML, CSS, and JavaScript, deployed
directly from the repo root via GitHub Pages.