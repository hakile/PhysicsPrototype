class Level1 extends Phaser.Scene {
    constructor() {
        super('level1');
    }

    preload() {
        this.load.path = 'assets/';
        this.load.image('level1', 'level1.png');
        this.load.image('level1I', 'level1I.png');
        this.load.image('cursor', 'cursor.png');
    }
    
    create() {
        // variables and settings
        this.velocity = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        let cooldownOn = false;
        let time_cooldown = 5000/Math.pow(1.2, d_scale-1);
        this.time.delayedCall(333, () => {
            this.velocity = speeed;
            this.velocityX = this.velocity;
            this.velocityY = this.velocity;
        });
        
        this.start_point = [25, 565];

        // set bg color
        this.cameras.main.setBackgroundColor('#FFF');
        
        // set level background
        this.add.sprite(0, 0, 'level1').setOrigin(0);
        this.inv = this.add.sprite(0, 0, 'level1I').setOrigin(0).setAlpha(0);

        // make obstacle tiles
        let ground = this.physics.add.body(0, 700, 1280, 20).setImmovable(true).setAllowGravity(false);
        let ceiling = this.physics.add.body(0, 0, 1280, 20).setImmovable(true).setAllowGravity(false);
        let ob1 = this.physics.add.body(0, 520, 1120, 40).setImmovable(true).setAllowGravity(false);
        let ob2 = this.physics.add.body(300, 340, 980, 40).setImmovable(true).setAllowGravity(false);
        let ob3 = this.physics.add.body(0, 160, 880, 40).setImmovable(true).setAllowGravity(false);
        let ob4 = this.physics.add.body(580, 100, 40, 60).setImmovable(true).setAllowGravity(false);
        let ob5 = this.physics.add.body(220, 20, 40, 60).setImmovable(true).setAllowGravity(false);

        this.obstacles = [ground, ceiling, ob1, ob2, ob3, ob4, ob5];
        // this.obstacles = [];
        
        // add goal
        this.goal = this.physics.add.body(85, 55, 70, 70).setImmovable(true).setAllowGravity(false);
        
        // add player
        this.player = this.physics.add.body(this.start_point[0], this.start_point[1], 10, 10).setCollideWorldBounds(true);
        this.playerSprite = this.add.sprite(this.start_point[0]+5, this.start_point[1]+5, 'cursor').setOrigin(0.5);
        this.playerSprite.rotation = Math.PI*.25;

        // add physics checkers
        this.physics.add.overlap(this.player, this.obstacles, this.die, null, this);
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.overlap(this.player, this.goal, this.finishLevel, null, this);

        // main control
        this.time.delayedCall(333, () => {
            this.input.on('pointerdown', () => {
                this.velocityY = -this.velocity;
                this.tweens.add({
                    targets: this.playerSprite,
                    rotation: -Math.PI*.25*this.playerSprite.scaleX,
                    duration: 31250/this.velocity
                });
            });
            this.input.on('pointerup', () => {
                this.velocityY = this.velocity;
                this.tweens.add({
                    targets: this.playerSprite,
                    rotation: Math.PI*.25*this.playerSprite.scaleX,
                    duration: 31250/this.velocity
                });
            });            
        });

        // difficulty indicator
        let difftext = this.add.text(1240, 670, ``, {font: "50px Arial", color: '#000'}).setOrigin(1,0.5)
        if (d_scale < 9) {difftext.setText(`Difficulty: ${diff_text[d_scale-1]}`)}
        else {
            difftext.setText("wtf how");
            for (let i = 9; i < d_scale; i++) {difftext.text += '?'; difftext.updateText()};
        };
        this.tweens.add({targets: difftext, alpha: 0, duration: 4000, ease: 'Expo.In'});

        // time-slow power
        this.input.keyboard.on('keydown-SPACE', function() {
            if (!cooldownOn) {
                time_cooldown += 1250;
                cooldownOn = true;
                this.playerSprite.setTintFill(0x808080);
                this.tweens.add({targets: this.physics.world, timeScale: 4, duration: 500});
                this.tweens.add({targets: this.tweens, timeScale: .25, duration: 500});
                this.tweens.add({targets: this.time, timeScale: .25, duration: 500});
                this.tweens.add({targets: this.inv, alpha: 1, duration: 75});
                this.time.delayedCall(250, () => {
                    this.tweens.add({targets: this.physics.world, timeScale: 1, duration: 750});
                    this.tweens.add({targets: this.tweens, timeScale: 1, duration: 750});
                    this.tweens.add({targets: this.time, timeScale: 1, duration: 750});
                    this.tweens.add({targets: this.inv, alpha: 0, duration: 750, ease: "Cubic.In"});
                });
                this.time.delayedCall(time_cooldown, () => {
                    cooldownOn = false;
                    this.playerSprite.clearTint();
                    let anim = this.add.sprite(this.playerSprite.x, this.playerSprite.y, 'cursor').setOrigin(0.5);
                    anim.rotation = this.playerSprite.rotation;
                    this.tweens.add({
                        targets: anim,
                        scaleX: {from:this.playerSprite.scaleX, to:2*this.playerSprite.scaleX},
                        scaleY: 2,
                        alpha: {from:0.25,to:0},
                        duration: 1000,
                        ease: "Quint.Out"
                    });
                });
            };
        }, this);
    }

    update() {
        this.player.setVelocityX(this.velocityX);
        this.player.setVelocityY(this.velocityY);
        if (this.player.position.x > 1250) {
            this.velocityX = -this.velocity;
            this.playerSprite.scaleX = -1;
            if (!this.input.activePointer.noButtonDown()) {this.playerSprite.rotation = Math.PI*.25}
            else {this.playerSprite.rotation = -Math.PI*.25};
        };
        if (this.player.position.x < 20) {
            this.velocityX = this.velocity;
            this.playerSprite.scaleX = 1;
            if (!this.input.activePointer.noButtonDown()) {this.playerSprite.rotation = -Math.PI*.25}
            else {this.playerSprite.rotation = Math.PI*.25};
        };
        this.playerSprite.x = this.player.x+7.5;
        this.playerSprite.y = this.player.y+7.5;
    }

    die() {
        this.input.keyboard.removeAllListeners();
        this.tweens.add({targets: this.inv, alpha: {from:0,to:0}, duration: 2000});
        this.physics.world.timeScale = 1;
        this.tweens.timeScale = 1;
        this.time.timeScale = 1;
        this.velocity = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.playerSprite.clearTint();
        this.tweens.add({targets: this.playerSprite, alpha: 0, scaleX: 2*this.playerSprite.scaleX,
            scaleY: 2, rotation: '+=' + 0, duration: 500, ease: 'Quint.Out'});
        this.time.delayedCall(667, () => this.scene.start('level1'));
        for (const item of this.obstacles) {
            item.destroy();
        }
    }

    finishLevel() {
        this.input.keyboard.removeAllListeners();
        this.tweens.add({targets: this.inv, alpha: {from:0,to:0}, duration: 2000});
        this.physics.world.timeScale = 1;
        this.tweens.timeScale = 1;
        this.time.timeScale = 1;
        this.tweens.add({targets: this.playerSprite, rotation: '+=' + 0, duration: 1000});
        this.goal.destroy();
        d_scale++;
        this.velocity = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.playerSprite.clearTint();
        this.cameras.main.fade(1500, 255,255,255);
        this.time.delayedCall(1500, () => this.scene.start('level1'));
        speeed = Math.round(speeed * 1.2);
    }
}