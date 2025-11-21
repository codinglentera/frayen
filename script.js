// --- Start of modified JavaScript ---
const banner = document.querySelector('.banner');
const canvas = document.getElementById('dotsCanvas');
const bannerHeadings = document.querySelector('.banner-headings'); // Use this to display score
let ctx = canvas.getContext('2d');
let numDots = 80;
let dots = [];
const colors = ['#89a5df', '#e46e7f', '#e8e191', '#c691e6', '#f4b8e4']; // Use banner colors for dots
let score = 0;
let gameRunning = true; // State flag

function resizeCanvas() {
    canvas.width = banner.offsetWidth;
    canvas.height = banner.offsetHeight;
}
resizeCanvas();

function updateScoreDisplay() {
    const scoreElement = document.getElementById('scoreDisplay');
    if (scoreElement) {
        scoreElement.textContent = `Score: ${score}`;
    }
}

function randomDot(width, height) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = 0.2 + Math.random() * 0.8;
    return {
        x: Math.random() * width,
        y: Math.random() * height,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 2, // Slightly larger dots for clicking
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.4
    }
}

function initDots() {
    dots = [];
    for (let i = 0; i < numDots; i++) {
        dots.push(randomDot(canvas.width, canvas.height));
    }
    score = 0;
    updateScoreDisplay();
}

function updateDots() {
    for (let i = 0; i < dots.length; i++) {
        dots[i].x += dots[i].dx;
        dots[i].y += dots[i].dy;

        // Bounce off edges
        if (dots[i].x < 0 || dots[i].x > canvas.width) dots[i].dx *= -1;
        if (dots[i].y < 0 || dots[i].y > canvas.height) dots[i].dy *= -1;
    }
}

function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const dot of dots) {
        ctx.save();
        ctx.globalAlpha = dot.opacity;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.shadowColor = dot.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
    }
    // No more mouse interaction lines in this game version
}

function loop() {
    if (gameRunning) {
        updateDots();
        drawDots();
    }
    requestAnimationFrame(loop);
}

// Click Handler: Check if a dot was clicked
canvas.addEventListener('click', (event) => {
    if (!gameRunning) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    let dotClicked = false;
    for (let i = dots.length - 1; i >= 0; i--) {
        const dot = dots[i];
        // Calculate distance from click to dot center
        const distance = Math.sqrt((clickX - dot.x) ** 2 + (clickY - dot.y) ** 2);
        
        // Check if the click is within the dot's radius (plus a small buffer)
        if (distance < dot.size + 5) { 
            dots.splice(i, 1); // Remove the dot
            score += 1; // Increase the score
            updateScoreDisplay();
            dotClicked = true;
            
            // Check for game over (no dots left)
            if (dots.length === 0) {
                gameRunning = false;
                alert(`Game Over! Final Score: ${score}`);
                // You could offer a restart option here
            }
            break; // Only collect one dot per click
        }
    }
});

window.addEventListener('resize', () => {
    resizeCanvas();
    // Only re-init dots if you want to reset the game on resize
    // initDots(); 
});

// Add a score display element to your HTML
bannerHeadings.insertAdjacentHTML('beforebegin', '<h3 id="scoreDisplay" style="color:#eee; z-index:2;">Score: 0</h3>');

// Remove original mousemove/mouseout listeners since we don't need the lines
// banner.removeEventListener('mousemove', ...);
// banner.removeEventListener('mouseout', ...);


resizeCanvas();
initDots();
loop();
// --- End of modified JavaScript ---
