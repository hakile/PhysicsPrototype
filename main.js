let speeed = 250;
let d_scale = 1;
let diff_text = ["Easy", "Normal", "Hard", "Insane", "Ultra", "Extreme", "Nightmare", "Impossible"];
let first_time = true;
let highscores = [0,0,0,0];

const game = new Phaser.Game({
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {x: 0, y: 0}
        }
    },
    scene: [ Preload, Level1, Level2, Level3, Summary, Menu ]
});