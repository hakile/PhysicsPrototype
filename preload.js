class Preload extends Phaser.Scene {
    constructor() {
        super('preload');
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('level1', 'level1.png');
        this.load.image('level1I', 'level1I.png');
        this.load.image('level2', 'level2.png');
        this.load.image('level2I', 'level2I.png');
        this.load.image('level3', 'level3.png');
        this.load.image('level3I', 'level3I.png');
        this.load.image('cursor', 'cursor.png');
        this.load.image('ball', 'ball.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#FFF');
        this.time.delayedCall(500, () => {
            // this.cameras.main.fade(1000, 255,255,255);
            this.time.delayedCall(0, () => this.scene.start('menu'));
        });
    }
}