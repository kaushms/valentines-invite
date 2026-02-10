document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const catImg = document.getElementById('cat-img');
    const mainCard = document.getElementById('main-card');
    const successMessage = document.getElementById('success-message');
    const heartsContainer = document.getElementById('hearts-container');

    let angerLevel = 0;
    const maxAnger = 3;

    // Cat image paths
    const catImages = [
        'assets/cat_0_neutral.png',
        'assets/cat_1_annoyed.png',
        'assets/cat_2_angry.png',
        'assets/cat_3_furious.png',
        'assets/cat_happy.png'
    ];

    // Preload images
    catImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Proximity detection for "No" button
    document.addEventListener('mousemove', (e) => {
        handleProximity(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleProximity(touch.clientX, touch.clientY);
        }
    });

    const reactionDistance = 120; // Distance in pixels to trigger movement
    const moveDistance = 150; // How far to move aggressively

    function handleProximity(x, y) {
        if (noBtn.style.display === 'none') return;

        const btnRect = noBtn.getBoundingClientRect();
        const btnX = btnRect.left + btnRect.width / 2;
        const btnY = btnRect.top + btnRect.height / 2;

        const dist = Math.hypot(x - btnX, y - btnY);

        if (dist < reactionDistance) {
            moveButtonAway(x, y, btnX, btnY);
            increaseAnger();
        }
    }

    let angerTimeout;

    function increaseAnger() {
        // Debounce anger increase slightly
        if (angerTimeout) return;

        angerTimeout = setTimeout(() => {
            if (angerLevel < maxAnger) {
                angerLevel++;
                updateCat();
                growYesButton();
            } else {
                if (!catImg.classList.contains('shake')) {
                    catImg.classList.add('shake');
                    if (navigator.vibrate) navigator.vibrate(200);
                }
            }
            angerTimeout = null;
        }, 200);
    }

    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Force move if clicked
        const rect = noBtn.getBoundingClientRect();
        moveButtonAway(e.clientX, e.clientY, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });

    // Handle "Yes" button click
    yesBtn.addEventListener('click', () => {
        showSuccess();
    });

    function updateCat() {
        catImg.src = catImages[angerLevel];

        // Reset transforms to handle state changes cleanly
        catImg.style.transform = 'none';

        if (angerLevel === 3) {
            document.body.style.backgroundColor = '#ffe0e6';
        }
    }

    function moveButtonAway(cursorX, cursorY, btnX, btnY) {
        if (noBtn.style.position !== 'fixed') {
            noBtn.style.position = 'fixed';
            noBtn.style.zIndex = '100';
            noBtn.style.transition = 'left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), top 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)'; // Smooth ease-out
        }

        // Calculate vector from cursor to button
        let deltaX = btnX - cursorX;
        let deltaY = btnY - cursorY;

        // If cursor is exactly on button (click attempt), move random
        if (deltaX === 0 && deltaY === 0) {
            deltaX = Math.random() - 0.5;
            deltaY = Math.random() - 0.5;
        }

        // Normalize
        const length = Math.hypot(deltaX, deltaY);
        const dirX = deltaX / length;
        const dirY = deltaY / length;

        // Move away aggressively
        let newX = btnX + dirX * moveDistance - (noBtn.offsetWidth / 2);
        let newY = btnY + dirY * moveDistance - (noBtn.offsetHeight / 2);

        // Enhanced boundary checks to keep button well within screen
        const margin = 50; // Increased margin to keep button more visible
        const maxX = window.innerWidth - noBtn.offsetWidth - margin;
        const maxY = window.innerHeight - noBtn.offsetHeight - margin;

        // If the new position would go off screen, find a better position
        if (newX < margin || newX > maxX || newY < margin || newY > maxY) {
            // Find alternative positions - try different angles
            const angles = [45, -45, 135, -135, 90, -90, 0, 180];
            for (let angle of angles) {
                const rad = (angle * Math.PI) / 180;
                const testX = btnX + Math.cos(rad) * moveDistance - (noBtn.offsetWidth / 2);
                const testY = btnY + Math.sin(rad) * moveDistance - (noBtn.offsetHeight / 2);
                
                if (testX >= margin && testX <= maxX && testY >= margin && testY <= maxY) {
                    newX = testX;
                    newY = testY;
                    break;
                }
            }
        }

        // Final clamp as fallback to ensure it stays on screen
        newX = Math.max(margin, Math.min(newX, maxX));
        newY = Math.max(margin, Math.min(newY, maxY));

        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
    }

    function growYesButton() {
        const currentScale = parseFloat(yesBtn.style.transform.replace('scale(', '').replace(')', '')) || 1;
        const newScale = currentScale * 1.15;
        yesBtn.style.transform = `scale(${newScale})`;
    }

    function showSuccess() {
        // Make cat happy
        catImg.src = catImages[4]; // Happy cat
        catImg.classList.remove('shake');

        // Visuals for happy cat
        catImg.style.transform = 'scale(1.1)';

        // Hide card
        mainCard.style.opacity = '0';
        mainCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            mainCard.style.display = 'none';
            // Show success message
            successMessage.classList.remove('hidden');
            setTimeout(() => {
                successMessage.classList.add('visible-success');
            }, 50);
        }, 500);

        // Hide floating no button if visible
        noBtn.style.display = 'none';

        startConfetti();
    }

    function startConfetti() {
        const duration = 5000; // 5 seconds of hearts
        const interval = setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart-shape'); // CSS shape class
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 2 + 3 + 's';
            // Random sizes
            const size = Math.random() * 20 + 20;
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;

            // Random colors (reds/pinks)
            const colors = ['#ff4d6d', '#c9184a', '#ff758f', '#ff8fa3'];
            heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            heartsContainer.appendChild(heart);

            // Clean up
            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, 100);

        // Stop creating after some time
        setTimeout(() => {
            clearInterval(interval);
        }, duration * 2);
    }
});
