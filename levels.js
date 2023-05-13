class Level1 extends Phaser.Scene {
    init(data) {
        speeed = data.sped || 250;
        d_scale = data.d_scale || 1;
        this.score = data.score || 0;
        this.endless = data.endless || false;
        this.time_endless = data.time_endless || 0;
        this.first_attempt = data.first_attempt || false;
    }

    constructor() {
        super('level1');
    }
    
    create() {
        // set bg color
        console.log('Current score: ' + this.score);
        this.cameras.main.setBackgroundColor('#FFF');
        
        // set level background
        this.add.sprite(0, 0, 'level1').setOrigin(0);
        this.inv = this.add.sprite(0, 0, 'level1I').setOrigin(0).setAlpha(0);

        // first time playing?
        if (first_time) {
            let tut_text = this.add.text(1240, 45, "Hold left mouse to move up\nPress space to activate your power!", {
                font: "30px Arial", color: '#000', align: 'right'}).setOrigin(1,0);
            this.time.delayedCall(7500, () => {this.tweens.add({targets: tut_text, alpha: 0, duration: 1000}); first_time = false});
        };

        // difficulty indicator
        let difftext = this.add.text(1240, 670, ``, {font: "50px Arial", color: '#000'}).setOrigin(1,0.5).setAlpha(0);
        this.tweens.add({targets: difftext, alpha: 1, duration: 250});
        if (d_scale < 9) {difftext.setText(`Difficulty: ${diff_text[d_scale-1]}`)}
        else {
            difftext.setText("wtf how");
            for (let i = 9; i < d_scale; i++) {difftext.text += '?'; difftext.updateText()};
        };
        this.time.delayedCall(2500, () => this.tweens.add({targets: difftext, alpha: 0, duration: 500}));
        
        // first attempt fade
        let ft_del = 0;
        if (this.first_attempt) {this.cameras.main.fadeIn(1000, 239,239,239); this.first_attempt = false; ft_del = 667;};

        // variables
        this.velocity = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.power_use = 0;
        this.start_time = 0;
        let cooldownOn = false;
        let time_cooldown = 3000/Math.pow(1.2, d_scale-1);
        this.time.delayedCall(500+ft_del, () => {this.velocity = speeed; this.velocityX = this.velocity;
            this.velocityY = this.velocity; this.start_time = this.time.now});
        this.start_pos = [25, 565];

        // obstacle tiles
        let ground = this.physics.add.body(0, 700, 1280, 20).setImmovable(true).setAllowGravity(false);
        let ceiling = this.physics.add.body(0, 0, 1280, 20).setImmovable(true).setAllowGravity(false);
        let ob1 = this.physics.add.body(0, 520, 1120, 40).setImmovable(true).setAllowGravity(false);
        let ob2 = this.physics.add.body(300, 340, 980, 40).setImmovable(true).setAllowGravity(false);
        let ob3 = this.physics.add.body(0, 160, 880, 40).setImmovable(true).setAllowGravity(false);
        let ob4 = this.physics.add.body(580, 100, 40, 60).setImmovable(true).setAllowGravity(false);
        let ob5 = this.physics.add.body(220, 20, 40, 60).setImmovable(true).setAllowGravity(false);

        this.obstacles = [ground, ceiling, ob1, ob2, ob3, ob4, ob5];
        
        // goal
        this.goal = this.physics.add.body(85, 55, 70, 70).setImmovable(true).setAllowGravity(false);
        
        // player
        this.player = this.physics.add.body(this.start_pos[0], this.start_pos[1], 10, 10).setCollideWorldBounds(true);
        this.playerSprite = this.add.sprite(this.start_pos[0]+5, this.start_pos[1]+5, 'cursor').setOrigin(0.5).setScale(2).setAlpha(0);
        this.playerSprite.rotation = Math.PI*.25;
        this.time.delayedCall(ft_del, () => this.tweens.add({
            targets: this.playerSprite, scale: 1, alpha: 1, duration: 500, ease: "Expo.Out"}));

        // physics solvers
        this.physics.add.overlap(this.player, this.obstacles, this.die, null, this);
        this.physics.add.collider(this.player, this.obstacles);
        this.physics.add.overlap(this.player, this.goal, this.finishLevel, null, this);

        // main control (continuous)
        this.time.delayedCall(500 + ft_del, () => {
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

        // power control (discrete)
        this.input.keyboard.on('keydown-SPACE', function() {
            if (!cooldownOn) {
                cooldownOn = true;
                this.playerSprite.setTintFill(0x808080);
                this.tweens.add({targets: this.physics.world, timeScale: 4, duration: 500});
                this.tweens.add({targets: [this.tweens, this.time], timeScale: .25, duration: 500});
                this.tweens.add({targets: this.inv, alpha: 1, duration: 75});
                this.time.delayedCall(375-25*this.power_use, () => {
                    this.tweens.add({targets: [this.physics.world, this.tweens, this.time], timeScale: 1, duration: 750});
                    this.tweens.add({targets: this.inv, alpha: 0, duration: 750, ease: "Cubic.In"})});
                this.power_use++;
                this.time.delayedCall(time_cooldown, () => {
                    cooldownOn = false;
                    time_cooldown *= 1.2;
                    this.playerSprite.clearTint();
                    let anim = this.add.sprite(this.playerSprite.x, this.playerSprite.y, 'cursor').setOrigin(0.5);
                    anim.rotation = this.playerSprite.rotation;
                    this.tweens.add({
                        targets: anim, scaleX: {from:this.playerSprite.scaleX, to:2*this.playerSprite.scaleX}, scaleY: 2,
                        alpha: {from:0.25,to:0}, duration: 1000, ease: "Quint.Out"});
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
        this.playerSprite.x = this.player.x+5;
        this.playerSprite.y = this.player.y+5;
    }

    die() {
        let total_time = 0.001 * (this.time.now - this.start_time) + this.time_endless;
        this.input.keyboard.removeAllListeners();
        this.tweens.add({targets: this.inv, alpha: {from:0,to:0}, duration: 2000});
        this.physics.world.timeScale = 1; this.tweens.timeScale = 1; this.time.timeScale = 1;
        this.velocity = 0; this.velocityX = 0; this.velocityY = 0; this.playerSprite.clearTint();
        this.tweens.add({targets: this.playerSprite, alpha: 0, scaleX: 2*this.playerSprite.scaleX,
            scaleY: 2, rotation: '+=' + 0, duration: 500, ease: 'Quint.Out'});
        this.time.delayedCall(1000, () => {
            if (this.endless) {this.cameras.main.fade(625, 239,239,239);
                this.time.delayedCall(625, () => this.scene.start('summary', {sped: speeed, d_scale: d_scale, endless: true,
                    level: 1, time_summary: total_time, power_uses: this.power_use, score: this.score}))}
            else {this.scene.start('level1', {sped: speeed, d_scale: d_scale, first_attempt: false})}});
        for (const item of this.obstacles) {
            item.destroy();
        }
    }

    finishLevel() {
        let curr_time = 0.001 * (this.time.now - this.start_time);
        let total_time = 0.001 * (this.time.now - this.start_time) + this.time_endless;
        this.score += Math.round(1000000/(curr_time * curr_time)) - 100 * this.power_use;
        this.input.keyboard.removeAllListeners();
        this.tweens.add({targets: this.inv, alpha: {from:0,to:0}, duration: 2000});
        this.physics.world.timeScale = 1; this.tweens.timeScale = 1; this.time.timeScale = 1;
        this.tweens.add({targets: this.playerSprite, rotation: '+=' + 0, duration: 1000});
        this.goal.destroy(); this.velocity = 0; this.velocityX = 0; this.velocityY = 0; this.playerSprite.clearTint();
        this.cameras.main.fade(1500, 239,239,239);
        if (this.endless) {this.time.delayedCall(1500, () => this.scene.start('level1', {sped: Math.round(speeed*1.2),
            d_scale: d_scale+1, score: this.score, endless: true, time_endless: total_time, first_attempt: true}))}
        else {this.time.delayedCall(1500, () => this.scene.start('summary', {
            level: 1, time_summary: total_time, power_uses: this.power_use, score: this.score}))}
    }
}