import { Option } from './option'

export class OptionGroup
{
    options:Option[] = [];
    selectedIndex:number = 0;
    position:Phaser.Geom.Point;

    constructor(position:Phaser.Geom.Point)
    {
        this.position = position;
    }

    add(option:Option)
    {
        this.options.push(option);
    }

    next()
    {
        this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
    }

    prev()
    {
        this.selectedIndex = (this.selectedIndex > 0) ? this.selectedIndex - 1 : this.options.length - 1;
    }
}