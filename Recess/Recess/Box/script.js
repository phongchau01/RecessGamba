// Pool of potential plushies with their rarities
const plushyPool = [
    { name: "Dusty the Bear", icon: "🧸", rarity: "common" },
    { name: "Barnaby Bunny", icon: "🐰", rarity: "common" },
    { name: "Sir Cat-a-lot", icon: "🐱", rarity: "common" },
    { name: "Finley Frog", icon: "🐸", rarity: "rare" },
    { name: "Axel Axolotl", icon: "🦎", rarity: "rare" },
    { name: "Cosmo Dragon", icon: "🐲", rarity: "legendary" },
    { name: "Sparkle Unicorn", icon: "🦄", rarity: "legendary" }
];

// DOM Elements
const blindBox = document.getElementById('blind-box');
const mysteryBag = document.getElementById('mystery-bag');
const prizeContainer = document.getElementById('prize-container');
const plushyDisplay = document.getElementById('plushy-display');
const prizeName = document.getElementById('prize-name');
const prizeRarity = document.getElementById('prize-rarity');
const rarityGlow = document.getElementById('rarity-glow');
const resetBtn = document.getElementById('reset-btn');

// Stage 1: Click Box to Rip Open
blindBox.addEventListener('click', () => {
    if (blindBox.classList.contains('ripped')) return;
    
    blindBox.classList.add('ripped');
    
    // Wait for rip animation to finish, then show foil bag
    setTimeout(() => {
        blindBox.classList.add('hidden');
        mysteryBag.classList.remove('hidden');
    }, 500);
});

// Stage 2: Click Bag to Tear Open and Reveal Item
mysteryBag.addEventListener('click', () => {
    if (mysteryBag.classList.contains('ripped')) return;
    
    mysteryBag.classList.add('ripped');
    
    // Determine the prize item
    const rolledPrize = rollPrize();
    
    // Setup the prize display properties
    setTimeout(() => {
        mysteryBag.classList.add('hidden');
        displayPrize(rolledPrize);
    }, 400);
});

// Helper function to pick a random prize based on simple array distribution
function rollPrize() {
    // Basic weight logic built into pool ratios, or simple random selection
    const randomIndex = Math.floor(Math.random() * plushyPool.length);
    return plushyPool[randomIndex];
}

// Stage 3: Setup the final prize showcase and dynamic styling
function displayPrize(prize) {
    plushyDisplay.textContent = prize.icon;
    prizeName.textContent = prize.name;
    prizeRarity.textContent = prize.rarity;
    
    // Clear out old rarity classes
    rarityGlow.className = 'glow-effect';
    prizeRarity.className = 'rarity-tag';
    
    // Apply rarity specific styles
    if (prize.rarity === 'common') {
        rarityGlow.classList.add('glow-common');
        prizeRarity.classList.add('tag-common');
    } else if (prize.rarity === 'rare') {
        rarityGlow.classList.add('glow-rare');
        prizeRarity.classList.add('tag-rare');
    } else if (prize.rarity === 'legendary') {
        rarityGlow.classList.add('glow-legendary');
        prizeRarity.classList.add('tag-legendary');
    }
    
    prizeContainer.classList.remove('hidden');
}

// Reset Game Loop
resetBtn.addEventListener('click', () => {
    prizeContainer.classList.add('hidden');
    
    // Reset classes to original conditions
    blindBox.classList.remove('ripped', 'hidden');
    mysteryBag.classList.remove('ripped', 'hidden');
    mysteryBag.classList.add('hidden');
});