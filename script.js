// =========================
// PASSWORD
// =========================

const correctPassword = "chicken finger"; // The correct password for the game

const hints = [
    "No caps, no punctuation. 🐔",
    "Something sad looking? 🥲",
    "The crinkle cut fries...🍟",
    "🐔🐔🐔🐔🐔🐔🐔🐔",
    "You'll figure it out eventually",
    "Why is there only one? ",
    "Cold and sad looking",
    "Nuh uh, not that one",
    "Closer? Maybe not, these are all random hints.",
    "CHICKEN butt"
];

let heartBalloonTimer;
let noClickCount = 0;
let giftHasBeenOpened = false;
let pageBottomReached = false;

function updateOshawottPeekerVisibility() {

    if (giftHasBeenOpened && pageBottomReached) {
        document.getElementById("oshawott-peeker").classList.add("available");
    }
}

function checkPageBottom() {

    pageBottomReached = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 16;
    updateOshawottPeekerVisibility();
}

window.addEventListener("scroll", checkPageBottom, { passive: true });
window.addEventListener("resize", checkPageBottom);

function initOshawottPeeker() {

    const peekers = [...document.querySelectorAll(".oshawott-peeker, .oshawott-hidden")];
    const clickSound = document.getElementById("oshawott-click-sound");
    let foundCount = 0;

    clickSound.volume = 0.5;
    clickSound.load();

    peekers.forEach((peeker, index) => {
        const image = peeker.querySelector("img");
        const fallback = "🦦";
        let pressCount = 0;

        if (!peeker.classList.contains("oshawott-hidden")) {
            peeker.style.left = `${Math.random() * 72 + 14}%`;
        }

        image.addEventListener("error", () => {
            image.remove();
            peeker.textContent = fallback;
            peeker.classList.add("emoji-fallback");
        }, { once: true });

        peeker.addEventListener("click", () => {
            pressCount += 1;
            if (pressCount === 1) {
                image.src = "images/oshawott.gif";
                peeker.classList.add("popped-out", "gif-mode");
                return;
            }

            playOshawottClickSound(clickSound);
            peeker.classList.add("found");
            foundCount += 1;
            if (foundCount === peekers.length) {
                createConfetti();
                document.getElementById("oshawott-reward").classList.add("visible");
            }
        });
    });
}

function playOshawottClickSound(clickSound) {

    clickSound.currentTime = 0;
    const playback = clickSound.play();

    if (playback) {
        playback.catch((error) => {
            console.warn("The Oshawott MP3 could not be played:", error);
            playButtonSound();
        });
    }
}

initOshawottPeeker();

document.getElementById("secret-letter-trigger").addEventListener("click", () => {
    document.getElementById("secret-love-letter").classList.add("open");
});

function openPasswordScreen() {

    document.getElementById("welcome-screen").classList.add("welcome-hidden");
    document.getElementById("password-screen").classList.add("password-ready");
    startHeartBalloons();
}

function rejectGift() {

    const button = document.getElementById("no-button");
    const response = document.getElementById("no-response");
    const messages = ["nuh uh", "nope"];
    const actionArea = document.querySelector(".welcome-actions");
    const yesButton = document.getElementById("yes-button");
    noClickCount += 1;
    const buttonWidth = button.offsetWidth;
    const gap = 14;
    const yesScale = Math.min(1 + noClickCount * 0.14, 1.7);
    const yesVisualWidth = yesButton.offsetWidth * yesScale;
    const maxX = Math.max(0, actionArea.clientWidth - buttonWidth);
    const maxY = Math.max(0, actionArea.clientHeight - button.offsetHeight);
    const yesCenter = yesButton.offsetLeft + yesButton.offsetWidth / 2;
    const yesLeft = yesCenter - yesVisualWidth / 2;
    const yesRight = yesCenter + yesVisualWidth / 2;
    const leftZone = Math.max(0, yesLeft - buttonWidth - gap);
    const rightZoneStart = Math.min(maxX, yesRight + gap);
    const hasLeftZone = leftZone > 0;
    const hasRightZone = rightZoneStart < maxX;
    let safeX;

    response.textContent = messages[Math.floor(Math.random() * messages.length)];
    yesButton.style.transform = `scale(${yesScale})`;
    button.style.position = "absolute";
    if (hasLeftZone && hasRightZone) {
        safeX = Math.random() > 0.5
            ? Math.random() * leftZone
            : rightZoneStart + Math.random() * (maxX - rightZoneStart);
    } else if (hasLeftZone) {
        safeX = Math.random() * leftZone;
    } else {
        safeX = rightZoneStart;
    }
    button.style.left = `${safeX}px`;
    button.style.top = `${Math.random() * maxY}px`;
    button.style.transform = `scale(${Math.max(0, 1 - noClickCount * 0.2)})`;

    if (noClickCount >= 5) {
        button.style.opacity = "0";
        button.style.pointerEvents = "none";
    }
}

