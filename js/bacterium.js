function Bacterium(positionX, positionY) {
    this.sprite = PIXI.Sprite.fromImage('img/sprites/bact2.png');
    this.sprite.x = positionX;
    this.sprite.y = positionY;
    this.sprite.anchor.set(0.5);
    this.sprite.rotation = randomUniform(0, 2 * Math.PI);
    Game.bactContainer.addChild(this.sprite);

    this.speed = randomUniform(this.MIN_SPEED, this.MAX_SPEED);
    this.direction = this.sprite.rotation;
    this.turningvelocity = Math.random() - 0.8;

    this.alive = true;
    this.life = randomExponential(this.LIFESPAN);
    this.growthRate = randomUniform(0.0005, 0.001);
    this.mutationRate = randomUniform(0, 0.01);
    this.resistance = Math.random();
    this.infectivity = Math.random();
}

Bacterium.prototype.radius = 5;

Bacterium.prototype.MIN_SPEED = 0.05;

Bacterium.prototype.MAX_SPEED = 0.1;

Bacterium.prototype.LIFESPAN = 900;

Bacterium.prototype.kill = function () {
    Game.bactContainer.removeChild(this.sprite);
    this.alive = false;
}

Bacterium.prototype.getPositionX = function () {
    return this.sprite.position.x;
}

Bacterium.prototype.getPositionY = function () {
    return this.sprite.position.y;
}

Bacterium.prototype.setPosition = function (x, y) {
    this.sprite.position.x = x;
    this.sprite.position.y = y;
}

Bacterium.prototype.update = function () {
    this.direction += this.turningvelocity * 0.01;
    this.setPosition(this.getPositionX() + Math.sin(this.direction) * this.speed, this.getPositionY() + Math.cos(this.direction) * this.speed);
}

Bacterium.prototype.onCollisionWithBacterium = function (bact) {
    this.speed = -this.speed;

    // add offset to avoid thrashing
    var offsetX = this.getPositionX() - bact.getPositionX();
    var offsetY = this.getPositionY() - bact.getPositionY();
    var length = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    this.setPosition(this.getPositionX() + offsetX / length, this.getPositionY() + offsetY / length);
};

Bacterium.prototype.onCollisionWithPowerup = function (powerup) {
    switch (powerup.type) {
    case PowerupEngine.prototype.TYPES.agar:
        this.growthRate = Math.min(this.growthRate + 0.0001, 0.001);
        this.life = Math.min(this.LIFESPAN, this.life + this.LIFESPAN / 2);
        break;

    case PowerupEngine.prototype.TYPES.penicillin:
        var rand = Math.random();
        if (rand < 0.75 - this.resistance) {
            this.kill();
        }
        break;

    case PowerupEngine.prototype.TYPES.streptomycin:
        var rand = Math.random();
        if (rand < 0.85 - this.resistance) {
            this.kill();
        }
        break;
    case PowerupEngine.prototype.TYPES.ceftobiprole:
        var rand = Math.random();
        if (rand < 0.99 - this.resistance) {
            this.kill();
        }
        break;

    case PowerupEngine.prototype.TYPES.plasmids:
        var rand = Math.random();
        if (rand < 0.5) {
            this.infectivity += randomUniform(-this.mutationRate / 2, this.mutationRate);
        } else {
            Game.powerEngine.spawnFrom(powerup);
            Game.powerEngine.spawnFrom(powerup);
            this.kill();
        }
        break;

    case PowerupEngine.prototype.TYPES.mutagens:
        var rand = Math.random();
        if (rand < 0.5) {
            this.kill();
        } else if (rand < 0.9) {
            this.mutationRate += 0.01;
        }
        // tumor
        else if (rand < 0.95) {
            showAlert('Tumor!');
            for (var i = 0; i < 50; i++) {
                var bacterium = Game.bactEngine.spawnAt(this.getPositionX(), this.getPositionY());
                bacterium.mutationRate += 0.001;
            }
        }
        // cancer    
        else {
            showAlert('Cancerous Growth!!!')
            for (var i = 0; i < 100; i++) {
                var bacterium = Game.bactEngine.spawnAt(this.getPositionX(), this.getPositionY());
                if (!bacterium)
                    continue;
                bacterium.infectivity += 0.05;
                bacterium.growthRate *= 2;
                bacterium.mutationRate += 0.005;
                bacterium.life /= 2;
            }
        }
        break;

    default:
        console.log('bruh what are you even trying to do')
        break;
    }
};