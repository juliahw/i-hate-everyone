//////////////////////////////////////////////////////////
// DOM OBJECTS CACHE
//////////////////////////////////////////////////////////

// cutscenes
var $sceneScreen = document.getElementById('scene-screen'),
    $sceneTextMain = document.getElementById('scene-text-main'),
    $sceneTextLetter = document.getElementById('scene-text-letter'),
    $playerIntro = document.getElementById('player-intro'),
    $skipBtn = document.getElementById('btn-skip');

// gameplay
var $playerProfile = document.getElementById('player-profile'),
    $piProfile = document.getElementById('pi-profile'),
    $canvas = document.getElementById('canvas'),
    $agar = document.getElementById('agar'),
    $penicillin = document.getElementById('penicillin'),
    $streptomycin = document.getElementById('streptomycin'),
    $ceftobiprole = document.getElementById('ceftobiprole'),
    $plasmids = document.getElementById('plasmids'),
    $mutagens = document.getElementById('mutagens'),
    $info = document.getElementById('info-box'),
    $alert = document.getElementById('alert-box'),
    $week = document.getElementById('week'),
    $day = document.getElementById('day'),
    $population = document.getElementById('population'),
    $resistance = document.getElementById('resistance'),
    $infectivity = document.getElementById('infectivity'),
    $funds = document.getElementById('funds'),
    $footer = document.getElementById('footer'),
    $stats = document.getElementById('stats');

// screens
var $gameover = document.getElementById('gameover-screen'),
    $gameoverText = document.getElementById('gameover-text'),
    $homeScreen = document.getElementById('home-screen'),
    $startBtns = document.getElementsByClassName('btn-start'),
    $ihe = document.querySelectorAll('#home-screen h1'),
    $helpScreen = document.getElementById('about-screen'),
    $utilBtns = document.getElementById('util-btns');


//////////////////////////////////////////////////////////
// VELOCITY ANIMATIONS
//////////////////////////////////////////////////////////

Velocity.RegisterEffect('transition.bouncyIn', {
    defaultDuration: 1000,
    calls: [
        [{
            opacity: [1, 0],
            translateY: [0, -1000]
        }, 0.60, {
            easing: "easeOutCirc"
        }],
        [{
            translateY: -25
        }, 0.15],
        [{
            translateY: 0
        }, 0.25]]
});

Velocity.RegisterEffect("transition.bouncyOut", {
    defaultDuration: 1000,
    calls: [
            [{
            translateY: [-30, 0]
        }, 0.20],
            [{
            translateY: [0, -30]
        }, 0.20],
            [{
            opacity: [0, "easeInCirc", 1],
            translateY: -1000
        }, 0.60]
        ]
})

//////////////////////////////////////////////////////////
// SCREEN CHANGE HANDLERS
//////////////////////////////////////////////////////////

// Display the launcher page
function showHomeScreen() {
    Velocity($skipBtn, 'transition.slideDownOut');
    Velocity($sceneScreen, 'transition.fadeOut');

    // animate in home screen elements
    Velocity($homeScreen, 'transition.fadeIn', 1000);
    Velocity($ihe, 'transition.bounceDownIn', {
        delay: 1000,
        display: 'inline-block',
        stagger: 500,
        duration: 500
    });
    Velocity($startBtns, 'transition.slideUpIn', {
        duration: 500,
        delay: 2500
    });
}

// Start a new game canvas
function newGame(mode) {
    if (mode === 'NORMAL') {
        Velocity($homeScreen, 'transition.slideUpOut');
        playScene('week0');
    } else {
        Velocity([$homeScreen, $gameover], 'transition.slideUpOut');
        animateIn();
        Game.init(mode || Game.mode);
    }
}

function restartGame() {
    Game.pause(function () {
        for (var i = stage.children.length - 1; i >= 0; i--) {
            stage.removeChild(stage.children[i]);
        }
        setTimeout(newGame, 500);
    });
}

