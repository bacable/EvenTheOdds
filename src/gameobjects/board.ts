import { TokenColor } from '../enums/tokenColor';
import { AIBoard } from '../models/aiBoard';
import { AIBoardNode } from '../models/aiBoardNode';
import { AI } from '../shared/minimax';
import { CircleField } from '../models/circleField';
import { Random } from '../shared/random';
import { PlayerBanner } from './playerBanner';
import { Scores } from './scores';

export class Board
{
    NUMBER_OF_PLAYERS:number = 2;

    fields:CircleField[] = [];

    colors:number[] = [TokenColor.Red, TokenColor.Orange, TokenColor.Yellow, TokenColor.Green, TokenColor.Blue, TokenColor.Purple];

    colorIndexes = {
        '16073300': 0,
        '14706951': 1,
        '16117295': 2,
        '3779905': 3,
        '1585092': 4,
        '11355308': 5
    };

    graphics:Phaser.GameObjects.Graphics;

    scores:Scores;

    tokens:number[] = [];

    playerBanners:PlayerBanner[] = [];

    currentPlayer:number;

    constructor(graphics:Phaser.GameObjects.Graphics, scene: Phaser.Scene, scores:Scores)
    {
        this.graphics = graphics;
        this.scores = scores;

        this.reset();

        for(var i = 0; i < this.NUMBER_OF_PLAYERS; i++)
        {
            this.playerBanners.push(new PlayerBanner(i, graphics, scene));
        }
    }

    reset()
    {
        this.tokens = [];
        this.fields.forEach(field => {
            field = null
        });

        this.colors.forEach(color => {
            for(var count=0; count < 7; count++)
            {
                this.tokens.push(color);
            }
        });

        Random.shuffle(this.tokens);

        var startX = 504;
        var startY = 98;
        var fieldRadius = 50;
        var offsetXPerRow = 58;
        var offsetYPerRow = 100;
        var gapX = 120;

        for(var row=0;row<6;row++)
        {
            for(var col=0; col<=row; col++)
            {

                var circle = new Phaser.Geom.Circle(startX - row * offsetXPerRow + col * gapX, startY + offsetYPerRow * row, fieldRadius);

                var field:CircleField = {
                    graphic: circle,
                    isTaken: false,
                    leftColor: this.tokens.pop(),
                    rightColor: this.tokens.pop()
                };
                this.fields.push(field);
            }
        }
    }

    draw()
    {
        // Draw all the white circles first
        this.fields.forEach(field => {
            this.graphics.fillStyle(0xf2f4f7);
            this.graphics.fillCircleShape(field.graphic);    
        });

        // Draw the tokens on the fields that haven't been claimed yet
        this.fields.forEach(field => {

            let deg270 = Phaser.Math.DegToRad(270);
            let deg90 = Phaser.Math.DegToRad(90);
    
            if(!field.isTaken) {
                this.graphics.fillStyle(field.leftColor);
                this.graphics.beginPath();
                this.graphics.moveTo(field.graphic.x - 2, field.graphic.y);
                this.graphics.arc(field.graphic.x - 2, field.graphic.y, field.graphic.radius - 8, deg270, deg90, true);
                this.graphics.closePath();
                this.graphics.fillPath();
        
                this.graphics.fillStyle(field.rightColor);
                this.graphics.beginPath();
                this.graphics.moveTo(field.graphic.x + 2, field.graphic.y);
                this.graphics.arc(field.graphic.x + 2, field.graphic.y, field.graphic.radius - 8, deg90, deg270, true);
                this.graphics.closePath();
                this.graphics.fillPath();
            }
        });

        this.playerBanners[this.currentPlayer].draw();
    }

    handleTouch(point:Phaser.Geom.Point):boolean
    {
        let tookItem:boolean = false;

        for(let i = 0; i<this.fields.length; i++)
        {
            let field = this.fields[i];

            if(field.graphic.contains(point.x, point.y))
            {
                if(!field.isTaken)
                {
                    this.takeField(field, this.currentPlayer);
                    tookItem = true;
                    this.currentPlayer = (this.currentPlayer + 1) % this.NUMBER_OF_PLAYERS;
                }
                break;
            }
        }

        return tookItem;
    }

    getBoardForAI(): AIBoard
    {
        let aiBoard = new AIBoard();
        aiBoard.nodes = [];
        
        let index = 0;
        this.fields.forEach(field => {
            if(!field.isTaken) {
                let leftColorIndex = this.colorIndexes[field.leftColor.toString()];
                let rightColorIndex = this.colorIndexes[field.rightColor.toString()];
    
                let node:AIBoardNode = { left: leftColorIndex, right:rightColorIndex, id: index};
                aiBoard.nodes.push(node);
            }
            index++;
        });

        aiBoard.humanScores = this.scores.scores[0].slice();
        aiBoard.aiScores = this.scores.scores[1].slice();

        return aiBoard;
    }

    takeField(field:CircleField, playerIndex:number)
    {
        let leftColorIndex = this.colorIndexes[field.leftColor.toString()];
        let rightColorIndex = this.colorIndexes[field.rightColor.toString()];

        field.isTaken = true;
        var taken:number[] = [leftColorIndex, rightColorIndex];
        this.scores.update(taken, playerIndex);
    }

    testAI()
    {
        let boardState = this.getBoardForAI();
        let bestField = AI.Minimax(0, true, 3, boardState);
        this.takeField(this.fields[bestField], this.currentPlayer);
        this.currentPlayer = (this.currentPlayer + 1) % this.NUMBER_OF_PLAYERS;
        //console.log("Best result: " + bestField);
    }

    checkForEndgame():boolean
    {
        let isEndgame = true;
        this.fields.forEach(field => {
            if(!field.isTaken) {
                isEndgame = false;
            }
        });
        return isEndgame;
    }

}