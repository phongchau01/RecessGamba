const pool = [
    { name: "Rusty Broadsword", rarity: "common", icon: "⚔️" },
    { name: "Stormcaller Bow", rarity: "rare", icon: "🏹" },
    { name: "Voidcursed Amulet", rarity: "epic", icon: "🪶" },
    { name: "Dragonfire Greatsword", rarity: "legendary", icon: "🗡️" },
    { name: "Bunny", rarity: "common", image: "bunny.png" }
];

let isOpened = false;

function openChest() {
    if (isOpened) return;
    isOpened = true;

    const container = document.getElementById('chestContainer');
    const chest = document.getElementById('chestMesh');
    const icon = document.getElementById('lootIcon');
    const label = document.getElementById('lootLabel');
    const glow = document.getElementById('chestGlow'); // Grab the new glow element

    const reward = pool[Math.floor(Math.random() * pool.length)];

    if (reward.image) {
        icon.innerHTML = `<img src="${reward.image}" alt="${reward.name}" class="reward-image">`;
        icon.className = `loot-item reward-image-wrapper rarity-${reward.rarity}`;
    } else {
        icon.innerHTML = reward.icon || "🎁";
        icon.className = `loot-item rarity-${reward.rarity}`;
    }

    label.className = `loot-text rarity-${reward.rarity}`;
    label.innerText = reward.name.toUpperCase();
    glow.className = `chest-glow glow-${reward.rarity}`;

    chest.classList.add('rumble');

    setTimeout(() => {
        chest.classList.remove('rumble');
        container.classList.add('opened');
        spawnParticles(reward.rarity);
    }, 500);
}

function spawnParticles(rarity) {
    const container = document.getElementById('chestContainer');
    let color = "#fff";
    
    if(rarity === 'rare') color = "#0070dd";
    if(rarity === 'epic') color = "#a335ee";
    if(rarity === 'legendary') color = "#ffcf00";

    const pCount = rarity === 'legendary' ? 40 : 20;

    for (let i = 0; i < pCount; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        
        const size = Math.random() * 6 + 4;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.background = color;
        p.style.left = `50%`;
        p.style.top = `50%`;
        
        if(rarity === 'legendary' || rarity === 'epic') {
            p.style.boxShadow = `0 0 10px ${color}`;
        }

        container.appendChild(p);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 120 + 40;
        const destinationX = Math.cos(angle) * velocity;
        const destinationY = Math.sin(angle) * velocity - 30;

        const animation = p.animate([
            { transform: 'translate(-50%, -50%) translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(-50%, -50%) translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
        ], {
            duration: Math.random() * 600 + 600,
            easing: 'cubic-bezier(0.1, 0.8, 0.25, 1)'
        });

        animation.onfinish = () => p.remove();
    }
}

function resetChest() {
    isOpened = false;
    document.getElementById('chestContainer').classList.remove('opened');
    document.getElementById('chestMesh').classList.remove('rumble');
    document.getElementById('chestGlow').className = 'chest-glow';
}