function animateIn(callback) {
    // animate in all game UI elements
    Velocity($footer, 'transition.slideUpIn', 1000);
    Velocity($playerProfile, 'transition.slideUpIn', {
        delay: 250
    })
    Velocity($piProfile, 'transition.slideUpIn', {
        delay: 500
    })
    Velocity($stats, 'transition.bouncyIn', {
        delay: 1000
    });
    Velocity([$canvas, $utilBtns], 'transition.fadeIn', {
        duration: 2000,
        delay: 1000,
        complete: callback
    });
}

function animateOut(callback) {
    Velocity($stats, 'transition.bouncyOut');
    Velocity($footer, 'transition.slideDownOut', 1000);
    Velocity($playerProfile, 'transition.slideDownOut', {
        delay: 250
    });
    Velocity($piProfile, 'transition.slideDownOut', {
        delay: 500
    });
    Velocity([$canvas, $utilBtns], 'transition.fadeOut', {
        duration: 1000,
        delay: 1000,
        complete: callback
    });
}

// Display how-to-play screen
function showHelpScreen() {
    Game.pause(function () {
        Velocity($helpScreen, 'transition.fadeIn', 1000);
    });
}

function hideHelpScreen() {
    Velocity($helpScreen, 'transition.fadeOut', 500);
    Game.resume();
}

// Display game over screen with endgame description
function gameOver(text) {
    if (Game.over) return;
    Game.over = true;

    Game.pause(function () {
        for (var i = stage.children.length - 1; i >= 0; i--) {
            stage.removeChild(stage.children[i]);
        }
        Velocity($gameover, 'transition.fadeIn', 1000);
    });

    $gameoverText.innerHTML = text;

    buttons.forEach(function (button) {
        dehighlight(button);
    })
}

// show an in-game alert
function showAlert(text) {
    var alert = document.createElement('p');
    alert.innerHTML = text;
    $alert.appendChild(alert);
    setTimeout(function () {
        Velocity(alert, 'fadeOut');
    }, 1000);
}


//////////////////////////////////////////////////////////
// BUTTON/MOUSE HANDLERS
//////////////////////////////////////////////////////////

var buttons = [$agar, $penicillin, $streptomycin, $ceftobiprole, $plasmids, $mutagens];

// set powerup type to none
function dehighlight(btn) {
    btn.className = 'col-xs-2 button';
    Game.powerEngine.type = null;
    $info.innerHTML = 'Power up your bacteria:';
}

// set powerup type to corresponding type
function highlight(btn) {
    buttons.forEach(function (button) {
        button.className = 'col-xs-2 button';
    });
    btn.className += ' highlighted';
    Game.powerEngine.type = Game.powerEngine.TYPES[btn.id];
    $info.innerHTML = Game.powerEngine.TYPES[btn.id].tagline;
}

// assign click handlers for each button
function setupButtons() {
    var toggleButton = function () {
        if (this.className === 'col-xs-2 button')
            highlight(this);
        else
            dehighlight(this);
    };

    buttons.forEach(function (button) {
        button.onclick = toggleButton;
    });
}

// assign mouseover and click handlers for petri dish
function setupMouseHandlers() {

    // change cursor style on hover over petri dish
    renderer.view.addEventListener('mousemove', function (e) {
        if (isCollision(e.x, e.y, 0, Game.dish.positionX, Game.dish.positionY, Game.dish.radius)) {
            document.body.style.cursor = 'crosshair';
        } else {
            document.body.style.cursor = 'default';
        }
    });

    // spawn powerup on click on petri dish
    renderer.view.addEventListener('mousedown', function (e) {
        if (!isCollision(e.x, e.y, 0, Game.dish.positionX, Game.dish.positionY, Game.dish.radius))
            return;
        if (!Game.powerEngine.type)
            return

        // make sure player has enough funds
        var remaining = Game.funds - Game.powerEngine.type.price;

        if (Game.mode === 'SANDBOX' || remaining >= 0) {
            Game.powerEngine.spawnAt(e.x, e.y);
            Game.funds = remaining;

            // 2% chance that player gets cancer from mutagens
            if (Game.powerEngine.type === Game.powerEngine.TYPES.mutagens) {
                if (Math.random() < 0.02) {
                    Game.cancer = true;
                }
            }
        } else {
            showAlert('Out of funds!');
        }
    });
}

document.addEventListener('keydown', function(e) {
        Game.win = true;
        playScene('win');
    }
})