export class PlayerBanner
{
    graphics:Phaser.GameObjects.Graphics;

    playerNames:Phaser.GameObjects.Text;

    isLeft:boolean;

    constructor(index:number, graphics:Phaser.GameObjects.Graphics, scene:Phaser.Scene)
    {
        this.isLeft = (index % 2 == 0);
        this.graphics = graphics;

        let gameSize = scene.sys.game.scale.gameSize;
        let textX = (this.isLeft) ? 25 : gameSize.width - 25;
        let textAlign = (this.isLeft) ? 'left' : 'right';
        let originX = (this.isLeft) ? 0 : 1;

        let playerText = (this.isLeft) ? 'Player 1' : 'Player 2';

        this.playerNames = scene.add.text(textX, 50, playerText, { 
            fontFamily: 'Verdana', 
            fontSize: '36px', 
            fontWeight: 'bold',
            color: '#fff', 
            align: 'right',
            boundsAlignH: 'center',
            boundsAlignV: 'top'
        });
        this.playerNames.setOrigin(originX, 0.5);
    }

    drawPlayerBanner(isLeft:boolean, color:number)
    {
        let x1 = (isLeft) ? 0 : 1024;
        let x2 = (isLeft) ? 470 : 544;
        let x3 = (isLeft) ? 428 : 586;
        let y1 = 23;
        let y2 = 78;

        var points:any[] = [ x1, y1, x2, y1, x3, y2, x1, y2];
        var bannerPolygon = new Phaser.Geom.Polygon(points);

        this.graphics.fillStyle(color);
        this.graphics.fillPoints(bannerPolygon.points, true);
    }

    draw()
    {
        this.drawPlayerBanner(this.isLeft, 0x455d80);
    }
}