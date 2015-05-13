function PetriDish(positionX, positionY, radius) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.radius = radius;

    var graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xFFFFFF);
    graphics.drawCircle(positionX, positionY, radius + 10);
    var petriInner = graphics.drawCircle(positionX, positionY, radius);
    stage.addChild(graphics);
}

PetriDish.prototype.onCollisionWithBacterium = function (particle) {
    particle.speed = -particle.speed;
    // add offset to avoid thrashing
    var offsetX = this.positionX - particle.getPositionX();
    var offsetY = this.positionY - particle.getPositionY();
    var length = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
    particle.setPosition(particle.getPositionX() + offsetX / length, particle.getPositionY() + offsetY / length);
};

PetriDish.prototype.onCollisionWithPowerup = function (particle) {
    particle.kill();
}

PetriDish.prototype.update = function () {
    // dish-bacterium collisions
    for (var i = 0; i < Game.bactEngine.particles.length; i++) {
        var particle = Game.bactEngine.particles[i];
        if (!particle.alive) continue;

        var dist = getDistance(this.positionX, this.positionY, particle.getPositionX(), particle.getPositionY());
        if (dist >= this.radius - particle.radius - 2) {
            this.onCollisionWithBacterium(particle);
        }
    }

    // dish-powerup collisions
    for (var i = 0; i < Game.powerEngine.particles.length; i++) {
        var particle = Game.powerEngine.particles[i];
        if (!particle.alive) continue;

        var dist = getDistance(this.positionX, this.positionY, particle.getPositionX(), particle.getPositionY());
        if (dist >= this.radius - particle.radius - 2) {
            this.onCollisionWithPowerup(particle);
        }
    }
}