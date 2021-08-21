(window.game = function() {
    let c, ctx, don,
        then,
        lost,
        score,
        keysDown;

    const PLAY_AGAIN = {
        x: 220,
        y: 10,
        width: 60,
        height: 20,
        onclick: function() {
            if (lost) {
                game();
            }
        }
    };

    class Donald {
        constructor(x, y, speed) {
            x = x || Math.floor(Math.random() * (455 + 1));
            y = y || 0;
            speed = speed || Math.floor(Math.random() * (4 - 3 + 1)) + 3;
            this.x = x;
            this.y = y;
            this.speed = speed;
        }
    }

    let obama = {
        x: 200,
        y: 450,
        render: function() {
            ctx.drawImage(obamaImage, this.x, this.y, 50, 50);
        },
        detectHits: function() {
            for (let i = 0; i < don.length; i++) {
                if (
                    this.x <= (don[i].x + 30) &&
                    don[i].x <= (this.x + 30) &&
                    this.y <= (don[i].y + 30) &&
                    don[i].y <= (this.y + 30)
                ) {
                    lost = true;
                }
            }
        },
        move: function(m) {
            if (37 in keysDown && this.x > -5) {
                this.x -= 240 * m;
            }
            if (39 in keysDown && this.x < 455) {
                this.x += 240 * m;
            }
        }
    };

    let trump = {
        render: function() {
            for (let i = 0; i < don.length; i++) {
                ctx.drawImage(trumpImage, don[i].x, don[i].y, 50, 50);
            }
        },
        drop: function() {
            for (let i = 0; i < don.length; i++) {
                don[i].y += don[i].speed;
                if (don[i].y > 500) {
                    don.splice(i, 1);
                    score++;
                }
            }
        }
    };

    function init() {
        c = document.getElementById("game");
        c.width = 500;
        c.height = 500;
        ctx = c.getContext("2d");
        then = performance.now();
        lost = false;
        score = 0;
        keysDown = {};
        don = [];
        addEventListener("keydown", (e) => {
            keysDown[e.keyCode] = true;
        }, false);
        addEventListener("keyup", (e) => {
            delete keysDown[e.keyCode];
        }, false);
        c.addEventListener("mousedown", (e) => {
            if (
                e.pageX >= PLAY_AGAIN.x &&
                e.pageY >= PLAY_AGAIN.y &&
                e.pageX <= PLAY_AGAIN.x + PLAY_AGAIN.width &&
                e.pageY <= PLAY_AGAIN.y + PLAY_AGAIN.height
            ) PLAY_AGAIN.onclick();
        }, false);
        gameLoop();
    }

    let fpsCounter = (function() {
        let lastLoop = (new Date().getMilliseconds());
        let count = 1;
        let fps = 0;

        return function() {
            let currentLoop = (new Date().getMilliseconds());
            if (lastLoop > currentLoop) {
                fps = count;
                count = 1;
            } else {
                count += 1;
            }
            lastLoop = currentLoop;
            return fps;
        };
    })();

    function gameLoop() {
        if (!lost) {
            c.width = c.width;
            trump.render();
            obama.render();
            if ((Math.floor(Math.random() * (12)) + 1) == 1) {
                don.push(new Donald());
            }
            trump.drop();
            obama.detectHits();
            let now = performance.now();
            let delta = now - then;
            obama.move(delta / 1000);
            then = now;
            ctx.fillStyle = "black";
            ctx.fillText("Dangos dodged: " + score, 5, 10);
            ctx.fillText(fpsCounter() + " FPS", 465, 10);
            window.requestAnimationFrame(gameLoop);
        } else {
            if (localStorage.highScore == undefined)
                localStorage.highScore = score;
            else if (localStorage.highScore < score)
                localStorage.highScore = score;
            c.width = c.width;
            ctx.fillStyle = "red";
            ctx.font = "40px sans-serif";
            ctx.fillText("Game over!", 140, 200);

            ctx.fillStyle = "black";
            ctx.font = "36px sans-serif";
            ctx.fillText("Dangos dodged: " + score, 100, 240);

            ctx.strokeRect(PLAY_AGAIN.x, PLAY_AGAIN.y, PLAY_AGAIN.width, PLAY_AGAIN.height);

            ctx.fillStyle = "black";
            ctx.font = "12px sans-serif";
            ctx.fillText("Play again", PLAY_AGAIN.x + 2, PLAY_AGAIN.y + 15);

            ctx.fillText("High score: " + localStorage.highScore, 0, 10);
        }
    }

    init();
})();
