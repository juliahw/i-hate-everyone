//////////////////////////////////////////////////////////
// GAME
//////////////////////////////////////////////////////////

var Game = {};

Game.init = function (mode) {
    this.mode = mode;
    this.tick = 0;
    this.day = 1;
    this.week = 1;

    this.funds = 2000;
    this.stipend = 50;

    this.bactEngine = new BacteriaEngine(1000);
    this.powerEngine = new PowerupEngine();
    this.bactContainer = new PIXI.ParticleContainer();
    this.powerContainer = new PIXI.Container();
    stage.addChild(this.bactContainer);
    stage.addChild(this.powerContainer);

    width = window.innerWidth;
    height = window.innerHeight;
    this.dish = new PetriDish(width / 2, (height - 100) / 2, (height - 100) / 3); // (x, y, radius)

    this.cancer = false;
    this.stopped = false;
    this.over = false;

    $day.innerHTML = this.day;
    $week.innerHTML = this.week;

    // initialize cell growth
    for (var i = 0; i < 10; i++) {
        this.bactEngine.spawnAt(this.dish.positionX, this.dish.positionY);
    }
    animate();
};

Game.updateStats = function () {
    $population.innerHTML = this.bactEngine.population;
    var resist = Math.min(this.bactEngine.resistance * 100, 100);

    $resistance.innerHTML = resist.toFixed(1);
    var infect = Math.min(this.bactEngine.infectivity * 100, 100);

    $infectivity.innerHTML = infect.toFixed(1);

    $funds.innerHTML = this.funds.toFixed(2);
};

Game.updateTime = function () {
    this.tick++;
    if (this.tick % 500 === 0) {
        this.day++;
        this.funds += this.stipend; // daily stipend

        // if necessary, increment week
        if (this.day >= 7) {
            this.day = 1;
            this.week++;

            if (this.mode === 'NORMAL') {
                if (this.week === 2) {
                    animateOut(function () {
                        playScene('week1');
                        Game.stopped = true;
                    });
                }
                if (this.week === 3) {
                    animateOut(function () {
                        playScene('week2');
                        Game.stopped = true;
                    });
                }
                if (this.week === 4) {
                    animateOut(function () {
                        playScene('week3');
                        Game.stopped = true;
                    });
                }
            }

            Velocity($week, 'transition.flipBounceYIn', 1000);
            $week.innerHTML = this.week;
        }

        Velocity($day, 'transition.flipBounceYIn', 1000);
        $day.innerHTML = this.day;

        this.tick = 0;
    }
};

Game.updateParticles = function () {
    // update positions
    this.powerEngine.update();
    this.bactEngine.update();

    // dish collisions
    this.dish.update();

    // bacterium-bacterium collisions
    for (var i = 0; i < this.bactEngine.particles.length - 1; i++) {
        for (var j = i + 1; j < this.bactEngine.particles.length; j++) {
            var bact1 = this.bactEngine.particles[i];
            var bact2 = this.bactEngine.particles[j];

            if (!bact1.alive || !bact2.alive) continue;

            if (isCollision(bact1.getPositionX(), bact1.getPositionY(), bact1.radius,
                    bact2.getPositionX(), bact2.getPositionY(), bact2.radius)) {
                bact1.onCollisionWithBacterium(bact2);
                bact2.onCollisionWithBacterium(bact1);
            }
        }
    }

    // bacterium-powerup collisions
    for (var i = 0; i < this.bactEngine.particles.length; i++) {
        for (var j = 0; j < this.powerEngine.particles.length; j++) {
            var bact = this.bactEngine.particles[i];
            var powerup = this.powerEngine.particles[j];

            if (!bact.alive || !powerup.alive) continue;

            if (isCollision(bact.getPositionX(), bact.getPositionY(), bact.radius, powerup.getPositionX(), powerup.getPositionY(), powerup.radius)) {
                bact.onCollisionWithPowerup(powerup);
                powerup.onCollisionWithBacterium(bact);
            }
        }
    }
};

//////////////////////////////////////////////////////////
// GAME LOOP & RENDERING
//////////////////////////////////////////////////////////

var width = window.innerWidth,
    height = window.innerHeight,
    renderer,
    stage,
    meter;

window.onload = function () {
    playScene('intro1');

    // create a stage for the renderer
    stage = new PIXI.Container();

    // initialize canvas
    renderer = PIXI.autoDetectRenderer(width, height, {
        view: $canvas,
        backgroundColor: 0x1099bb,
        antialias: true,
        autoResize: true
    });

    setupButtons();
    setupMouseHandlers();

    meter = new FPSMeter();
};

function animate() {
    if (Game.stopped) {
        return;
    }

    Game.updateParticles();
    Game.bactEngine.divide();
    Game.updateStats();
    Game.updateTime();

    // memory management: clear out dead particles
    Game.bactEngine.clean();
    Game.powerEngine.clean();

    // detect screen change conditions
    if (!Game.over) {
        if (Game.bactEngine.population <= 0) {
            setTimeout(function () {
                gameOver('Your bacteria died.');
            }, 500);
        } else if (Game.cancer) {
            setTimeout(function () {
                gameOver('You got cancer and died. Don\'t say I didn\'t warn you.');
            }, 500);
        } else if (Game.week >= 5 && Game.mode === 'NORMAL') {
            setTimeout(function () {
                gameOver('You\'re out of time. Your PI is back and she\'s not pleased...');
            }, 500);
        } else if (Game.bactEngine.resistance > 0.99 && Game.bactEngine.infectivity > 0.99) {
            playScene('win');
        }
    }

    meter.tick();
    renderer.render(stage);
    requestAnimationFrame(animate);
}