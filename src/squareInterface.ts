interface ISquare {
    x: number;
    /** coordinate y */
    y: number;
    /** stores reference to HTMLElement of Square */
    el: HTMLCanvasElement;
    /** stores reference to parent HTMLElement */
    //container: HTMLElement;
    /** static property which stores closure used for pasting */
    pasteCallback: EventListener;
}

export default ISquare;