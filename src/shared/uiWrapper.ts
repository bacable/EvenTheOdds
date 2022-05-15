export class UIWrapper
{
    graphics:Phaser.GameObjects.Graphics;
    scene:Phaser.Scene;

    get gameSize():Phaser.Structs.Size {
        return this.scene.sys.game.scale.gameSize;
    }

    constructor(graphics:Phaser.GameObjects.Graphics, scene:Phaser.Scene)
    {
        this.graphics = graphics;
        this.scene = scene;
    }


}