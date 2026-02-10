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

    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                    window.innerWidth <= 768 || 
                    'ontouchstart' in window;

    // Proximity detection for "No" button
    document.addEventListener('mousemove', (e) => {
        if (!isMobile) { // Only on desktop
            handleProximity(e.clientX, e.clientY);
        }
    });

    // Enhanced touch handling for mobile
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleProximity(touch.clientX, touch.clientY);
            // Prevent default to avoid iOS zoom/scroll issues
            if (e.target === noBtn) {
                e.preventDefault();
            }
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleProximity(touch.clientX, touch.clientY);
            // Prevent scrolling when interacting with button area
            if (e.target === noBtn) {
                e.preventDefault();
            }
        }
    });

    // Mobile-optimized distances - less aggressive
    const reactionDistance = isMobile ? 80 : 100; // Closer trigger for easier interaction
    const moveDistance = isMobile ? 80 : 100; // Less aggressive movement, still playful

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
        }

        // Mobile-optimized animations - smoother and less bouncy
        const transitionDuration = isMobile ? '0.6s' : '0.7s';
        const easingFunction = 'cubic-bezier(0.25, 0.8, 0.25, 1)'; // Smooth easing for both
        
        noBtn.style.transition = `left ${transitionDuration} ${easingFunction}, top ${transitionDuration} ${easingFunction}, transform 0.15s ease`;
        
        // Subtle pop effect
        const popScale = '1.05';
        noBtn.style.transform = `scale(${popScale})`;
        setTimeout(() => {
            noBtn.style.transform = 'scale(1)';
        }, 100);

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const btnRect = noBtn.getBoundingClientRect();
        const btnWidth = btnRect.width;
        const btnHeight = btnRect.height;

        // Safe boundaries
        const margin = isMobile ? 30 : 25;
        const minX = margin;
        const maxX = viewportWidth - btnWidth - margin;
        const minY = margin;
        const maxY = viewportHeight - btnHeight - margin;

        // Account for iOS Safari UI on mobile
        let safeMinY = minY;
        let safeMaxY = maxY;
        if (isMobile) {
            safeMinY = Math.max(margin, viewportHeight * 0.08);
            safeMaxY = Math.min(maxY, viewportHeight * 0.85);
        }

        // Get Yes button position to avoid overlap
        const yesBtnRect = yesBtn.getBoundingClientRect();
        const yesBtnX = yesBtnRect.left;
        const yesBtnY = yesBtnRect.top;
        const yesBtnWidth = yesBtnRect.width;
        const yesBtnHeight = yesBtnRect.height;
        
        // Minimum distance between buttons to prevent overlap
        const minButtonDistance = Math.max(yesBtnWidth, yesBtnHeight) + (isMobile ? 60 : 40);

        function checkOverlapWithYesBtn(x, y) {
            const centerX = x + btnWidth / 2;
            const centerY = y + btnHeight / 2;
            const yesCenterX = yesBtnX + yesBtnWidth / 2;
            const yesCenterY = yesBtnY + yesBtnHeight / 2;
            const distance = Math.hypot(centerX - yesCenterX, centerY - yesCenterY);
            return distance < minButtonDistance;
        }

        // Add randomness to movement - mix of directional and random
        let newX, newY;
        let attempts = 0;
        const maxAttempts = 20;
        
        do {
            attempts++;
            
            // 60% chance for semi-random movement, 40% for directional
            if (Math.random() > 0.4) {
                // Random positioning with some bias away from cursor
                const randomZones = [
                    { x: viewportWidth * 0.15, y: safeMinY + (safeMaxY - safeMinY) * 0.2 },
                    { x: viewportWidth * 0.85 - btnWidth, y: safeMinY + (safeMaxY - safeMinY) * 0.2 },
                    { x: viewportWidth * 0.15, y: safeMinY + (safeMaxY - safeMinY) * 0.8 },
                    { x: viewportWidth * 0.85 - btnWidth, y: safeMinY + (safeMaxY - safeMinY) * 0.8 },
                    { x: viewportWidth * 0.5 - btnWidth / 2, y: safeMinY + (safeMaxY - safeMinY) * 0.15 },
                    { x: viewportWidth * 0.5 - btnWidth / 2, y: safeMinY + (safeMaxY - safeMinY) * 0.75 },
                    { x: viewportWidth * 0.3 - btnWidth / 2, y: safeMinY + (safeMaxY - safeMinY) * 0.5 },
                    { x: viewportWidth * 0.7 - btnWidth / 2, y: safeMinY + (safeMaxY - safeMinY) * 0.5 }
                ];
                
                // Filter out zones too close to cursor AND too close to Yes button
                const validZones = randomZones.filter(zone => {
                    const zoneCenterX = zone.x + btnWidth / 2;
                    const zoneCenterY = zone.y + btnHeight / 2;
                    const distanceFromCursor = Math.hypot(cursorX - zoneCenterX, cursorY - zoneCenterY);
                    const distanceFromYesBtn = Math.hypot((yesBtnX + yesBtnWidth / 2) - zoneCenterX, (yesBtnY + yesBtnHeight / 2) - zoneCenterY);
                    return distanceFromCursor > reactionDistance * 1.5 && distanceFromYesBtn > minButtonDistance;
                });
                
                if (validZones.length > 0) {
                    const randomZone = validZones[Math.floor(Math.random() * validZones.length)];
                    // Add some randomness within the zone
                    newX = randomZone.x + (Math.random() - 0.5) * 40;
                    newY = randomZone.y + (Math.random() - 0.5) * 30;
                } else {
                    // Fallback to opposite corner, ensuring no overlap
                    newX = cursorX < viewportWidth / 2 ? maxX - 50 : minX + 50;
                    newY = cursorY < viewportHeight / 2 ? safeMaxY - 30 : safeMinY + 30;
                }
            } else {
                // Directional movement (less aggressive)
                let deltaX = btnX - cursorX;
                let deltaY = btnY - cursorY;

                // If too close, add some randomness
                if (Math.hypot(deltaX, deltaY) < 50) {
                    deltaX += (Math.random() - 0.5) * 100;
                    deltaY += (Math.random() - 0.5) * 100;
                }

                // Normalize and apply gentler movement
                const length = Math.hypot(deltaX, deltaY);
                const dirX = deltaX / length;
                const dirY = deltaY / length;

                newX = btnX + dirX * moveDistance - (btnWidth / 2);
                newY = btnY + dirY * moveDistance - (btnHeight / 2);
            }
            
            // Ensure button stays within boundaries
            newX = Math.max(minX, Math.min(newX, maxX));
            newY = Math.max(safeMinY, Math.min(newY, safeMaxY));
            
        } while (checkOverlapWithYesBtn(newX, newY) && attempts < maxAttempts);
        
        // If we couldn't find a non-overlapping position after max attempts,
        // place it in a safe corner far from the Yes button
        if (attempts >= maxAttempts) {
            const corners = [
                { x: minX, y: safeMinY },
                { x: maxX, y: safeMinY },
                { x: minX, y: safeMaxY },
                { x: maxX, y: safeMaxY }
            ];
            
            // Find the corner furthest from the Yes button
            let bestCorner = corners[0];
            let maxDistance = 0;
            
            corners.forEach(corner => {
                const distance = Math.hypot((yesBtnX + yesBtnWidth / 2) - (corner.x + btnWidth / 2), 
                                         (yesBtnY + yesBtnHeight / 2) - (corner.y + btnHeight / 2));
                if (distance > maxDistance) {
                    maxDistance = distance;
                    bestCorner = corner;
                }
            });
            
            newX = bestCorner.x;
            newY = bestCorner.y;
        }

        // Apply position
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;

        // Gentle haptic feedback on mobile
        if (isMobile && navigator.vibrate) {
            navigator.vibrate(30); // Even shorter vibration
        }
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
