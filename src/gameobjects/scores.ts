import { TokenColor } from '../enums/tokenColor';

export class Scores
{
    NUMBER_OF_PLAYERS:number = 2;
    NUMBER_OF_COLORS:number = 6;

    graphics:Phaser.GameObjects.Graphics;
    scene:Phaser.Scene;
    scores:number[][];
    playerScores:number[];

    scoreText:Phaser.GameObjects.Text[];

    colors:number[] = [TokenColor.Red, TokenColor.Orange, TokenColor.Yellow, TokenColor.Green, TokenColor.Blue, TokenColor.Purple];

    constructor(graphics:Phaser.GameObjects.Graphics, scene:Phaser.Scene) {
        this.graphics = graphics;
        this.scene = scene;
        this.scores = [[0,0,0,0,0,0],[0,0,0,0,0,0]];
        this.playerScores = [];
        this.scoreText = [];

        for(let i = 0; i < this.NUMBER_OF_PLAYERS; i++)
        {
            let gameSize = scene.sys.game.scale.gameSize;
            let textX = (i % 2 == 0) ? 50 : gameSize.width - 112;

            this.playerScores.push(this.NUMBER_OF_COLORS);
            this.scoreText.push(scene.add.text(textX, gameSize.height - 258, this.NUMBER_OF_COLORS.toString(), { 
                fontFamily: 'Verdana', 
                fontSize: '96px', 
                color: '#fff', 
                align: 'center'
            }));
        }

    }

    update(items:number[],playerIndex:number)
    {
        items.forEach(item => {
            this.scores[playerIndex][item]+=1;
        });

        this.updatePlayerScores();
    }

    updatePlayerScores()
    {
        this.playerScores = [];

        for(let i = 0; i < this.NUMBER_OF_PLAYERS; i++)
        {
            this.playerScores.push(0);

            this.scores[i].forEach(score => {
                if(score % 2 == 0) {
                    this.playerScores[i] += 1;
                }
            })    
        }
    }

    drawScoreBanner(isLeft:boolean, color:number)
    {
        let x1 = (isLeft) ? 0 : 1024;
        let x2 = (isLeft) ? 220 : 804;
        let x3 = (isLeft) ? 150 : 874;
        let y1 = 450;
        let y2 = 550;

        var points:any[] = [ x1, y1, x2, y1, x3, y2, x1, y2];
        var bannerPolygon = new Phaser.Geom.Polygon(points);

        this.graphics.fillStyle(color);
        this.graphics.fillPoints(bannerPolygon.points, true);
    }

    drawSemiCircle(x:number, y:number, color:number, radius:number, isLeft:boolean)
    {
        let offx = (isLeft) ? -1 : 1;
        let arcBegin = (isLeft) ? 270 : 90;
        let arcEnd = (isLeft) ? 90 : 270;

        this.graphics.fillStyle(color);
        this.graphics.beginPath();
        this.graphics.moveTo(x + offx, y);
        this.graphics.arc(x + offx, y, radius, Phaser.Math.DegToRad(arcBegin), Phaser.Math.DegToRad(arcEnd), true);
        this.graphics.closePath();
        this.graphics.fillPath();
    }

    reset()
    {
        this.scores = [[0,0,0,0,0,0],[0,0,0,0,0,0]];
        this.playerScores = [];
        this.scoreText = [];
    }
    
    draw()
    {

        let i=0;
        let radius = 23;
        let offsetX = 46;
        let circleWidth = 54;
    
        for(let playerIndex = 0; playerIndex < this.scores.length; playerIndex++)
        {
            let isLeft = (playerIndex % 2 == 0);
            let ypos = 121;

            for(let scoreIndex = 0;scoreIndex<this.scores[playerIndex].length; scoreIndex++)
            {
                let xpos = (isLeft) ? offsetX : this.scene.game.scale.gameSize.width - offsetX;

                for(i=0;i<this.scores[playerIndex][scoreIndex];i+=2)
                {
                    this.drawSemiCircle(xpos,ypos,this.colors[scoreIndex], radius, isLeft);
        
                    if(this.scores[playerIndex][scoreIndex] > (i + 1)) {
                        this.drawSemiCircle(xpos,ypos,this.colors[scoreIndex], radius, !isLeft);
                    }
        
                    xpos = (isLeft) ? xpos + circleWidth : xpos - circleWidth;
                }

                ypos+= 54;
            }
        }

        this.drawScoreBanner(true, 0x455d80);
        this.drawScoreBanner(false, 0x455d80);

        this.drawPlayerScores();
        
    }

    getWinners():number[]
    {
        var highestScore = -1;
        var highestScoringPlayers:number[] = [];

        for(let i=0; i<this.NUMBER_OF_PLAYERS; i++)
        {
            let score = this.playerScores[i];
            if(score > highestScore) {
                highestScore = score;
                highestScoringPlayers = [i];                
            }
            else if(score == highestScore) {
                highestScoringPlayers.push(i);
            }
        }

        return highestScoringPlayers;
    }

    drawPlayerScores()
    {
        for(let i=0; i< this.NUMBER_OF_PLAYERS; i++)
        {
            this.scoreText[i].text = this.playerScores[i].toString();
        }
    }
}