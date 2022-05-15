export class Button {

    button:Phaser.GameObjects.Text;

    idleColor:string;
    hoverColor:string;

    constructor(scene:Phaser.Scene, x:number, y:number, text:string, fillColor:string, idleColor:string, hoverColor:string, width:number, onClick: Function)
    {
        this.button = scene.add.text(x, y, text, { 
            color: fillColor, 
            backgroundColor: idleColor, 
            fontSize: '52px', 
            fontFamily:'Verdana',
            padding: { left: 5, right: 5, top: 5, bottom: 5 },
            align: 'center',
            fixedWidth:width
        }).setInteractive().setOrigin(0.5,0.0);

        this.idleColor = idleColor;
        this.hoverColor = hoverColor;

        this.button.on('pointerover', () => this.enterHoverState());
        this.button.on('pointerout',() => this.enterIdleState());

        this.button.on('pointerup', () => onClick());
    }

    enterHoverState() {
        this.button.setStyle({ backgroundColor: this.hoverColor });
    }

    enterIdleState() {
        this.button.setStyle({ backgroundColor: this.idleColor });
    }

    destroy() {
        this.button.destroy();
    }
}