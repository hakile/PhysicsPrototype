class Summary extends Phaser.Scene {
    init(data) {
        speeed = data.sped || 250;
        d_scale = data.d_scale || 1;
        this.endless = data.endless || false;
        this.level = data.level || 0;
        this.time_summary = data.time_summary || 0;
        this.power_uses = data.power_uses || 0;
        this.score = data.score || 0;
    }

    constructor() {
        super('summary');
    }
    
    create() {
        // variables
        this.scoreBuild = 0;
        this.add_inc = 1;
        this.score_fin = false;
        this.curr_lvl = this.level - 1;
        
        this.cameras.main.setBackgroundColor('#EFEFEF');
        
        // end-of-level text
        let lvlcomp = this.add.text(640, 360, 'LEVEL COMPLETE!', {font: `bold 75px Times New Roman`, color: '#000'})
            .setOrigin(0.5).setScale(4).setAlpha(0);
        let lvluses = this.add.text(1500, 380, `Power Uses: ${this.power_uses}`, {
            font: `35px Trebuchet MS`, color: '#000'}).setOrigin(.5);
        let lvlnum = this.add.text(1500-lvluses.width*.5, 300, `Level ${this.level}`, {
            font: `35px Trebuchet MS`, color: '#000'}).setOrigin(0,.5);
        let lvltime = this.add.text(1500-lvluses.width*.5, 340, `Time: ${this.time_summary.toFixed(3)}s`, {
            font: `35px Trebuchet MS`, color: '#000'}).setOrigin(0,.5);
        this.lvlscore = this.add.text(1500-lvluses.width*.5, 420, `Score: 0`, {
            font: `35px Trebuchet MS`, color: '#000'}).setOrigin(0,.5);
        
        // text animations
        this.time.delayedCall(500, () => this.tweens.add({targets: lvlcomp, scale: 1, duration: 500, ease: 'Bounce.Out'}));
        this.time.delayedCall(500, () => this.tweens.add({targets: lvlcomp, alpha: 1, duration: 100, ease: 'Quart.In'}));
        this.time.delayedCall(1250, () => {
            this.tweens.add({targets: lvlcomp, y: 140, duration: 750, ease: 'Back.InOut'});
            this.time.delayedCall(400, () => this.tweens.add({targets: lvlnum, x: 640-lvluses.width*.5,
                duration: 1000, ease: 'Expo.Out'}));
            this.time.delayedCall(500, () => this.tweens.add({targets: lvltime, x: 640-lvluses.width*.5,
                duration: 1000, ease: 'Expo.Out'}));
            this.time.delayedCall(600, () => this.tweens.add({targets: lvluses, x: 640,
                duration: 1000, ease: 'Expo.Out'}));
            this.time.delayedCall(700, () => this.tweens.add({targets: this.lvlscore, x: 640-lvluses.width*.5,
                duration: 1000, ease: 'Expo.Out'}))});
        
        // buttons
        this.lvlbutton = this.add.text(590, 880, `Next Level`, {font: `bold 35px Arial`, color: `#000`}).setOrigin(1,.5).setInteractive()
            .on('pointerover', () => this.lvlbutton.setColor(`#808080`))
            .on('pointerout', () => this.lvlbutton.setColor(`#000`))
            .on('pointerdown', () => {this.cameras.main.fade(750, 239,239,239);
                this.time.delayedCall(750, () => this.scene.start('level1', {sped: speeed, d_scale: d_scale,
                    score: 0, endless: false, first_attempt: true}))});
        this.menubutton = this.add.text(690, 880, `Main Menu`, {font: `bold 35px Arial`, color: `#000`}).setOrigin(0,.5).setInteractive()
            .on('pointerover', () => this.menubutton.setColor(`#808080`))
            .on('pointerout', () => this.menubutton.setColor(`#000`))
            .on('pointerdown', () => {this.cameras.main.fade(750, 239,239,239);
                this.time.delayedCall(750, () => this.scene.start('menu'))});
        
        // endless
        if (this.endless) {
            this.lvlbutton.x = -2560; this.menubutton.x = 640; this.menubutton.setOrigin(.5);
            lvlcomp.setText('FINISH!'); lvlnum.setText(`Levels completed: ${this.level * d_scale - 1}`); this.curr_lvl = 3
            lvltime.setText(`Time survived: ${this.time_summary.toFixed(3)}s`)};
    }

    update() {
        this.time.delayedCall(2500, () => {
            if (this.scoreBuild < this.score) {
                this.add_inc *= 1.1;
                this.scoreBuild += Math.round(this.add_inc);
                this.lvlscore.setText(`Score: ${this.scoreBuild}`);
            } else if (!this.score_fin) {
                this.score_fin = true;
                this.lvlscore.setText(`Score: ${this.score}`);
                if (this.score > highscores[this.curr_lvl]) {
                    let hstext = this.add.text(this.lvlscore.x+this.lvlscore.width+20, 420, "NEW HIGH SCORE!!!", {
                        font: 'italic 20px Arial', color: '#000'}).setOrigin(.5).setScale(0);
                    hstext.x += hstext.width*.5;
                    this.tweens.add({targets: hstext, rotation: 2.028*Math.PI, scale: 1, duration: 500, ease: 'Expo.Out'});
                    highscores[this.curr_lvl] = this.score};
                this.time.delayedCall(500, () => this.tweens.add({
                    targets: [this.lvlbutton, this.menubutton], y: 580, duration: 1000, ease: 'Quint.Out'}));
            };
        });
    }
}

