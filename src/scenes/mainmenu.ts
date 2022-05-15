import 'phaser';
import { Button } from '../shared/ui/button';
import { GameColor } from '../enums/gameColor';

import { MainGame } from './maingame';

export default class MainMenu extends Phaser.Scene
{
    playButton1P:Button;
    playButton2P:Button;

    howToPlay:Phaser.GameObjects.Text;

    constructor()
    {
        super('MainMenu');
    }

    preload()
    {

    }

    create()
    {
        let gameSize = this.sys.game.scale.gameSize;
        this.add.text(gameSize.width / 2, 50, "EVEN THE ODDS", {
            fontSize: '96px',
            fontFamily: 'Verdana',
            align: 'center'
        }).setOrigin(0.5,0.0);

        var howToPlay = this.add.text(gameSize.width / 2, 250, "How to Play: Take turns selecting one of the circles and taking\nthe two colored half-circles within. Once all circles are empty,\nscore 1 point for each color in which you have an even number \n(0 is Even also). Whoever has the most points wins!", {
            fontSize: '24px',
            fontFamily: 'Verdana',
            align: 'left'
        }).setOrigin(0.5, 0.0);

        howToPlay.displayWidth = 750;


        this.playButton1P = new Button(this, gameSize.width / 4, 550, "1 PLAYER", GameColor.Text, GameColor.ButtonIdle, GameColor.ButtonHover, 350, () => { this.startGame(1); });

        this.playButton2P = new Button(this, gameSize.width * 0.75, 550, "2 PLAYER", GameColor.Text, GameColor.ButtonIdle, GameColor.ButtonHover, 350, () => { this.startGame(2); });

    }

    startGame(numPlayers:number)
    {
        this.scene.start("MainGame", { numberOfPlayers: numPlayers });
    }
}


const config = {
    type: Phaser.AUTO,
    backgroundColor: '#aac9fa',
    scale: {
        mode: Phaser.Scale.FIT ,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    width: 1024,
    height: 700,
    scene: [MainMenu, MainGame]
};

const game = new Phaser.Game(config);