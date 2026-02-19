document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const catImg = document.getElementById('cat-img');
    const mainCard = document.getElementById('main-card');
    const successMessage = document.getElementById('success-message');
    const heartsContainer = document.getElementById('hearts-container');
    const mainTitle = document.getElementById('main-title');

    // Settings / Creator Elements
    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('open-settings-btn');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const generateLinkBtn = document.getElementById('generate-link-btn');
    const recipientNameInput = document.getElementById('recipient-name');
    const charBtns = document.querySelectorAll('.char-btn');

    // Reply Elements
    const replyInput = document.getElementById('reply-input');
    const sendReplyBtn = document.getElementById('send-reply-btn');

    // State
    let angerLevel = 0;
    const maxAnger = 3;

    // Default config
    let currentAnimal = 'cat';
    let recipientName = 'Valentine';

    // Valid animals
    const premiumAnimals = ['panda', 'orca', 'penguin', 'owl'];

    // Asset Map
    const animalImages = {
        cat: [
            'assets/cat_0_neutral.png',
            'assets/cat_1_annoyed.png',
            'assets/cat_2_angry.png',
            'assets/cat_3_furious.png',
            'assets/cat_happy.png'
        ],
        dog: [
            'assets/dog_0_neutral.png',
            'assets/dog_1_annoyed.png',
            'assets/dog_2_angry.png',
            'assets/dog_3_furious.png',
            'assets/dog_happy.png'
        ],
        panda: [
            'assets/panda_0_neutral.png',
            'assets/panda_1_annoyed.png',
            'assets/panda_2_angry.png',
            'assets/panda_3_furious.png',
            'assets/panda_happy.png'
        ],
        orca: [
            'assets/orca_0_neutral.png',
            'assets/orca_1_annoyed.png',
            'assets/orca_2_angry.png',
            'assets/orca_3_furious.png',
            'assets/orca_happy.png'
        ],
        // PLACEHOLDERS (Using Panda for now)
        penguin: [
            'assets/panda_0_neutral.png',
            'assets/panda_1_annoyed.png',
            'assets/panda_2_angry.png',
            'assets/panda_3_furious.png',
            'assets/panda_happy.png'
        ],
        owl: [
            'assets/panda_0_neutral.png',
            'assets/panda_1_annoyed.png',
            'assets/panda_2_angry.png',
            'assets/panda_3_furious.png',
            'assets/panda_happy.png'
        ]
    };

    // Preload all images
    Object.values(animalImages).forEach(imagesArray => {
        imagesArray.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    });

    // --- Initialization ---

    function init() {
        // Parse URL params
        const urlParams = new URLSearchParams(window.location.search);
        const nameParam = urlParams.get('name');
        const animalParam = urlParams.get('animal');

        // IF RECIPIENT MODE (name is present):
        // Allow using premium animals without unlocking (Recipients just view)
        if (nameParam) {
            recipientName = nameParam;
            recipientNameInput.value = recipientName;

            if (animalParam && animalImages[animalParam]) {
                currentAnimal = animalParam;
                // Don't show lock UI in Recipient mode
            }
            openSettingsBtn.classList.add('hidden'); // Hide settings button if URL has params
        } else {
            // CREATOR MODE:
            // Check Lock Status
            checkPremiumStatus();

            // Show Settings first
            settingsModal.classList.remove('hidden');
        }

        updateUI();
    }

    // Check if user has unlocked premium
    function checkPremiumStatus() {
        const isPremium = localStorage.getItem('isPremium') === 'true';

        charBtns.forEach(btn => {
            const animal = btn.dataset.animal;
            if (premiumAnimals.includes(animal)) {
                if (isPremium) {
                    btn.classList.remove('locked');
                    const lockIcon = btn.querySelector('.lock-icon');
                    if (lockIcon) lockIcon.style.display = 'none';
                } else {
                    btn.classList.add('locked');
                    const lockIcon = btn.querySelector('.lock-icon');
                    if (lockIcon) lockIcon.style.display = 'block'; // Ensure lock icon is visible
                }
            }
        });
    }

    function updateUI() {
        // Update Title
        mainTitle.textContent = `Will you be my Valentine, ${recipientName}?`;

        // Update Image
        updateAnimalImage();

        // Update background based on animal (optional subtle change)
        updateThemeColors();
    }

    function updateAnimalImage() {
        catImg.src = animalImages[currentAnimal][angerLevel];
        catImg.alt = `Cute ${currentAnimal} looking ${['neutral', 'annoyed', 'angry', 'furious', 'happy'][angerLevel]}`;

        // Reset transforms
        catImg.style.transform = 'none';

        if (angerLevel === 3) {
            document.body.style.backgroundColor = '#ffe0e6'; // Default angry bg
            if (currentAnimal === 'dog') document.body.style.backgroundColor = '#e6f2ff';
            if (currentAnimal === 'panda') document.body.style.backgroundColor = '#e8f5e9'; // Light green ish
            if (currentAnimal === 'orca') document.body.style.backgroundColor = '#e0f7fa'; // Light cyan
            if (currentAnimal === 'penguin') document.body.style.backgroundColor = '#e3f2fd'; // Ice Blue
            if (currentAnimal === 'owl') document.body.style.backgroundColor = '#e8eaf6'; // Nightish Blue
        } else {
            document.body.style.backgroundColor = '#fff0f3'; // Reset to default pink
        }
    }

    function updateThemeColors() {
        let newBgColor = '#fff0f3'; // Default pink
        if (angerLevel === 3) {
            switch (currentAnimal) {
                case 'cat':
                    newBgColor = '#ffe0e6'; break; // Light pink
                case 'dog':
                    newBgColor = '#e6f2ff'; break; // Light blue
                case 'panda':
                    newBgColor = '#e8f5e9'; break; // Light green
                case 'orca':
                    newBgColor = '#e0f7fa'; break; // Light cyan
                case 'penguin':
                    newBgColor = '#e3f2fd'; break; // Ice Blue
                case 'owl':
                    newBgColor = '#e8eaf6'; break; // Nightish Blue
            }
        } else {
            newBgColor = '#fff0f3'; // Reset to default pink
        }
        document.body.style.backgroundColor = newBgColor;
        // Potentially update other CSS variables here for more comprehensive theming
    }

    function updateCharBtnActiveState(animal) {
        charBtns.forEach(btn => {
            if (btn.dataset.animal === animal) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // --- Settings / Creator Logic ---

    // Elements
    const premiumModal = document.getElementById('premium-modal');
    const closePremiumBtn = document.getElementById('close-premium-btn');
    const unlockBtn = document.getElementById('unlock-btn');

    openSettingsBtn.addEventListener('click', () => {
        checkPremiumStatus(); // Re-check in case
        settingsModal.classList.remove('hidden');
        // Ensure settings reflect current state when opened
        recipientNameInput.value = recipientName;
        updateCharBtnActiveState(currentAnimal);
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
        // Update main UI in case changes were made and not saved via link generation
        updateUI();
    });

    // Close on click outside modal content
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
            updateUI();
        }
    });

    // Premium Modal Logic
    closePremiumBtn.addEventListener('click', () => {
        premiumModal.classList.add('hidden');
    });

    unlockBtn.addEventListener('click', () => {
        // SIMULATE PAYMENT
        unlockBtn.textContent = 'Processing... 💳';

        setTimeout(() => {
            localStorage.setItem('isPremium', 'true');
            checkPremiumStatus(); // Updates UI to remove locks
            premiumModal.classList.add('hidden');
            alert('Payment Successful! Premium Features Unlocked! 💎');

            // Auto-select the last clicked premium animal? Or just let them click it again.
        }, 1500);
    });

    charBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const animal = btn.dataset.animal;
            const isLocked = btn.classList.contains('locked');

            if (isLocked) {
                // Show Upsell
                premiumModal.classList.remove('hidden');
                return;
            }

            currentAnimal = animal;
            updateCharBtnActiveState(currentAnimal);
            angerLevel = 0;
            updateUI();
        });
    });

    recipientNameInput.addEventListener('input', (e) => {
        recipientName = e.target.value || 'Valentine'; // Default to 'Valentine' if empty
        // No need to call updateUI here, as it's called on modal close or link generation
    });

    generateLinkBtn.addEventListener('click', () => {
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();
        params.set('name', recipientName);
        params.set('animal', currentAnimal);

        const shareUrl = `${baseUrl}?${params.toString()}`;

        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            const originalText = generateLinkBtn.textContent;
            generateLinkBtn.textContent = 'Link Copied! 📋';
            setTimeout(() => {
                generateLinkBtn.textContent = originalText;
                settingsModal.classList.add('hidden'); // Close modal after copying
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers or if clipboard access is denied
            prompt('Copy this link manually:', shareUrl);
        });
    });


    // --- Interaction Logic (The Game) ---

    // Mobile check
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768 ||
        'ontouchstart' in window;

    // Proximity
    document.addEventListener('mousemove', (e) => {
        if (!isMobile) handleProximity(e.clientX, e.clientY);
    });

    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            handleProximity(e.touches[0].clientX, e.touches[0].clientY);
            if (e.target === noBtn) e.preventDefault(); // Prevent scrolling
        }
    }, { passive: false });

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            handleProximity(e.touches[0].clientX, e.touches[0].clientY);
            if (e.target === noBtn) e.preventDefault(); // Prevent iOS zoom/scroll issues
        }
    }, { passive: false });


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

    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const rect = noBtn.getBoundingClientRect();
        moveButtonAway(e.clientX, e.clientY, rect.left + rect.width / 2, rect.top + rect.height / 2);
        increaseAnger();
    });

    let angerTimeout;
    function increaseAnger() {
        if (angerTimeout) return;

        angerTimeout = setTimeout(() => {
            if (angerLevel < maxAnger) {
                angerLevel++;
                updateAnimalImage();
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

        // Safe boundaries - ensure button stays fully visible
        const margin = isMobile ? 20 : 15;
        const minX = margin;
        const maxX = viewportWidth - btnWidth - margin;
        const minY = margin;
        const maxY = viewportHeight - btnHeight - margin;

        // Account for iOS Safari UI and ensure button is always visible
        let safeMinY = minY;
        let safeMaxY = maxY;
        if (isMobile) {
            // More conservative boundaries for mobile to account for browser UI
            safeMinY = Math.max(margin, viewportHeight * 0.1);
            safeMaxY = Math.min(maxY, viewportHeight * 0.8);
        } else {
            // Desktop - ensure we don't go too close to edges
            safeMaxY = Math.min(maxY, viewportHeight - btnHeight - 40);
        }

        // Debug: ensure boundaries are valid
        if (safeMaxY <= safeMinY) {
            safeMaxY = viewportHeight - btnHeight - 20;
            safeMinY = 20;
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
                const dirY = dirY / length;

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

        // Final safety check - ensure button stays completely within viewport
        newX = Math.max(0, Math.min(newX, viewportWidth - btnWidth));
        newY = Math.max(0, Math.min(newY, viewportHeight - btnHeight));

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

    // --- Success Logic ---

    yesBtn.addEventListener('click', () => {
        // Happy State
        catImg.src = animalImages[currentAnimal][4];
        catImg.classList.remove('shake');
        catImg.style.transform = 'scale(1.1)';

        // Hide main card
        mainCard.style.opacity = '0';
        setTimeout(() => {
            mainCard.style.display = 'none';
            successMessage.classList.remove('hidden');
            setTimeout(() => successMessage.classList.add('visible-success'), 50);
        }, 500);

        noBtn.style.display = 'none';
        startConfetti();
    });

    sendReplyBtn.addEventListener('click', async () => {
        const message = replyInput.value;
        const shareText = `Hey ${recipientName}, I said YES! ❤️\n${message ? `"${message}"` : ''}\n`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'She said YES!',
                    text: shareText,
                    url: shareUrl
                });
                sendReplyBtn.textContent = 'Shared! ❤️';
            } catch (err) {
                // Determine if this was a user cancellation or an actual error
                if (err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                    copyToClipboard(`${shareText} ${shareUrl}`);
                }
            }
        } else {
            // Desktop fallback
            copyToClipboard(`${shareText} ${shareUrl}`);
        }
    });

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = sendReplyBtn.textContent;
            sendReplyBtn.textContent = 'Copied! Paste it to your Valentine 📋';
            setTimeout(() => {
                sendReplyBtn.textContent = originalText;
            }, 3000);
            alert('Message copied to clipboard! You can now paste it in WhatsApp, iMessage, etc.');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            prompt('Copy this message to send to your Valentine:', text);
        });
    }

    function startConfetti() {
        const duration = 5000;
        const interval = setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart-shape');
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 2 + 3 + 's';
            const size = Math.random() * 20 + 20;
            heart.style.width = `${size}px`;
            heart.style.height = `${size}px`;
            const colors = ['#ff4d6d', '#c9184a', '#ff758f', '#ff8fa3'];
            heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            heartsContainer.appendChild(heart);
            setTimeout(() => heart.remove(), 5000);
        }, 100);
        setTimeout(() => clearInterval(interval), duration * 2);
    }

    // Initialize
    init();

});
