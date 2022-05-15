import 'phaser';
import { CircleField } from '../models/circleField';
import { Scores } from '../gameobjects/scores';
import { Board } from '../gameobjects/board';
import { ModalWindow } from '../shared/ui/modalWindow';
import { WindowFactory } from '../ui/windowFactory';
import { WindowType } from '../enums/windowType';
import { UIWrapper } from '../shared/uiWrapper';
import { PopupWindowContainer } from '../interfaces/popupWindowContainer'


export class MainGame extends Phaser.Scene implements PopupWindowContainer
{
    board:Board;
    scores:Scores;
    graphics:Phaser.GameObjects.Graphics;
    numberOfPlayers:number;
    isEndgame:boolean;
    windows:ModalWindow[] = [];

    constructor ()
    {
        super('MainGame');
    }

    closeWindow(windowType: WindowType, selection: string): void {
        console.log("closing window");

        if(windowType == WindowType.FirstOrSecondPlayer)
        {
            switch(selection)
            {
                case "Player":
                    this.board.currentPlayer = 0;
                    break;
                case "Computer":
                    this.board.currentPlayer = 1;
                    break;
                case "Random":
                    this.board.currentPlayer = Phaser.Math.Between(0, 1);
                    break;
                default:
                    break;
            }

            this.windows[0].destroy();

            this.redraw();

            this.windows.splice(0);

            if(this.board.currentPlayer == 1) {
                let timerCall = this.time.delayedCall(1500, () => { this.aiTurn(); }, null, this);
            }

        }
        else if(windowType == WindowType.Winner)
        {
            switch(selection)
            {
                case "New Game":
                    this.windows[0].destroy();
                    this.windows.splice(0);
                    this.create();
                    break;
                case "Main Menu":
                    console.log("Main Menu selected");
                    this.windows[0].destroy();
                    this.windows.splice(0);
                    this.scene.start("MainMenu");
                    break;
            }
        }
    }

    init(data):void
    {
        console.log('init', data);
        this.numberOfPlayers = data.numberOfPlayers;
    }

    preload ()
    {
    }

    create ()
    {
        this.graphics = this.add.graphics({ fillStyle: { color: 0xf2f4f7 } });
        this.scores = new Scores(this.graphics, this);
        this.board = new Board(this.graphics, this, this.scores);
        this.windows = [];
        this.isEndgame = false;

        if(this.numberOfPlayers == 1)
        {
            let firstOrSecondWindow = WindowFactory.Build(WindowType.FirstOrSecondPlayer, this);
            this.windows.push(firstOrSecondWindow);                
        }

        this.redraw();

        this.input.on('pointerup', function(pointer) {
            let point = new Phaser.Geom.Point(pointer.x, pointer.y);
            console.log(this.scene.isEndgame);

            if(this.scene.windows.length == 0)
            {
                if(!this.scene.isEndgame && (this.board.currentPlayer != 1 || this.scene.numberOfPlayers == 2))
                {
                    if(this.board.handleTouch(point))
                    {
                        this.scene.redraw();
                        this.scene.checkForEndgame();  
                        if(!this.scene.isEndgame && this.board.currentPlayer == 1 && this.scene.numberOfPlayers == 1) {
                            let timerCall = this.scene.time.delayedCall(1500, () => { this.scene.aiTurn(); }, null, this);
                            console.log(timerCall);
                        }              
                    }
                }
            }

        }, { board: this.board, scene: this });
    }

    reset()
    {
        this.windows = [];
        this.scores.reset();
        this.board.reset();

        if(this.numberOfPlayers == 1)
        {
            let firstOrSecondWindow = WindowFactory.Build(WindowType.FirstOrSecondPlayer, this);
            this.windows.push(firstOrSecondWindow);                
        }

        this.redraw();
    }

    aiTurn()
    {
        this.board.testAI();
        this.redraw();
        this.checkForEndgame();  
    }

    checkForEndgame()
    {
        let message = "";
        this.isEndgame = this.board.checkForEndgame();
        //this.isEndgame = true;
        if(this.isEndgame) {
            let winners = this.scores.getWinners();
            if(winners.length > 1) {
                message = "The game ends in a draw.";
            } else {
                let winnerText = (winners[0] == 0) ? "Player 1" : 
                    (this.numberOfPlayers == 1) ? "Computer" : "Player 2";
                message = winnerText + " wins the game!";
            }
            let window = WindowFactory.Build(WindowType.Winner, this);
            window.message = message; 
            this.windows.push(window);
            this.redraw();
        }
    }

    redraw()
    {
        this.graphics.clear();
        this.board.draw();
        this.scores.draw();

        let ui = new UIWrapper(this.graphics, this);

        if(this.windows.length > 0)
        {
            this.windows[0].render(ui);
        }
    }
}