class Menu extends Phaser.Scene {
    constructor() {
        super('menu');
    }

    create() {
        // title
        this.cameras.main.setBackgroundColor('#EFEFEF');
        this.cameras.main.fadeIn(750, 239,239,239);

        let titletext = this.add.text(640, 360, `WEAVE`, {font: `bold 150px Times New Roman`, color: '#000'}).setOrigin(.5);
        let tostart = this.add.text(640, 465, `Click anywhere to start`, {font: `30px Verdana`, color: '#808080'}).setOrigin(.5);

        // buttons and other text
        let choosemode = this.add.text(640, 175, `Choose a mode`, {font: `20px Verdana`, color: '#808080'}).setOrigin(.5).setAlpha(0);
        let hscores = this.add.text(-100, 25, `High scores\nLevel 1: ${highscores[0]}\nLevel 2: ${highscores[1]}\nLevel 3: ${
            highscores[2]}\nArcade Mode: ${highscores[3]}`, {font: `17px Verdana`, color: `#606060`}).setAlpha(0);

        let ezmode = this.add.text(640, 825, `Easy Mode`, {font: `bold 35px Arial`, color: `#000`}).setOrigin(.5).setInteractive()
            .on('pointerover', () => ezmode.setColor(`#808080`))
            .on('pointerout', () => ezmode.setColor(`#000`))
            .on('pointerdown', () => {this.cameras.main.fade(750, 239,239,239);
                this.time.delayedCall(750, () => this.scene.start('level1', {sped: 250, d_scale: 1,
                    score: 0, time_endless: 0, endless: false, first_attempt: true}))});
        let nmode = this.add.text(640, 900, `Normal Mode`, {font: `bold 35px Arial`, color: `#000`}).setOrigin(.5).setInteractive()
            .on('pointerover', () => nmode.setColor(`#808080`))
            .on('pointerout', () => nmode.setColor(`#000`))
            .on('pointerdown', () => {this.cameras.main.fade(750, 239,239,239);
                this.time.delayedCall(750, () => this.scene.start('level1', {sped: 300, d_scale: 2,
                    score: 0, time_endless: 0, endless: false, first_attempt: true}))});
        let hmode = this.add.text(640, 975, `Hard Mode`, {font: `bold 35px Arial`, color: `#000`}).setOrigin(.5).setInteractive()
            .on('pointerover', () => hmode.setColor(`#808080`))
            .on('pointerout', () => hmode.setColor(`#000`))
            .on('pointerdown', () => {this.cameras.main.fade(750, 239,239,239);
                this.time.delayedCall(750, () => this.scene.start('level1', {sped: 360, d_scale: 3,
                    score: 0, time_endless: 0, endless: false, first_attempt: true}))});
        let amode = this.add.text(640, 1050, `Arcade Mode`, {font: `bold 35px Arial`, color: `#000`}).setOrigin(.5).setInteractive()
            .on('pointerover', () => amode.setColor(`#808080`))
            .on('pointerout', () => amode.setColor(`#000`))
            .on('pointerdown', () => {this.cameras.main.fade(750, 239,239,239);
                this.time.delayedCall(750, () => this.scene.start('level1', {sped: 250, d_scale: 1,
                    score: 0, time_endless: 0, endless: true, first_attempt: true}))});

        this.input.on('pointerdown', () => {
            this.input.removeAllListeners();
            this.tweens.add({targets: titletext, scale: 0.75, y: 100, duration: 667, ease: 'Quint.InOut'});
            this.tweens.add({targets: tostart, alpha: 0, duration: 500});
            this.time.delayedCall(375, () => {
                this.tweens.add({targets: [choosemode, hscores], alpha: 1, duration: 500});
                this.tweens.add({targets: ezmode, y: 325, duration: 1000, ease: 'Expo.Out'});
                this.tweens.add({targets: hscores, x: 25, duration: 1000, ease: 'Quad.Out'});
                this.time.delayedCall(75, () => this.tweens.add({targets: nmode, y: 400, duration: 1000, ease: 'Expo.Out'}));
                this.time.delayedCall(150, () => this.tweens.add({targets: hmode, y: 475, duration: 1000, ease: 'Expo.Out'}));
                this.time.delayedCall(225, () => this.tweens.add({targets: amode, y: 550, duration: 1000, ease: 'Expo.Out'}));
            });
        });
    }
}