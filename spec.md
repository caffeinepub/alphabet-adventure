# Alphabet Adventure

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Full kids learning game with 4 main sections: Alphabet Learning, Word Builder, Sentence Builder, Mini Games
- Rewards system: stars, badges, confetti animations, level progression
- Parent dashboard: tracks per-child progress, stars earned, activities completed, difficulty level
- Authorization for parent login to access dashboard
- Backend: stores progress records (stars, badges, completed activities, level) per user

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan

### Backend
- `saveProgress(activity: Text, starsEarned: Nat, level: Nat)` — save a progress entry
- `getProgress()` — return all progress entries for the caller
- `getTotalStars()` — return total stars earned
- `getBadges()` — return list of earned badge names
- `resetProgress()` — clear progress for caller

### Frontend
1. Home screen — animated title, character mascot, 4 mode buttons + parent login link
2. Alphabet Learning — A–Z grid, tap letter to hear pronunciation + see object image/emoji, big colorful cards
3. Word Builder — drag-and-drop letters onto slots to form words (CAT, DOG, SUN, CAR, etc.), success animation + sound
4. Sentence Builder — scrambled word chips, drag to reorder into correct sentence
5. Mini Games:
   - Letter Matching: match uppercase to lowercase
   - Picture to Word: match emoji/picture to correct word
   - Missing Letter: fill in the blank (C _ T)
6. Rewards: confetti animation on task complete, star counter, badge collection screen
7. Parent Dashboard: login-gated view, shows progress chart, stars, badges, session history
8. Sound: Web Speech API for letter/word pronunciation; simple Audio tones for feedback
9. Responsive layout optimized for tablets and phones, large touch targets
