const canvas = document.getElementById('splat-canvas');
const ctx = canvas.getContext('2d');
const monkey = document.getElementById('monkey');
const banana = document.getElementById('banana');
const rewardContainer = document.getElementById('reward-container');

// Gacha Loot Table
const items = [
    { name: "Brown Bear Plush", emoji: "🧸", rarity: "common", weight: 50 },
    { name: "Rubber Duck", emoji: "🦆", rarity: "common", weight: 50 },
    { name: "Shiny Toy Car", emoji: "🏎️", rarity: "rare", weight: 30 },
    { name: "Wizard Hat", emoji: "🧙‍♂️", rarity: "rare", weight: 30 },
    { name: "Golden Crown", emoji: "👑", rarity: "epic", weight: 15 },
    { name: "Robo-Buddy", emoji: "🤖", rarity: "epic", weight: 15 },
    { name: "Mythical Diamond Dragon", emoji: "🐉", rarity: "legendary", weight: 4 }
];

let isDrawing = false;
let totalSplatPixels = 0;

// Resize canvas to fill screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 1. Start the Sequence (Monkey Throws Banana)
function startSequence() {
    rewardContainer.style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.pointerEvents = "none"; 

    determineReward();

    // Monkey jumps up
    monkey.style.bottom = "20px";

    setTimeout(() => {
        banana.style.display = "block";
        banana.style.left = "50%";
        banana.style.bottom = "120px";
        banana.style.transform = "scale(1) translate(-50%, 0)";
        banana.style.transition = "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)";

        // Banana flies and expands towards the screen
        setTimeout(() => {
            banana.style.transform = "scale(15) translate(-50%, -50%)";
            banana.style.left = "50%";
            banana.style.top = "50%";
            banana.style.opacity = "0";
        }, 50);

        // Banana impacts the screen
        setTimeout(() => {
            banana.style.display = "none";
            banana.style.opacity = "1";
            banana.style.top = "auto"; 
            monkey.style.bottom = "-150px"; 
            
            triggerSplat();
        }, 650);

    }, 600);
}

// 2. Create the Banana Splat on Screen
function triggerSplat() {
    canvas.style.pointerEvents = "auto";
    rewardContainer.style.display = "flex"; 

    // FIX: Reset the canvas mode back to drawing so the paint actually shows up!
    ctx.globalCompositeOperation = 'source-over'; 

    ctx.fillStyle = "#f1c40f"; 
    
    // Center splat
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 180, 0, Math.PI * 2);
    ctx.fill();

    // Random splat droplets
    for (let i = 0; i < 12; i++) {
        let angle = Math.random() * Math.PI * 2;
        let distance = 150 + Math.random() * 150;
        let x = canvas.width / 2 + Math.cos(angle) * distance;
        let y = canvas.height / 2 + Math.sin(angle) * distance;
        let radius = 20 + Math.random() * 40;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Calculate initial splat surface area
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    totalSplatPixels = 0;
    for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] > 0) totalSplatPixels++;
    }
}

// 3. Wiping/Erasing Mechanics
function erase(e) {
    if (!isDrawing) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Use destination-out to act as an eraser
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(clientX, clientY, 55, 0, Math.PI * 2); // Slightly larger brush for better feel
    ctx.fill();

    // Check cleanness continuously *while* wiping
    checkCleanness();
}

// Mouse Event Listeners
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    erase(e); // Allow single-click spots to erase instantly
});
window.addEventListener('mousemove', erase);
window.addEventListener('mouseup', () => { isDrawing = false; });

// Touch Event Listeners (Mobile)
canvas.addEventListener('touchstart', (e) => {
    isDrawing = true;
    erase(e);
});
window.addEventListener('touchmove', erase);
window.addEventListener('touchend', () => { isDrawing = false; });

// Check if user wiped away most of the banana
function checkCleanness() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let currentSplatPixels = 0;
    
    for (let i = 3; i < imgData.data.length; i += 4) {
        if (imgData.data[i] > 0) currentSplatPixels++;
    }

    // Once 85% of the mess is gone, clear the remaining small flakes
    // Once 85% of the mess is gone, clear the remaining small flakes automatically
    if (currentSplatPixels < totalSplatPixels * 0.15) {
        isDrawing = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.pointerEvents = "none"; // Clicks pass through to the button below
    }
}

// 4. Gacha RNG Loot System
function determineReward() {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedItem = items[0];
    for (const item of items) {
        if (random < item.weight) {
            selectedItem = item;
            break;
        }
        random -= item.weight;
    }

    document.getElementById('reward-item').innerText = selectedItem.emoji;
    document.getElementById('reward-name').innerText = selectedItem.name;
    
    const rarityBadge = document.getElementById('reward-rarity');
    rarityBadge.innerText = selectedItem.rarity;
    rarityBadge.className = selectedItem.rarity; 
}

window.onload = () => {
    setTimeout(startSequence, 500);
};