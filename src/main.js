import kaplay from "kaplay";

// Define constants
const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 900;
const START_SPEED = 480;

// Define non-constant variables
let speed = 0;
let increaseSpeed;

// Initialize game context
kaplay({
  width: 1920,
  height: 1080,
  letterbox: true,
});

// Load assets
loadSprite("flappy", "sprites/67-bird.png");
loadSprite("bg", "sprites/67-land-BG.png");

// Define game scene
scene("game", () => {
  speed = START_SPEED; // Reset speed to starting speed (constant)

  // Start interval timer to increase speed every second
  increaseSpeed = setInterval(() => {
    speed += 10;
  }, 1000);

  // Define gravity (library defined)
  setGravity(2700);

  // Add background to screen and scale it up
  add([sprite("bg"), scale(4)]);

  // Add the player object to scene
  const player = add([
    sprite("flappy"),
    scale(3),
    pos(80, 40),
    anchor("center"),
    area({ scale: 0.5 }),
    body(),
  ]);

  // Add floor to the scene
  add([
    rect(width(), FLOOR_HEIGHT),
    outline(4),
    pos(0, height()),
    anchor("botleft"),
    area(),
    body({ isStatic: true }),
    color(127, 200, 255),
  ]);

  // Define jump function (only when on ground)
  function jump() {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
    }
  }

  // Define jump when user press space
  onKeyPress("space", jump);
  onClick(jump);

  // Function to spawn trees
  function spawnTree() {
    // Define single tree object
    add([
      rect(48, rand(32, 96)),
      area(),
      outline(4),
      pos(width(), height() - FLOOR_HEIGHT),
      anchor("botleft"),
      color(255, 180, 255),
      move(LEFT, speed),
      "tree",
    ]);
    // wait a random amount of time to spawn next tree
    wait(rand(0.5, 1.5), spawnTree);
  }

  // Start spawning trees
  spawnTree();

  // Define lose condition when player collides with tree
  player.onCollide("tree", () => {
    // go to "lose" scene and pass the score
    go("lose", score);
    burp();
    addKaboom(player.pos);
  });

  // keep track of score
  let score = 0;

  // labels to display score and speed
  const scoreLabel = add([text(score), pos(1600, 24)]);
  const speedLabel = add([text(speed), pos(1600, 90)]);

  // increment score and speed every frame
  onUpdate(() => {
    score++;
    scoreLabel.text = "Score: " + score;
    speedLabel.text = "Speed: " + (speed - 480) * 2;
  });
});

// Define scene to show when lose the game
scene("lose", (score) => {
  // Stop increasing speed when lose
  clearInterval(increaseSpeed);

  // Put player in the middle of the screen
  add([
    sprite("flappy"),
    pos(width() / 2, height() / 2 - 80),
    scale(10),
    anchor("center"),
  ]);

  // display score
  add([
    text(score),
    pos(width() / 2, height() / 2 + 80),
    scale(2),
    anchor("center"),
  ]);

  // go back to game with space is pressed
  onKeyPress("space", () => go("game"));
  onClick(() => go("game"));
});

// Run game!
go("game");
