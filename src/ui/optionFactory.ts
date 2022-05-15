import { OptionType } from '../enums/optionType'
import { Option } from '../shared/ui/option';
import { OptionGroup } from '../shared/ui/optionGroup';

export class OptionFactory
{
    static Build(optionType:OptionType, position:Phaser.Geom.Point):OptionGroup
    {
        let group:OptionGroup = new OptionGroup(position);

        switch(optionType)
        {
            case OptionType.FirstOrSecondPlayer:
                group.add(new Option("", ['Player', 'Computer', 'Random']));
                break;
            case OptionType.EndOfGame:
                group.add(new Option("", ['New Game', 'Main Menu']));
                break;
        }

        return group;
    }

    static OnOffOptions()
    {
        return ['Off', 'On'];
    }

    static NumberRangeOptions(low:number, high:number, skip:number)
    {
        let options:string[] = [];
        for(let i = low; i <= high; i+= skip)
        {
            options.push(i.toString());
        }
        return options;
    }
}