import { WindowType } from "../enums/windowType";
import { OptionFactory } from "./optionFactory";
import { OptionType } from "../enums/optionType";
import { ModalWindow } from "../shared/ui/modalWindow";
import { ElementSize } from "../shared/models/elementSize";
import { PopupWindowContainer } from "../interfaces/popupWindowContainer";

export class WindowFactory
{
    static Build(windowType:WindowType, container:PopupWindowContainer)
    {
        let window = new ModalWindow();
        window.fillColor = 0xaac9fa;
        window.strokeColor = 0x455d80;
        window.textColor = '#ffffff';
        window.container = container;
        window.windowType = windowType;

        switch(windowType)
        {
            case WindowType.FirstOrSecondPlayer:
                window.message = "Who should go first?";
                window.options = OptionFactory.Build(OptionType.FirstOrSecondPlayer, new Phaser.Geom.Point(50, 100));
                window.size = new ElementSize(400, 380);
                window.backgroundAlpha = 0.95;
                break;
            case WindowType.Winner:
                window.message = "Winner of the game is:";
                window.options = OptionFactory.Build(OptionType.EndOfGame, new Phaser.Geom.Point(50, 100));
                window.size = new ElementSize(400, 300);
                console.log("built winner window");
                break;
        }
        return window;
    }
}