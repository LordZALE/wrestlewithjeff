var app = new PIXI.Application();
document.body.appendChild(app.view);

PIXI.loader
    .add('img/background.png')
    .add('img/intro_0.png')
    .add('img/intro_1.png')
    .add('img/intro_2.png')
    .add('img/sitting.png')
    .add('img/happy.png')
    .add('img/gettin_ready.png')
    .add('img/big_flex.png')
    .load(initialize);

const world = {};

const timeToPrepare = 30000;

function initialize() {
    //set up background
    world.background = PIXI.Sprite.fromImage('img/background.png');
    world.background.anchor.set(0.5);
    world.background.x = 400;
    world.background.y = 320;
    app.stage.addChild(world.background);

    //set up title text
    let titleTextOptions = {
        fontFamily: 'Arial',
        fontSize: 56,
        fontStyle: 'italic',
        fill: [0xFFFFFF, 0x00a3cf],
        dropShadow: true,
        align: 'center'
    };
    world.titleText = new PIXI.Text('Wrestle With Jeff?', titleTextOptions);
    world.titleText.anchor.set(0.5);
    world.titleText.x = 400;
    world.titleText.y = 30;

    //set up subtitle text
    let subTitleTextOptions = {
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'bold',
        fill: [0xFF1111, 0x000000],
        stroke: 0xFFFFFF,
        strokeThickness: 4,
        align: 'center'
    };
    world.subTitleText = new PIXI.Text('PREPARE FOR DEATH', subTitleTextOptions);
    world.subTitleText.anchor.set(0.5);
    world.subTitleText.x = 400;
    world.subTitleText.y = 80;

    //set up defeat text
    let loseTextOptions = {
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'bold',
        fill: [0xFF1111, 0x000000],
        stroke: 0xFFFFFF,
        strokeThickness: 4,
        align: 'center'
    };
    world.loseText = new PIXI.Text('YOU DID NOT\nADEQUATELY PREPARE FOR DEATH', loseTextOptions);
    world.loseText.anchor.set(0.5);
    world.loseText.x = 400;
    world.loseText.y = 300;

    let clickPromptText = {
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'bold',
        fill: 0xFF0000,
        stroke: 0xFFFFFF,
        strokeThickness: 2,
        align: 'center'
    };
    world.clickPromptText = new PIXI.Text('(CLICK)', clickPromptText);
    world.clickPromptText.anchor.set(0.5);
    world.clickPromptText.x = 400;
    world.clickPromptText.y = 550;

    //set up countdown display
    let remainingDisplayOptions = {
        fontFamily: 'Arial',
        fontSize: 56,
        fontStyle: 'bold',
        fill: 0xFFFF00,
        align: 'right'
    };
    world.remainingDisplay = new PIXI.Text('', remainingDisplayOptions);
    world.remainingDisplay.anchor.set(1, 0);
    world.remainingDisplay.x = 795;
    world.remainingDisplay.y = 0;

    //display title text immediately
    app.stage.addChild(world.titleText);

    setTimeout(playIntro, 1000);
}

function playIntro() {
    //set up intro jeff animation
    let introFrames = [];
    for (let i = 0; i < 3; ++i) {
        introFrames.push(PIXI.Texture.fromFrame(`img/intro_${i}.png`));
    }

    let introJeff = new PIXI.extras.AnimatedSprite(introFrames);
    introJeff.animationSpeed = 1/60;
    introJeff.loop = false;
    setJeff(introJeff);

    //display subtitle text on intro complete
    introJeff.onComplete = () => {
        app.stage.addChild(world.subTitleText);

        clickAnywhereOnce(() => {
            //clean up intro + start game
            app.stage.removeChild(world.titleText);
            app.stage.removeChild(world.subTitleText);

            startGame();
        });
    };

    introJeff.play();
}

function startGame() {
    //restart timer
    world.remaining = timeToPrepare;
    app.stage.addChild(world.remainingDisplay);
    updateRemainingText();

    setJeffImg('sitting');

    let interval = 1000;
    let timer = setInterval(() => {
        //update countdown
        world.remaining = Math.max(world.remaining - interval, 0);
        updateRemainingText();

        //update jeff
        if (world.remaining === 20000) {
            setJeffImg('happy');
        } else if (world.remaining === 15000) {
            setJeffImg('gettin_ready');
        } else if (world.remaining === 10000) {
            setJeffImg('big_flex');
        }

        //check if the game is over
        let lose = world.remaining === 0;
        let win = false;

        if (lose || win) {
            //clean up the game screen
            clearInterval(timer);
            app.stage.removeChild(world.remainingDisplay);
        }

        if (lose) {
            loseGame();
        }

        if (win) {
            //TODO implement me
        }
    }, interval);
}

function loseGame() {
    app.stage.addChild(world.loseText);

    clickAnywhereOnce(() => {
        app.stage.removeChild(world.loseText);

        startGame();
    });
}

// ---------- HELPER FUNCTIONS ----------

function clickAnywhereOnce(f) {
    //add blinking click prompt
    world.clickPromptText.visible = false;
    app.stage.addChild(world.clickPromptText);
    let clickPromptInterval = setInterval(() => {
        world.clickPromptText.visible = !world.clickPromptText.visible;
    }, 500);

    //enable background click
    world.background.interactive = true;
    world.background.buttonMode = true;

    world.background.on('pointerdown', () => {
        //clear background click
        world.background.interactive = false;
        world.background.buttonMode = false;
        world.background.removeAllListeners();

        //clear click prompt
        app.stage.removeChild(world.clickPromptText);
        clearInterval(clickPromptInterval);

        //do the click function
        f();
    });
}

function updateRemainingText() {
    world.remainingDisplay.text = `DEATH IN ${Math.floor(world.remaining/1000)}`;
}

function setJeffImg(jeff) {
    let newJeff = PIXI.Sprite.fromImage(`img/${jeff}.png`);
    setJeff(newJeff);
}

function setJeff(jeff) {
    if (world.jeff) {
        app.stage.removeChild(world.jeff);
    }

    if (jeff) {
        world.jeff = jeff;
        jeff.x = 400;
        jeff.y = 350;
        jeff.anchor.set(0.5);
        app.stage.addChild(jeff);
    }
}