function updateCountdown() {

    const now = new Date();
    let target = new Date(now.getFullYear(), 8, 29);

    if (target <= now) {
        target = new Date(now.getFullYear() + 1, 8, 29);
    }

    const remaining = target - now;
    const days = Math.floor(remaining / 86400000);
    const hours = Math.floor((remaining % 86400000) / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    document.getElementById("countdown-days").textContent = String(days).padStart(2, "0");
    document.getElementById("countdown-hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("countdown-minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("countdown-seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

function startHeartBalloons() {

    for (let index = 0; index < 8; index++) spawnHeartBalloon(index * 240);
    heartBalloonTimer = setInterval(() => spawnHeartBalloon(), 900);
}

function spawnHeartBalloon(delay = 0) {

    setTimeout(() => {
        const container = document.getElementById("heart-balloons");
        if (!container || document.getElementById("password-screen").classList.contains("heart-reveal")) return;

        const balloon = document.createElement("button");
        const duration = 7 + Math.random() * 4;
        const colors = ["#c9576c", "#e88499", "#d98bd4", "#f29b75"];

        balloon.type = "button";
        balloon.className = "heart-balloon";
        balloon.setAttribute("aria-label", "Pop heart balloon");
        balloon.textContent = "♥";
        balloon.style.left = `${Math.random() * 88 + 6}%`;
        balloon.style.setProperty("--balloon-color", colors[Math.floor(Math.random() * colors.length)]);
        balloon.style.animationDuration = `${duration}s`;
        balloon.addEventListener("click", () => {
            playBalloonPopSound();
            balloon.remove();
        }, { once: true });
        balloon.addEventListener("animationend", (event) => {
            if (event.animationName === "heartBalloonRise") balloon.remove();
        });
        container.appendChild(balloon);
    }, delay);
}

function playBalloonPopSound() {

    catchAudioContext ??= new (window.AudioContext || window.webkitAudioContext)();

    if (catchAudioContext.state === "suspended") catchAudioContext.resume();

    const oscillator = catchAudioContext.createOscillator();
    const gain = catchAudioContext.createGain();
    const now = catchAudioContext.currentTime;
    const basePitch = [440, 494, 523, 587][Math.floor(Math.random() * 4)];
    const pitch = basePitch * (0.97 + Math.random() * 0.06);

    oscillator.type = Math.random() > 0.5 ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(pitch, now);
    oscillator.frequency.exponentialRampToValueAtTime(pitch * 1.8, now + 0.09);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    oscillator.connect(gain);
    gain.connect(catchAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.18);
}

function checkPassword() {

    const enteredPassword =
        document.getElementById("password").value;

    const wrongPassword =
        document.getElementById("wrong-password");

    if (enteredPassword === correctPassword) {

        const passwordScreen = document.getElementById("password-screen");
        const website = document.getElementById("website");

        clearInterval(heartBalloonTimer);
        document.getElementById("heart-balloons").replaceChildren();
        playHeartTransitionSound();
        website.classList.add("show");
        passwordScreen.classList.add("heart-reveal");

        setTimeout(() => {
            passwordScreen.style.display = "none";
            document.body.style.overflow = "auto";
        }, 3800);

    } else {

        // Pick a random hint
        const randomHint =
            hints[Math.floor(Math.random() * hints.length)];

        wrongPassword.textContent = randomHint;

        // Clear the password box
        document.getElementById("password").value = "";
    }
}


// =========================
// ALLOW PRESSING ENTER
// =========================

document.getElementById("password").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        checkPassword();
    }

});

document.addEventListener("click", function(event) {

    if (!(event.target instanceof Element)) return;

    const button = event.target.closest("button");
    if (button && button.id !== "gift" && !button.classList.contains("heart-balloon") && !button.classList.contains("oshawott-peeker") && !button.classList.contains("oshawott-hidden")) playButtonSound();
});


// =========================
// SCROLL
// =========================

function scrollToSection(sectionID) {

    document.getElementById(sectionID).scrollIntoView({
        behavior: "smooth"
    });

}


// =========================
// FINAL MESSAGE
// =========================

function showFinalMessage() {

    const message =
        document.getElementById("final-message");

    message.style.display = "block";
    startPlatformer();

}

function startPlatformer() {
    const world = document.getElementById("catcher-world");
    const player = document.getElementById("catcher-basket");
    const gift = document.getElementById("gift");
    const scoreElement = document.getElementById("catcher-score");
    const status = document.getElementById("catcher-status");
    const pointImage = world.dataset.pointImage;
    const penaltyImage = world.dataset.penaltyImage;
    const controls = { left: false, right: false };
    let playerX = 50;
    let score = 0;
    let running = true;
    let spawnTimer = 0;
    let lastTime = performance.now();
    let winSoundPlayed = false;
    let giftOpened = false;

    function openGift() {
        if (score < 10 || giftOpened) return;
        giftOpened = true;
        giftHasBeenOpened = true;
        playCelebrationSound("gift");
        gift.classList.add("open");
        document.getElementById("secret-message").classList.add("visible");
        createHearts();
        createConfetti();
        createBalloons();
        checkPageBottom();
    }

    function spawnItem() {
        const item = document.createElement("div");
        const isGood = Math.random() > 0.28;
        const image = document.createElement("img");
        item.className = `catcher-item ${isGood ? "point-item" : "penalty-item"}`;
        item.dataset.good = isGood;
        item.style.left = `${Math.random() * 88 + 6}%`;
        item.style.top = "-48px";
        image.src = isGood ? pointImage : penaltyImage;
        image.alt = isGood ? "Point object" : "Penalty object";
        image.onerror = () => {
            image.style.display = "none";
            item.classList.add("image-missing");
        };
        item.appendChild(image);
        world.appendChild(item);
    }

    function update(time) {
        if (!running) return;

        const delta = Math.min((time - lastTime) / 1000, 0.04);
        lastTime = time;
        const direction = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
        playerX = Math.max(0, Math.min(100, playerX + direction * 42 * delta));
        player.style.left = `${playerX}%`;
        spawnTimer += delta;

        if (spawnTimer > 0.62) {
            spawnTimer = 0;
            spawnItem();
        }

        const playerLeft = player.offsetLeft;
        const playerRight = playerLeft + player.offsetWidth;
        [...world.querySelectorAll(".catcher-item")].forEach((item) => {
            const speed = item.classList.contains("point-item") ? 145 : 185;
            item.style.top = `${item.offsetTop + speed * delta}px`;
            const touching = playerRight > item.offsetLeft && playerLeft < item.offsetLeft + item.offsetWidth && item.offsetTop + item.offsetHeight > player.offsetTop;

            if (touching) {
                const isGood = item.dataset.good === "true";
                score = Math.max(0, score + (isGood ? 1 : -1));
                scoreElement.textContent = score;
                status.textContent = isGood ? "+1 point!" : "-1 point!";
                if (isGood) {
                    playCatchSound("good");
                    createCatchSplash(world, player);
                } else {
                    playCatchSound("bad");
                    createCatchExplosion(world, player);
                }
                item.remove();
            } else if (item.offsetTop > world.clientHeight) {
                item.remove();
            }
        });

        if (score >= 10) {
            running = false;
            status.textContent = "You did it! Open the gift.";
            gift.hidden = false;
            gift.classList.add("revealed");
            if (!winSoundPlayed) {
                winSoundPlayed = true;
                playCelebrationSound("win");
            }
        }

        if (running) requestAnimationFrame(update);
    }

    function setControl(control, pressed) {
        controls[control] = pressed;
    }

    document.addEventListener("keydown", (event) => {
        const keyMap = { ArrowLeft: "left", ArrowRight: "right" };
        const control = keyMap[event.key];
        if (control) {
            event.preventDefault();
            setControl(control, true);
        }
    });

    document.addEventListener("keyup", (event) => {
        const control = { ArrowLeft: "left", ArrowRight: "right" }[event.key];
        if (control) setControl(control, false);
    });

    document.querySelectorAll("[data-control]").forEach((button) => {
        const control = button.dataset.control;
        button.addEventListener("pointerdown", () => setControl(control, true));
        button.addEventListener("pointerup", () => setControl(control, false));
        button.addEventListener("pointerleave", () => setControl(control, false));
    });

    gift.addEventListener("click", openGift);
    world.focus();
    requestAnimationFrame(update);
}

function createCatchSplash(world, player) {

    for (let index = 0; index < 8; index++) {
        const heart = document.createElement("span");
        const angle = (Math.PI * 2 * index) / 8;
        const distance = 30 + Math.random() * 28;

        heart.className = "catch-heart";
        heart.textContent = "♥";
        heart.style.left = `${player.offsetLeft + player.offsetWidth / 2 - 7}px`;
        heart.style.top = `${player.offsetTop + 2}px`;
        heart.style.setProperty("--heart-x", `${Math.cos(angle) * distance}px`);
        heart.style.setProperty("--heart-y", `${Math.sin(angle) * distance - 24}px`);
        heart.style.setProperty("--heart-rotation", `${Math.random() * 50 - 25}deg`);
        world.appendChild(heart);

        setTimeout(() => heart.remove(), 750);
    }
}

function createCatchExplosion(world, player) {

    const explosion = document.createElement("span");
    explosion.className = "catch-explosion";
    explosion.textContent = "✦";
    explosion.style.left = `${player.offsetLeft + player.offsetWidth / 2 - 20}px`;
    explosion.style.top = `${player.offsetTop - 8}px`;
    world.appendChild(explosion);

    for (let index = 0; index < 10; index++) {
        const spark = document.createElement("span");
        const angle = (Math.PI * 2 * index) / 10;
        const distance = 28 + Math.random() * 34;

        spark.className = "explosion-spark";
        spark.style.left = `${player.offsetLeft + player.offsetWidth / 2 - 3}px`;
        spark.style.top = `${player.offsetTop + player.offsetHeight / 2 - 3}px`;
        spark.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
        spark.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
        world.appendChild(spark);

        setTimeout(() => spark.remove(), 650);
    }

    setTimeout(() => explosion.remove(), 650);
}

let catchAudioContext;

function playCatchSound(type) {

    catchAudioContext ??= new (window.AudioContext || window.webkitAudioContext)();

    if (catchAudioContext.state === "suspended") {
        catchAudioContext.resume();
    }

    const oscillator = catchAudioContext.createOscillator();
    const gain = catchAudioContext.createGain();
    const now = catchAudioContext.currentTime;
    const isGood = type === "good";

    oscillator.type = isGood ? "sine" : "sawtooth";
    oscillator.frequency.setValueAtTime(isGood ? 620 : 160, now);
    oscillator.frequency.exponentialRampToValueAtTime(isGood ? 920 : 70, now + (isGood ? 0.16 : 0.28));
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (isGood ? 0.2 : 0.32));

    oscillator.connect(gain);
    gain.connect(catchAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + (isGood ? 0.22 : 0.34));
}

