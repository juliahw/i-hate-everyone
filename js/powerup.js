function Powerup(positionX, positionY, type) {
    this.sprite = PIXI.Sprite.fromImage(type.url);
    this.sprite.x = positionX;
    this.sprite.y = positionY;
    this.sprite.anchor.set(0.5);
    this.sprite.rotation = randomUniform(0, 2 * Math.PI);
    Game.powerContainer.addChild(this.sprite);

    this.turningvelocity = type.turningvelocity || 0;
    this.speed = randomUniform(type.MIN_SPEED, type.MAX_SPEED);
    this.direction = this.sprite.rotation;
    this.radius = type.radius;

    this.type = type;
    this.alive = true;
}

Powerup.prototype.kill = function () {
    Game.powerContainer.removeChild(this.sprite);
    this.alive = false;
}

Powerup.prototype.getPositionX = function () {
    return this.sprite.position.x;
}

Powerup.prototype.getPositionY = function () {
    return this.sprite.position.y;
}

Powerup.prototype.setPosition = function (x, y) {
    this.sprite.position.x = x;
    this.sprite.position.y = y;
}

Powerup.prototype.update = function () {
    this.direction += this.turningvelocity * 0.01;
    this.setPosition(this.getPositionX() + Math.sin(this.direction) * this.speed, this.getPositionY() + Math.cos(this.direction) * this.speed);
}

Powerup.prototype.onCollisionWithBacterium = function (bact) {
    this.kill();
};