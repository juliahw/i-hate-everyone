 intro1 = {
    element: $sceneTextMain,
    text: ['This is you.',
           'You are a miserable grad student working at a bacterial genetics lab.',
           'Your PI just received tenure. Hooray!',
           'This means she no longer needs to care about your life, career, or wellbeing.'
          ]
};
var intro2 = {
    element: $sceneTextMain,
    text: ['...as if she ever did.',
            'As of a minute ago, you received the following email from her:'
          ]
};
var intro3 = {
    element: $sceneTextLetter,
    text: ['Hello Slave,',
           '',
           'I need you to run a 10,000 generation experiment on the bacilli in Incubator B.',
           'Details are attached.',
           '',
           'I’m on a lecture tour in Europe but I’ll be back in 4 weeks.',
           'Have fun!!',
           '',
           '- Your PI',
           '',
           'P.S. Don\'t bother me for help.'
          ]
};
var intro4 = {
    element: $sceneTextMain,
    text: ['After some rough calculations, you realize the experiment will take approximately 6 years of your life.',
           'This is the last straw. The world has treated you like dirt for far too long!!',
           'It\'s time to plot your ultimate revenge.....',
          ]
};
var week0 = {
    element: $sceneTextLetter,
    text: ['Dear Diary,',
           '',
           'So it begins.',
           'I have chosen a virulent strand of bacteria to begin my experiments.',
           '',
           'The apocalypse starts now!'
          ]
};
var week1 = {
    element: $sceneTextLetter,
    text: ['Dear Diary,',
           '',
           'Today I was assigned an undergrad who\'s working on his thesis.',
           'Thank goodness he\'s a premed... He doesn\'t question my motives as long as I promise him an A.',
          ]
};
var week2 = {
    element: $sceneTextLetter,
    text: ['Dear Diary,',
           '',
           'Today a female colleague took me out to lunch.',
           'It was surprisingly pleasant. This is a small ray of hope for humanity.',
           '',
           'It\'s a pity she\'ll have to die with the rest of them...'
          ]
};
var week3 = {
    element: $sceneTextLetter,
    text: ['Dear Diary,',
           '',
           'My PI is posting pictures of herself all over Facebook.',
           'There she is, taking selfies in front of the Eiffel Tower.',
           '',
           'Is she even working?!'
          ]
};
var win = {
    element: $sceneTextMain,
    text: ['Great job!',
           'You bred some pretty cool bacteria.',
           'Unfortunately, while you were making your culture resistant to all kinds of antibiotics, you forgot to make it resistant to Tylenol.',
           'You did, however, succeed in causing a meningitis scare at the university.',
           'Your PI is impressed with your work and promotes you to a window desk.'
          ]
};

function playScene(name) {
    switch (name) {
    case 'intro1':
        Velocity($sceneScreen, 'transition.fadeIn', 1000);
        Velocity($playerIntro, 'transition.bouncyIn', {
            display: 'block',
            duration: 1000,
            delay: 1000,
            complete: function () {
                typewriter(intro1, 0, function () {
                    Velocity($playerIntro, 'transition.fadeOut');
                    playScene('intro2');
                });
            }
        });
        break;

    case 'intro2':
        typewriter(intro2, 0, function () {
            playScene('intro3');
        });
        break;

    case 'intro3':
        typewriter(intro3, 0, function () {
            playScene('intro4');
        }, true);
        break;

    case 'intro4':
        typewriter(intro4, 0, showHomeScreen);
        break;

    case 'week0':
        skip = false;
        Velocity($skipBtn, 'transition.slideUpIn');
        Velocity($sceneScreen, 'transition.fadeIn', 1000);
        typewriter(week0, 0, function () {
            Velocity($sceneScreen, 'transition.fadeOut', 500);
            animateIn();
            Game.init('NORMAL');
        }, true);
        break;

    case 'week1':
        skip = false;
        Velocity($skipBtn, 'transition.slideUpIn');
        Velocity($sceneScreen, 'transition.fadeIn');
        typewriter(week1, 0, function () {
            Velocity($sceneScreen, 'transition.fadeOut', 500);
            Game.resume();
        }, true);
        break;

    case 'week2':
        skip = false;
        Velocity($skipBtn, 'transition.slideUpIn');
        Velocity($sceneScreen, 'transition.fadeIn', 1000);
        typewriter(week2, 0, function () {
            Velocity($sceneScreen, 'transition.fadeOut', 500);
            Game.resume();
        }, true);
        break;

    case 'week3':
        skip = false;
        Velocity($skipBtn, 'transition.slideUpIn');
        Velocity($sceneScreen, 'transition.fadeIn', 1000);
        typewriter(week3, 0, function () {
            Velocity($sceneScreen, 'transition.fadeOut', 500);
            Game.resume();
        }, true);
        break;

    case 'win':
        skip = false;
        Game.over = true;
        animateOut(function () {
            Game.stopped = true;
            Velocity($skipBtn, 'transition.slideUpIn');
            Velocity($sceneScreen, 'transition.fadeIn', 1000);
            
            typewriter(win, 0, function () {
                Velocity($sceneScreen, 'transition.fadeOut', 500);
                Velocity($gameover, 'transition.fadeIn', 1000);
                $gameoverText.innerHTML = 'It was fun while it lasted.';
            });
            
            for (var i = stage.children.length - 1; i >= 0; i--) {
                stage.removeChild(stage.children[i]);
            }
            
            buttons.forEach(function (button) {
                dehighlight(button);
            });
        });
        break;
    }
}

var skip = false;

// Display text with a typewriter effect
function typewriter(screen, index, callback, noDeletion) {
    if (index >= screen.text.length) {
        if (callback) callback();
        return;
    }

    var charTime, extraTime;
    if (skip) {
        charTime = 0;
        extraTime = 0;
    } else if (screen.text[index].length === 0) {
        extraTime = 0;
    } else {
        charTime = 50;
        extraTime = 500;
    }

    // separate by letter
    var text = screen.text[index].split('');

    // type each letter one by one
    text.forEach(function (letter, i) {
        setTimeout(function () {
            screen.element.insertAdjacentHTML('BeforeEnd', letter);
        }, charTime * i);
    });

    // move on to the next index
    setTimeout(function () {
        if (noDeletion && index < screen.text.length - 1) {
            screen.element.insertAdjacentHTML('BeforeEnd', '<br>');
        } else {
            screen.element.innerHTML = '';
        }
        typewriter(screen, index + 1, callback, noDeletion);
    }, charTime * text.length + extraTime);
}

// Speed through the sequence
function skipSequence() {
    skip = true;
    Velocity($skipBtn, 'transition.slideDownOut');
}