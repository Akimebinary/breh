let balloonCount = 0; // Track the current number of balloons
const maxBalloonsPerSecond = 4; // Maximum number of balloons to spawn per second
let spawnRate = 1000; // Initial spawn rate in milliseconds (1 balloon per second)
let spawnInterval; // Variable to hold the spawn interval ID
let canSpawn = true; // Flag to control balloon spawning
const safeZoneWidth = 400; // Width of the center safe zone where no balloons should spawn
const windEffectDistance = 150; // Distance within which the wind effect is triggered
const windStrength = 1.5; // Multiplier for the wind effect strength

function createBalloon() {
    if (canSpawn) { // Check if we are allowed to spawn balloons
        const balloon = document.createElement('img');
        balloon.src = '0a29d8fc0b1083053bf0e6ee4d8d4ea0.png'; // Replace with your balloon image URL
        balloon.className = 'balloon';
        balloon.style.position = 'absolute'; // Ensure positioning is absolute
        
        // Set the initial position below the viewport
        balloon.style.bottom = '-100px'; // Start 100px below the screen
        
        // Determine random horizontal position avoiding the center area
        const windowWidth = window.innerWidth;
        const leftLimit = (windowWidth - safeZoneWidth) / 2; // Left limit of the safe zone
        const rightLimit = leftLimit + safeZoneWidth; // Right limit of the safe zone

        // Random position calculation
        if (Math.random() < 0.5) {
            // Spawn on the left side
            balloon.style.left = Math.random() * leftLimit + 'px'; 
        } else {
            // Spawn on the right side
            balloon.style.left = Math.random() * (windowWidth - rightLimit) + rightLimit + 'px'; 
        }

        balloon.style.opacity = '1'; // Start fully visible

        // Add to the document before setting animation to ensure it starts immediately
        document.body.appendChild(balloon);
        balloon.style.animation = 'riseAndSway 6s linear infinite'; // Ensure it floats up
        
        balloonCount++; // Increment the balloon count

        // Remove balloon after animation ends
        balloon.addEventListener('animationend', () => {
            balloon.remove();
            balloonCount--; // Decrement the balloon count
        });

        // Interaction: Pop balloon on click
        balloon.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering other click events
            balloon.style.transition = 'transform 0.2s'; // Transition effect
            balloon.style.transform = 'scale(0)'; // Pop effect
            
            // Remove balloon after pop effect
            setTimeout(() => {
                balloon.remove(); // Remove balloon after the pop effect
                balloonCount--; // Decrement the balloon count
            }, 200); // Match the duration of the pop effect
        });

        // Interaction: Change color on hover
        balloon.addEventListener('mouseenter', () => {
            balloon.style.filter = 'brightness(0.8)'; // Darken on hover
        });
        balloon.addEventListener('mouseleave', () => {
            balloon.style.filter = 'brightness(1)'; // Reset on mouse leave
        });

        // Add wind effect
        document.addEventListener('mousemove', (event) => {
            const balloonRect = balloon.getBoundingClientRect();
            const balloonX = balloonRect.left + balloonRect.width / 2; // Center of the balloon
            const balloonY = balloonRect.top + balloonRect.height / 2; // Center of the balloon

            const distX = balloonX - event.clientX; // Distance in X direction
            const distY = balloonY - event.clientY; // Distance in Y direction
            const distance = Math.sqrt(distX * distX + distY * distY); // Total distance

            if (distance < windEffectDistance) {
                // Calculate angle to move the balloon away from the cursor
                const angle = Math.atan2(distY, distX);
                const moveX = Math.cos(angle) * (windEffectDistance - distance) * windStrength; // Increased wind effect in X direction
                const moveY = Math.sin(angle) * (windEffectDistance - distance) * windStrength; // Increased wind effect in Y direction
                
                // Apply the movement to the balloon
                balloon.style.transform = `translate(${moveX}px, ${moveY}px)`; // Apply translation
            } else {
                // Reset transformation if cursor is far away
                balloon.style.transform = 'translate(0, 0)';
            }
        });
    }
}

// Start the initial high spawn rate
spawnInterval = setInterval(() => {
    createBalloon();
}, spawnRate);

// Adjust spawn rate after 3 seconds
setTimeout(() => {
    canSpawn = false; // Stop spawning during the adjustment
    // Significantly lower the spawn rate
    spawnRate = 1000; // Set to 1 balloon per second
    canSpawn = true; // Allow spawning again after adjustment
}, 3000); // Start adjusting after 3 seconds
