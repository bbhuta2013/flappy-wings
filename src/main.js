import kaplay from "kaplay";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 900;
const START_SPEED = 480;
let SPEED = 0;

// initialize context
kaplay(
    {
        width: 1920,
        height: 1080,
        letterbox: true
    }
);

let increaseSpeed;

// load assets
loadSprite("flappy", "sprites/67-bird.png");
loadSprite("bg", "sprites/67-land-BG.png")
scene("game", () => {
    SPEED = START_SPEED;
    increaseSpeed = setInterval(() => {
        SPEED += 10;
    }, 1000)

    // define gravity
    setGravity(2700);
    
    add([
        sprite("bg"),
        scale(4)
    ])

    // add a game object to screen
    const player = add([
        // list of components
        sprite("flappy"),
        scale(3),
        pos(80, 40),
        anchor("center"),
        area({scale: 0.5}),
        body(),
         
    ]);

    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
    ]);

    

    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    // jump when user press space
    onKeyPress("space", jump);
    onClick(jump);

    function spawnTree() {
        // add tree obj
        add([
            rect(48, rand(32, 96)),
            area(),
            outline(4),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            color(255, 180, 255),
            move(LEFT, SPEED),
            "tree",
        ]);

        // wait a random amount of time to spawn next tree
        wait(rand(0.5, 1.5), spawnTree);
    }

    // start spawning trees
    spawnTree();

    // lose if player collides with any game obj with tag "tree"
    player.onCollide("tree", () => {
        // go to "lose" scene and pass the score
        go("lose", score);
        burp();
        addKaboom(player.pos);
    });

    // keep track of score
    let score = 0;

    const scoreLabel = add([text(score), pos(24, 24)]);

    // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });
});

scene("lose", (score) => {
    clearInterval(increaseSpeed);

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

go("game");