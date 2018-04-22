var app = new PIXI.Application();
document.body.appendChild(app.view);

PIXI.loader
    .add('img/background.png')
    .add('img/intro_0.png')
    .add('img/intro_1.png')
    .add('img/intro_2.png')
    .add('img/sitting.png')
    .load(initialize);

const world = {};

function initialize() {
    //set up background
    let background = PIXI.Sprite.fromImage('img/background.png');
    world.background = background;
    background.anchor.set(0.5);
    background.x = 400;
    background.y = 320;
    app.stage.addChild(background);

    //set up title text
    let titleTextOptions = {
        fontFamily: 'Arial',
        fontSize: 56,
        fontStyle: 'italic',
        fill: [0xFFFFFF, 0x00a3cf],
        dropShadow: true,
        align: 'center'
    };
    let titleText = new PIXI.Text('Wrestle With Jeff?', titleTextOptions);
    world.titleText = titleText;
    titleText.anchor.set(0.5);
    titleText.x = 400;
    titleText.y = 30;
    app.stage.addChild(titleText);

    setTimeout(playIntro, 1000);
}

function playIntro() {
    //set up subtitle text
    let subTitleTextOptions = {
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'bold',
        fill: [0xFF1111, 0x000000],
        dropShadow: true,
        dropShadowColor: 0x888888,
        align: 'center'
    };
    let subTitleText = new PIXI.Text('PREPARE FOR DEATH', subTitleTextOptions);
    world.subTitleText = subTitleText;
    subTitleText.anchor.set(0.5);
    subTitleText.x = 400;
    subTitleText.y = 80;
    subTitleText.visible = false;
    app.stage.addChild(subTitleText);

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
        subTitleText.visible = true;
        world.background.interactive = true;
        world.background.buttonMode = true;

        world.background.on('pointerdown', () => {
            //clean up intro + start game
            world.background.interactive = false;
            world.background.buttonMode = false;
            world.background.removeAllListeners();
            app.stage.removeChild(world.titleText);
            app.stage.removeChild(world.subTitleText);
            app.stage.removeChild(world.introAnim);

            startGame();
        });
    };

    introJeff.play();
}

function startGame() {
    setJeffImg('sitting');
}

function setJeffImg(jeff) {
    let newJeff = PIXI.Sprite.fromImage(`img/${jeff}.png`);
    setJeff(newJeff);
}

function setJeff(jeff) {
    if (world.jeff) {
        app.stage.removeChild(world.jeff);
    }

    world.jeff = jeff;
    jeff.x = 400;
    jeff.y = 350;
    jeff.anchor.set(0.5);
    app.stage.addChild(jeff);
}