# Project: Be My Valentine?

## Objective
The primary objective of this project is to create a fun, interactive, and lighthearted web-based experience to ask a special person to be the user's Valentine. It is designed as a "game" where the outcome is rigged in a playful way to ensure a "Yes" answer.

## Core Concept
The application presents the user with a simple question: "Will you be my Valentine?".
- **The "Yes" Option**: Easily clickable and triggers a celebratory sequence.
- **The "No" Option**: Designed to be unclickable. As the user attempts to click or tap it, the button evades the cursor/touch, moving to a new location on the screen.

## Key Features
1.  **Unclickable "No" Button**:
    - The button detects cursor proximity or touch events and moves away before it can be clicked.
    - Uses smart positioning logic to stay within the viewport and avoid overlapping with the "Yes" button.
    - optimized for both Desktop (mouse) and Mobile (touch) experiences.

2.  **Emotional Feedback System**:
    - A character (Cat or Dog) reacts to the user's persistence in trying to click "No".
    - **Anger Levels**: The character transitions from neutral -> annoyed -> angry -> furious as the user chases the "No" button.
    - **Persuasion**: The "Yes" button grows larger with each attempt to click "No", subtly guiding the user to the desired action.

3.  **Customization**:
    - Users can toggle between a **Cat** and a **Dog** as the reactive character.

4.  **Celebration**:
    - Clicking "Yes" triggers a "Yayyy!" success message.
    - The character becomes happy.
    - A confetti animation of hearts fills the screen.

5.  **Responsive Design**:
    - Fully responsive layout ensuring the experience works smoothly on both desktop monitors and mobile devices (including iPhone 17 Pro optimizations).

## Technical Stack
- **HTML5**: Semantic structure.
- **CSS3**: Styling with glassmorphism effects, animations, and responsive layouts.
- **JavaScript (Vanilla)**: Logic for button avoidance, state management (anger levels), touch handling, and DOM manipulation.
