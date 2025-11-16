// =================================================================
// 1. SETUP
// =================================================================
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('start-screen');
const gameWrapper = document.getElementById('simulator-wrapper');
const easyBtn = document.getElementById('easy-btn');
const normalBtn = document.getElementById('normal-btn');
const hardBtn = document.getElementById('hard-btn');

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.8; 

let plants = [];
let herbivores = [];
let carnivores = [];
let player = null; 

// =================================================================
// 2. DIFFICULTY SETTINGS
// =================================================================

const difficultySettings = {
  easy: {
    initialPlants: 40, initialHerbivores: 20, initialCarnivores: 9, 
    plantSpawnRate: 0.15, playerEnergyDrain: 0.05, 
    carnivoreEnergyDrain: 0.04, carnivoreHunger: 180, 
  },
  normal: {
    initialPlants: 30, initialHerbivores: 15, initialCarnivores: 12, 
    plantSpawnRate: 0.1, playerEnergyDrain: 0.1, 
    carnivoreEnergyDrain: 0.04, carnivoreHunger: 150,
  },
  hard: {
    initialPlants: 20, initialHerbivores: 10, initialCarnivores: 15, 
    plantSpawnRate: 0.08, playerEnergyDrain: 0.2, 
    carnivoreEnergyDrain: 0.06, carnivoreHunger: 120, 
  }
};
let selectedDifficulty; 

// =================================================================
// 3. KEYBOARD INPUT HANDLER 
// =================================================================

const keys = {
  w: false, a: false, s: false, d: false
};
window.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'w' || key === 'arrowup') keys.w = true;
  if (key === 'a' || key === 'arrowleft') keys.a = true;
  if (key === 's' || key === 'arrowdown') keys.s = true;
  if (key === 'd' || key === 'arrowright') keys.d = true;
});
window.addEventListener('keyup', (e) => {
  const key = e.key.toLowerCase();
  if (key === 'w' || key === 'arrowup') keys.w = false;
  if (key === 'a' || key === 'arrowleft') keys.a = false;
  if (key === 's' || key === 'arrowdown') keys.s = false;
  if (key === 'd' || key === 'arrowright') keys.d = false;
});

// =================================================================
// 4. UTILITY FUNCTIONS
// =================================================================

function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1; const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.radius &&
    rect1.x + rect1.radius > rect2.x &&
    rect1.y < rect2.y + rect2.radius &&
    rect1.y + rect1.radius > rect2.y
  );
}

// =================================================================
// 5. BASE CLASS - CREATURE
// =================================================================
class Creature {
  constructor(x, y, radius, color, energy) {
    this.x = x; this.y = y; this.radius = radius; 
    this.color = color; this.energy = energy;
    this.isAlive = true; this.age = 0; 
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.radius, this.radius); 
  }
  wander() {
    this.x += Math.random() * 2 - 1; 
    this.y += Math.random() * 2 - 1;
    this.constrain();
  }
  constrain() {
    if (this.x < 0) this.x = 0;
    if (this.x > canvas.width - this.radius) this.x = canvas.width - this.radius;
    if (this.y < 0) this.y = 0;
    if (this.y > canvas.height - this.radius) this.y = canvas.height - this.radius;
  }
  update() { this.draw(); }
}

// =================================================================
// 6. PLAYER CLASS ("THE GLITCH")
// =================================================================
class Player extends Creature {
  constructor(x, y) {
    super(x, y, 12, '#ffff00', 200); 
    this.speed = 2.5;
  }
  move() {
    if (keys.w) this.y -= this.speed;
    if (keys.a) this.x -= this.speed;
    if (keys.s) this.y += this.speed;
    if (keys.d) this.x += this.speed;
  }
  eat() {
    for (let i = plants.length - 1; i >= 0; i--) {
      if (checkCollision(this, plants[i])) {
        this.energy += plants[i].energy;
        if (plants[i].isPoisonous) {
          this.radius -= 0.5; 
        } else {
          this.radius += 0.1; 
        }
        plants[i].isAlive = false;
      }
    }
    for (let i = herbivores.length - 1; i >= 0; i--) {
      if (checkCollision(this, herbivores[i])) {
        this.energy += herbivores[i].energy;
        this.radius += 0.2; 
        herbivores[i].isAlive = false;
      }
    }
    for (let i = carnivores.length - 1; i >= 0; i--) {
      if (checkCollision(this, carnivores[i])) {
        this.energy += carnivores[i].energy; 
        this.radius += 0.3; 
        carnivores[i].isAlive = false;
      }
    }
    
    // --- THIS IS THE CHANGE ---
    // Removed the max size limit (was 40)
    this.radius = Math.max(5, this.radius); // Min size 5
  }
  update() {
    this.age++;
    this.energy -= selectedDifficulty.playerEnergyDrain; 
    
    if (this.energy <= 0) {
      this.isAlive = false;
      alert("GAME OVER: The Glitch has been deleted.");
      document.location.reload(); 
    }
    this.move();
    this.constrain();
    this.eat();
    this.draw();
  }
}

