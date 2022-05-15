import { ElementSize } from "../models/elementSize";
import { UIWrapper } from "../uiWrapper";
import { OptionGroup } from "./optionGroup";
import RoundRectangle from 'phaser3-rex-plugins/plugins/roundrectangle.js';
import { Button } from "./button";
import { GameColor } from "../../enums/gameColor";
import { PopupWindowContainer } from "../../interfaces/popupWindowContainer";
import { WindowType } from "../../enums/windowType";

export class ModalWindow
{
    message:string;
    options:OptionGroup;
    size:ElementSize;
    visible:boolean = true;
    fillColor:number;
    strokeColor:number;
    backgroundAlpha:number;
    textColor:string;
    windowType:WindowType;
    container:PopupWindowContainer = null;
    isDestroyed:boolean = false;

    buttons:Button[];

    isPhaserAdded:boolean;
    messageText:Phaser.GameObjects.Text;

    constructor()
    {
        this.backgroundAlpha = 1.0;
        this.buttons = [];
        this.isPhaserAdded = false;
    }

    render(ui:UIWrapper)
    {
        if(this.isDestroyed) {
            return;
        }

        let cx = ui.gameSize.width / 2;
        let cy = ui.gameSize.height / 2;
        let x1 = cx - this.size.width / 2;
        let y1 = cy - this.size.height / 2;
        let x2 = cx + this.size.width / 2;
        let y2 = cy + this.size.height / 2;
        let r = 12;

        if(!this.isPhaserAdded)
        {
            this.messageText = ui.scene.add.text(cx, y1 + 50, this.message, {
                fontSize: '24px',
                color: this.textColor,
                fontFamily: 'Verdana',
                align: 'center'
            }).setOrigin(0.5,0.0);

            let index = 0;
            this.options.options[0].texts.forEach(text => {

                let button = new Button(ui.scene, cx, y1 + 100 + (index * 80), text, GameColor.Text, 
                                        GameColor.ButtonIdle, GameColor.ButtonHover, 300,
                () => {
                    this.container.closeWindow(this.windowType, text);
                });
                this.buttons.push(button);
                index += 1;
            });

            this.isPhaserAdded = true;
        }

        ui.graphics.fillStyle(this.fillColor, this.backgroundAlpha);
        ui.graphics.lineStyle(6, this.strokeColor, 1.0);
        
        ui.graphics.beginPath();

        // starting point
        ui.graphics.moveTo(x1 + r, y1);

        // top line
        ui.graphics.lineTo(x2 - r, y1);

        // top right corner
        ui.graphics.arc(x2 - r, y1 + r, r, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(0), false);

        // right line
        ui.graphics.lineTo(x2, y2 - r);

        // bottom right corner
        ui.graphics.arc(x2 - r, y2 - r, r, Phaser.Math.DegToRad(0), Phaser.Math.DegToRad(90), false);

        // bottom line
        ui.graphics.lineTo(x2 - r, y2);

        // bottom left corner
        ui.graphics.arc(x1 + r, y2 - r, r, Phaser.Math.DegToRad(90), Phaser.Math.DegToRad(180), false);

        // left line
        ui.graphics.lineTo(x1, y1 + r);

        // top left corner
        ui.graphics.arc(x1 + r, y1 + r, r, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(-90), false);

        ui.graphics.closePath();
        ui.graphics.strokePath();
        ui.graphics.fillPath();
    }

    destroy()
    {
        this.buttons.forEach(button => {
            button.destroy();
        });
        this.buttons = [];
        this.messageText.destroy();
        this.messageText = null;
        this.isDestroyed = true;
    }
}