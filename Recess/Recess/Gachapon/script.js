const crank = document.getElementById('crank');
const globe = document.getElementById('globe');
const rewardCapsule = document.getElementById('reward-capsule');
const statusText = document.getElementById('status-text');
const revealOverlay = document.getElementById('reveal-overlay');
const displayCapsule = document.getElementById('display-capsule');
const rarityText = document.getElementById('rarity-text');

let clicks = 0;
let currentRotation = 0;
let isSpinning = false;

// Rarities configuration with drop rates (weights out of 100)
const rarities = [
    { name: 'Common', color: '#b0bec5', class: 'glow-common', weight: 60 },
    { name: 'Rare', color: '#2196f3', class: 'glow-rare', weight: 25 },
    { name: 'Epic', color: '#9c27b0', class: 'glow-epic', weight: 12 },
    { name: 'LEGENDARY', color: '#ff9800', class: 'glow-legendary', weight: 3 }
];

// Determine won item based on weights
function getRarity() {
    let rand = Math.random() * 100;
    for (let rarity of rarities) {
        if (rand < rarity.weight) return rarity;
        rand -= rarity.weight;
    }
    return rarities[0];
}

// Handle crank turns
crank.addEventListener('click', () => {
    if (isSpinning) return;

    clicks++;
    currentRotation += 120; // 3 clicks total 360 degrees
    crank.style.transform = `rotate(${currentRotation}deg)`;

    if (clicks < 3) {
        statusText.innerText = `Clicks: ${clicks}/3. Keep turning!`;
        
        // Subtle brief nudge to show internal reaction
        globe.classList.add('spinning');
        setTimeout(() => { 
            if (clicks < 3) globe.classList.remove('spinning'); 
        }, 200);
    } else {
        // Trigger main event sequence on 3rd click
        isSpinning = true;
        clicks = 0;
        statusText.innerText = "Spinning!!";
        globe.classList.add('spinning');

        // 1.5 seconds of machine shaking animation
        setTimeout(() => {
            globe.classList.remove('spinning');
            statusText.innerText = "Claim your capsule!";
            
            const finalPrize = getRarity();
            
            // Apply visual profile to physical capsule drop
            rewardCapsule.style.background = `linear-gradient(135deg, ${finalPrize.color} 50%, #ffffff 50%)`;
            rewardCapsule.classList.add('dispense');
            
            // Save data temporarily onto the element
            rewardCapsule.dataset.prize = JSON.stringify(finalPrize);
        }, 1500);
    }
});

// Click reward capsule to reveal full lightbox glow
rewardCapsule.addEventListener('click', () => {
    const prizeData = JSON.parse(rewardCapsule.dataset.prize);
    
    // Reset old class classes cleanly
    displayCapsule.className = 'display-capsule';
    
    // Inject winning layout configurations
    displayCapsule.style.background = `linear-gradient(135deg, ${prizeData.color} 50%, #ffffff 50%)`;
    displayCapsule.classList.add(prizeData.class);
    rarityText.innerText = prizeData.name;
    rarityText.style.color = prizeData.color;

    revealOverlay.classList.add('active');
});

// Click anywhere on reveal lightbox screen to reset loop
revealOverlay.addEventListener('click', () => {
    revealOverlay.classList.remove('active');
    rewardCapsule.classList.remove('dispense');
    statusText.innerText = "Click Crank 3 Times to Spin!";
    isSpinning = false;
});