// =================================================================
// 7. PLANT CLASS
// =================================================================
class Plant extends Creature {
  constructor(x, y) {
    super(x, y, 6, '#666', 40);
    this.maxAge = 3000 + (Math.random() * 1000); 
    this.isPoisonous = false; 
  }
  update() {
    this.age++; 
    if (this.age > this.maxAge) this.isAlive = false;
    this.draw();
  }
}
class PoisonPlant extends Plant {
  constructor(x, y) {
    super(x, y);
    this.color = '#ff00ff';
    this.isPoisonous = true;
    this.energy = 20; 
  }
}

// =================================================================
// 8. HERBIVORE CLASS ("Seeker")
// =================================================================
class Herbivore extends Creature {
  constructor(x, y, speed) {
    super(x, y, 8, '#ff0000', 50); 
    this.energyToReproduce = 100; 
    this.speed = speed || 0.4; 
    this.maxAge = 1000 + (Math.random() * 400); 
    this.isPoisoned = false; 
    this.originalColor = this.color; 
  }
  seek(target) {
    const dx = target.x - this.x; const dy = target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return; 
    this.x += (dx / dist) * this.speed; 
    this.y += (dy / dist) * this.speed; 
  }
  findFood(foodList) {
    let closestFood = null; let closestDist = Infinity;
    for (const food of foodList) {
      const dist = getDistance(this.x, this.y, food.x, food.y);
      if (dist < closestDist) { closestDist = dist; closestFood = food; }
    }
    if (closestFood) {
      if (checkCollision(this, closestFood)) {
        this.energy += closestFood.energy;
        closestFood.isAlive = false; 
        if (closestFood.isPoisonous) {
          this.isPoisoned = true; this.color = '#00ff00';
        }
        this.wander(); 
      } else { this.seek(closestFood); }
    } else { this.wander(); }
  }
  reproduce() {
    if (this.energy >= this.energyToReproduce) {
      this.energy /= 2; 
      const mutationFactor = (Math.random() * 0.4) - 0.2; 
      const newSpeed = Math.max(0.5, this.speed + mutationFactor); 
      return new Herbivore(this.x + 10, this.y + 10, newSpeed); 
    }
    return null;
  }
  update(plantList) {
    this.age++; 
    const baseEnergyDrain = 0.01;
    const speedEnergyDrain = this.speed * 0.01;
    this.energy -= (baseEnergyDrain + speedEnergyDrain); 
    if (this.energy <= 0 || this.age > this.maxAge) {
      this.isAlive = false; return;
    }
    this.findFood(plantList);
    this.draw();
  }
}

