//////////////////////////////////////////////////////////
// BACTERIA ENGINE
//////////////////////////////////////////////////////////

function BacteriaEngine(maxParticles) {
    this.maxParticles = maxParticles || 1000;
    this.particles = [];

    this.population = 0; // number of live particles
    this.resistance = 0; // average % resistance
    this.infectivity = 0; // average % infectivity
}

BacteriaEngine.prototype.spawnFrom = function (parent) {
    if (this.population >= this.maxParticles) return null;

    var bacterium = new Bacterium(parent.getPositionX(), parent.getPositionY());

    // simulate cell division
    parent.resistance = Math.min(1, Math.max(0.001, Math.random() * 5 * parent.mutationRate + parent.resistance));
    bacterium.resistance = parent.resistance;
    parent.infectivity = Math.max(0.001, parent.infectivity + randomUniform(-0.02 * parent.infectivity, 0.05 * parent.infectivity));
    bacterium.infectivity = parent.infectivity;
    
    bacterium.growthRate = parent.growthRate;
    
    this.particles.push(bacterium);
    return bacterium;
};

BacteriaEngine.prototype.spawnAt = function (positionX, positionY) {
    if (this.population >= this.maxParticles) return null;

    var bacterium = new Bacterium(positionX, positionY);
    this.particles.push(bacterium);
    return bacterium;
};

BacteriaEngine.prototype.divide = function () {
    var length = this.particles.length;
    for (var i = 0; i < length; i++) {
        var bacterium = this.particles[i];
        if (!bacterium.alive) continue;

        if (Math.random() < bacterium.growthRate) {
            this.spawnFrom(bacterium);
        }
    }
}

BacteriaEngine.prototype.update = function () {
    this.population = 0;
    this.resistance = 0;
    this.infectivity = 0;

    for (var i = 0; i < this.particles.length; i++) {
        var bact = this.particles[i];
        if (!bact.alive) continue;

        // update positions
        bact.update();
        
        // kill if life is used up
        if (bact.life-- <= 0) bact.kill();

        // update stats
        this.population++;
        this.resistance += bact.resistance;
        this.infectivity += bact.infectivity;
    }

    // these are average percentages
    this.resistance = (this.resistance / this.population) || 0;
    this.infectivity = (this.infectivity / this.population) || 0;
}

BacteriaEngine.prototype.clean = function () {
    var bact = [];
    for (var i = 0; i < this.particles.length; i++) {
        if (this.particles[i].alive)
            bact.push(this.particles[i]);
    }
    this.particles = bact;
}


//////////////////////////////////////////////////////////
// POWERUP ENGINE
//////////////////////////////////////////////////////////

function PowerupEngine() {
    this.particles = [];
    this.type = null;
}

PowerupEngine.prototype.spawnAt = function (positionX, positionY) {
    for (var i = 0; i < this.type.instances; i++) {
        var powerup = new Powerup(positionX, positionY, this.type);
        this.particles.push(powerup);
    }
};

PowerupEngine.prototype.spawnFrom = function (parent) {
    var powerup = new Powerup(parent.getPositionX(), parent.getPositionY(), parent.type);
    this.particles.push(powerup);
};

PowerupEngine.prototype.update = function () {
    for (var i = 0; i < this.particles.length; i++) {
        var powerup = this.particles[i];
        if (!powerup.alive) continue;

        powerup.update();
    }
}

PowerupEngine.prototype.clean = function () {
    var power = [];
    for (var i = 0; i < this.particles.length; i++) {
        if (this.particles[i].alive)
            power.push(this.particles[i]);
    }
    this.particles = power;
}

PowerupEngine.prototype.TYPES = {
    agar: {
        url: 'img/sprites/agar.png',
        radius: 5,
        MIN_SPEED: 0.1,
        MAX_SPEED: 0.5,
        price: 1,
        instances: 25,
        turningvelocity: Math.random() - 0.5,
        tagline: '<h5>Agar</h5>Feed your bacteria with this delicious seaweed gel.'
    },

    penicillin: {
        url: 'img/sprites/anti-p.png',
        radius: 2,
        MIN_SPEED: 1,
        MAX_SPEED: 2,
        price: 5,
        instances: 100,
        tagline: '<h5>Penicillin</h5>Any superbacterium must be resistant to this common antibiotic.'
    },

    streptomycin: {
        url: 'img/sprites/anti-s.png',
        radius: 2,
        MIN_SPEED: 1,
        MAX_SPEED: 2,
        price: 8,
        instances: 100,
        tagline: '<h5>Streptomycin</h5>Effective against both Gram-positive & Gram-negative bacteria.'
    },

    ceftobiprole: {
        url: 'img/sprites/anti-c.png',
        radius: 4,
        MIN_SPEED: 1,
        MAX_SPEED: 2,
        price: 15,
        instances: 100,
        tagline: '<h5>Ceftobiprole</h5>A 5th-generation cephalosporin. Careful: this stuff is <i>strong</i>!'
    },

    plasmids: {
        url: 'img/sprites/plasmid.png',
        radius: 2,
        MIN_SPEED: 0.1,
        MAX_SPEED: 0.2,
        price: 50,
        instances: 5,
        tagline: '<h5>Plasmids</h5>Insert plasmids from the flesh-eating Streptococcus A strand.'
    },

    mutagens: {
        url: 'img/sprites/mutagen.png',
        radius: 4,
        MIN_SPEED: 0.5,
        MAX_SPEED: 1.0,
        price: 100,
        instances: 10,
        tagline: '<h5>Mutagens</h5>Chances are this will give you cancer...but YOLO, right?'
    }
};