function playButtonSound() {

    catchAudioContext ??= new (window.AudioContext || window.webkitAudioContext)();

    if (catchAudioContext.state === "suspended") {
        catchAudioContext.resume();
    }

    const oscillator = catchAudioContext.createOscillator();
    const gain = catchAudioContext.createGain();
    const now = catchAudioContext.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(460, now);
    oscillator.frequency.exponentialRampToValueAtTime(620, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
    oscillator.connect(gain);
    gain.connect(catchAudioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.13);
}

function playCelebrationSound(type) {

    catchAudioContext ??= new (window.AudioContext || window.webkitAudioContext)();

    if (catchAudioContext.state === "suspended") {
        catchAudioContext.resume();
    }

    const notes = type === "win" ? [392, 523, 659, 784] : [523, 659];
    const noteLength = type === "win" ? 0.16 : 0.2;
    const now = catchAudioContext.currentTime;

    notes.forEach((frequency, index) => {
        const oscillator = catchAudioContext.createOscillator();
        const gain = catchAudioContext.createGain();
        const start = now + index * noteLength;

        oscillator.type = type === "win" ? "square" : "sine";
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.1, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + noteLength);
        oscillator.connect(gain);
        gain.connect(catchAudioContext.destination);
        oscillator.start(start);
        oscillator.stop(start + noteLength + 0.02);
    });
}

