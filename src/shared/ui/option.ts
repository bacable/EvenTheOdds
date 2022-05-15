export class Option
{
    title:string;
    texts:string[];
    selectedIndex:number;

    constructor(title:string, texts:string[])
    {
        this.title = title;
        this.texts = texts;
    }

    next()
    {
        this.selectedIndex = (this.selectedIndex + 1) % this.texts.length;
    }

    prev()
    {
        this.selectedIndex = (this.selectedIndex > 0) ? this.selectedIndex - 1 : this.texts.length - 1;
    }
}