// =================================================================
// 9. CARNIVORE CLASS ("Hunter")
// =================================================================
class Carnivore extends Creature {
  constructor(x, y, speed) {
    super(x, y, 10, '#ffffff', 100); 
    this.energyToReproduce = 250; 
    this.speed = speed || 0.8; 
    this.maxAge = 1400 + (Math.random() * 400); 
    this.hungerThreshold = selectedDifficulty.carnivoreHunger; 
  }
  seek(target) {
    const dx = target.x - this.x; const dy = target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 1) return; 
    this.x += (dx / dist) * this.speed; 
    this.y += (dy / dist) * this.speed; 
  }
  findFood(foodList, player) {
    let closestFood = null; let closestDist = Infinity;
    if (player && player.isAlive) {
        const distToPlayer = getDistance(this.x, this.y, player.x, player.y);
        closestFood = player; closestDist = distToPlayer;
    }
    if (closestDist > 200) { 
      for (const food of foodList) {
        if (food.isPoisoned) continue; 
        const dist = getDistance(this.x, this.y, food.x, food.y);
        if (dist < closestDist) { closestDist = dist; closestFood = food; }
      }
    }
    if (closestFood) {
      if (checkCollision(this, closestFood)) {
        if (closestFood === player) {
          player.energy -= 50; 
          this.energy += 50; 
        } else {
          this.energy += 50; 
          closestFood.isAlive = false;
        }
        this.wander(); 
      } else { this.seek(closestFood); }
    } else { this.wander(); }
  }
  reproduce() {
    if (this.energy >= this.energyToReproduce) {
      this.energy /= 2;
      const mutationFactor = (Math.random() * 0.4) - 0.2; 
      const newSpeed = Math.max(0.5, this.speed + mutationFactor); 
      return new Carnivore(this.x + 10, this.y + 10, newSpeed); 
    }
    return null;
  }
  update(herbivoreList, player) { 
    this.age++; 
    const baseEnergyDrain = selectedDifficulty.carnivoreEnergyDrain; 
    const speedEnergyDrain = this.speed * 0.03;
    this.energy -= (baseEnergyDrain + speedEnergyDrain); 
    
    if (this.energy <= 0 || this.age > this.maxAge) {
      this.isAlive = false; return;
    }
    if (this.energy < this.hungerThreshold) {
      this.findFood(herbivoreList, player); 
    } else {
      this.wander();
    }
    this.draw();
  }
}

// =================================================================
// 10. INITIALIZE SIMULATION
// =================================================================
function spawnInitialEntities() {
  for (let i = 0; i < selectedDifficulty.initialPlants; i++) { 
    plants.push(new Plant(Math.random() * canvas.width, Math.random() * canvas.height));
  }
  for (let i = 0; i < selectedDifficulty.initialHerbivores; i++) { 
    herbivores.push(new Herbivore(Math.random() * canvas.width, Math.random() * canvas.height)); 
  }
  for (let i = 0; i < selectedDifficulty.initialCarnivores; i++) { 
    carnivores.push(new Carnivore(Math.random() * canvas.width, Math.random() * canvas.height)); 
  }
  player = new Player(canvas.width / 2, canvas.height / 2);
}

// =================================================================
// 11. MAIN GAME LOOP
// =================================================================
function gameLoop() {
  if (!player.isAlive) return; 

  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (Math.random() < selectedDifficulty.plantSpawnRate) { 
    if (Math.random() < 0.1) {
      plants.push(new PoisonPlant(Math.random() * canvas.width, Math.random() * canvas.height));
    } else {
      plants.push(new Plant(Math.random() * canvas.width, Math.random() * canvas.height));
    }
  }

  const newHerbivores = []; const newCarnivores = [];
  for (const plant of plants) plant.update();
  for (const herbivore of herbivores) {
    herbivore.update(plants);
    const newChild = herbivore.reproduce();
    if (newChild) newHerbivores.push(newChild);
  }
  for (const carnivore of carnivores) {
    carnivore.update(herbivores, player); 
    const newChild = carnivore.reproduce();
    if (newChild) newCarnivores.push(newChild);
  }
  
  player.update();

  plants = plants.filter(p => p.isAlive);
  herbivores = herbivores.filter(h => h.isAlive).concat(newHerbivores);
  carnivores = carnivores.filter(c => c.isAlive).concat(newCarnivores);

  requestAnimationFrame(gameLoop);
}

// =================================================================
// 12. USER MOUSE INTERACTION
// =================================================================
canvas.addEventListener('click', (event) => {
  const x = event.offsetX; const y = event.offsetY;
  if (event.shiftKey) {
    herbivores.push(new Herbivore(x, y));
  } else if (event.ctrlKey) {
    carnivores.push(new Carnivore(x, y));
  } else {
    if (Math.random() < 0.2) { 
        plants.push(new PoisonPlant(x, y));
    } else {
        plants.push(new Plant(x, y));
    }
  }
});

// =================================================================
// 13. START GAME LOGIC
// =================================================================

function startGame(difficulty) {
  selectedDifficulty = difficulty; 
  startScreen.style.display = 'none'; 
  gameWrapper.style.display = 'flex'; 
  
  spawnInitialEntities(); 
  gameLoop(); 
}

easyBtn.addEventListener('click', () => startGame(difficultySettings.easy));
normalBtn.addEventListener('click', () => startGame(difficultySettings.normal));
hardBtn.addEventListener('click', () => startGame(difficultySettings.hard));