function playHeartTransitionSound() {

    catchAudioContext ??= new (window.AudioContext || window.webkitAudioContext)();

    if (catchAudioContext.state === "suspended") {
        catchAudioContext.resume();
    }

    const now = catchAudioContext.currentTime;
    const duration = 3.2;
    const notes = [261.63, 329.63, 392, 493.88, 392];
    const starts = [0, 0.42, 0.84, 1.26, 1.9];

    notes.forEach((frequency, index) => {
        const oscillator = catchAudioContext.createOscillator();
        const gain = catchAudioContext.createGain();
        const start = now + starts[index];
        const end = index === notes.length - 1 ? now + duration : start + 1.45;

        oscillator.type = index % 2 === 0 ? "sine" : "triangle";
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.045, start + 0.22);
        gain.gain.setValueAtTime(0.045, Math.max(start + 0.23, end - 0.35));
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        oscillator.connect(gain);
        gain.connect(catchAudioContext.destination);
        oscillator.start(start);
        oscillator.stop(end + 0.05);
    });
}

function createConfetti() {

    const colors = ["#c9576c", "#ffd46e", "#78b7a6", "#8d9ee8", "#f29b75"];

    for (let index = 0; index < 55; index++) {
        const piece = document.createElement("span");
        const duration = 2.5 + Math.random() * 2;

        piece.className = "celebration-confetti";
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.backgroundColor = colors[index % colors.length];
        piece.style.setProperty("--confetti-spin", `${Math.random() * 720 - 360}deg`);
        document.body.appendChild(piece);
        piece.animate(
            [
                { transform: "translateY(-20px) rotate(0deg)", opacity: 1 },
                { transform: `translateY(110vh) rotate(var(--confetti-spin))`, opacity: 0 }
            ],
            { duration: duration * 1000, easing: "ease-in", fill: "forwards" }
        );
        setTimeout(() => piece.remove(), duration * 1000);
    }
}

