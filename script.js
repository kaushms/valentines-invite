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

        if (nameParam) {
            recipientName = nameParam;
            recipientNameInput.value = recipientName;
        } else {
            // If no name, assume Creator Mode -> Show Settings
            settingsModal.classList.remove('hidden');
        }

        if (animalParam && animalImages[animalParam]) {
            currentAnimal = animalParam;
            updateCharBtnActiveState(currentAnimal);
        }

        updateUI();
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
        } else {
            document.body.style.backgroundColor = '#fff0f3'; // Reset to default pink
        }
    }

    function updateThemeColors() {
        // Could be expanded to change primary colors based on animal
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

    openSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    // Close on click outside card
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    charBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentAnimal = btn.dataset.animal;
            updateCharBtnActiveState(currentAnimal);
            angerLevel = 0;
            updateUI();
        });
    });

    recipientNameInput.addEventListener('input', (e) => {
        recipientName = e.target.value || 'Valentine';
        updateUI();
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
                settingsModal.classList.add('hidden');
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            prompt('Copy this link:', shareUrl);
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
            if (e.target === noBtn) e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
            handleProximity(e.touches[0].clientX, e.touches[0].clientY);
            if (e.target === noBtn) e.preventDefault();
        }
    }, { passive: false });


    const reactionDistance = isMobile ? 80 : 100;

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

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const btnRect = noBtn.getBoundingClientRect();
        const btnWidth = btnRect.width;
        const btnHeight = btnRect.height;

        // Boundaries
        const margin = 20;
        const minX = margin;
        const maxX = viewportWidth - btnWidth - margin;
        const minY = margin;
        const maxY = viewportHeight - btnHeight - margin;

        // Random pos
        let newX = Math.random() * (maxX - minX) + minX;
        let newY = Math.random() * (maxY - minY) + minY;

        // Simple logic: just move it anywhere valid for now to keep it brisk
        // (Simplified from previous version to reduce code bloat, but still effective)

        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
    }

    function growYesButton() {
        const currentScale = parseFloat(yesBtn.style.transform.replace('scale(', '').replace(')', '')) || 1;
        yesBtn.style.transform = `scale(${currentScale * 1.15})`;
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

    sendReplyBtn.addEventListener('click', () => {
        const message = replyInput.value;
        if (!message.trim()) {
            alert('Please write a message!');
            return;
        }

        // Simulate sending
        console.log(`Sending reply to creator: "${message}"`);

        sendReplyBtn.textContent = 'Sent! ❤️';
        sendReplyBtn.disabled = true;
        replyInput.disabled = true;

        alert('Message sent! (Mock functionality)');
    });

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
