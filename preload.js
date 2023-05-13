class Preload extends Phaser.Scene {
    constructor() {
        super('preload');
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('level1', 'level1.png');
        this.load.image('level1I', 'level1I.png');
        this.load.image('cursor', 'cursor.png');
    }

    create() {
        this.time.delayedCall(1000, () => {
            this.cameras.main.fade(1000, 239,239,239);
            this.time.delayedCall(1000, () => this.scene.start('menu'));
        });
    }
}