let speeed = 250;
let d_scale = 1;
let diff_text = ["Easy", "Normal", "Hard", "Insane", "Ultra", "Extreme", "Nightmare", "Impossible"];

const game = new Phaser.Game({
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {x: 0, y: 0}
        }
    },
    // scene: [ Preload, MainMenu, Level1, Level2, Level3, Summary ]
    scene: [ Level1 ]
});