function createBalloons() {

    const colors = ["#c9576c", "#ffd46e", "#78b7a6", "#8d9ee8", "#f29b75", "#d98bd4"];

    for (let index = 0; index < 12; index++) {
        const balloon = document.createElement("span");
        const duration = 4 + Math.random() * 2;

        balloon.className = "celebration-balloon";
        balloon.style.left = `${Math.random() * 94 + 3}vw`;
        balloon.style.backgroundColor = colors[index % colors.length];
        balloon.style.setProperty("--balloon-drift", `${Math.random() * 100 - 50}px`);
        document.body.appendChild(balloon);
        balloon.animate(
            [
                { transform: "translateY(0) rotate(-5deg)", opacity: 0 },
                { transform: "translateY(-20vh) rotate(5deg)", opacity: 1, offset: 0.15 },
                { transform: "translate(var(--balloon-drift), -115vh) rotate(-5deg)", opacity: 0 }
            ],
            { duration: duration * 1000, easing: "ease-out", fill: "forwards" }
        );
        setTimeout(() => balloon.remove(), duration * 1000);
    }
}


// =========================
// HEART CONFETTI
// =========================

function createHearts() {

    const colors = ["#c9576c", "#e88499", "#d98bd4", "#f29b75", "#ae4056"];

    for (let i = 0; i < 30; i++) {

        const heart = document.createElement("div");

        heart.className = "celebration-heart";
        heart.innerHTML = "♥";

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.top = "-20px";

        heart.style.fontSize =
            (Math.random() * 20 + 15) + "px";

        heart.style.color = colors[i % colors.length];

        document.body.appendChild(heart);

        const duration =
            Math.random() * 3 + 2;

        heart.animate(
            [
                {
                    transform: "translateY(0) rotate(0deg)",
                    opacity: 1
                },
                {
                    transform:
                        `translateY(110vh) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ],
            {
                duration: duration * 1000,
                easing: "ease-in",
                fill: "forwards"
            }
        );

        setTimeout(() => {
            heart.remove();
        }, duration * 1000);

    }

}