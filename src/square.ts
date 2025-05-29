import app from "./app";
import ISquare from "./squareInterface";

/**
 * @module SquareClassModule
 * Implementation of map or picker square
 */

/**
 * Implementation of map or picker square
 */

class Square implements ISquare {
    /** coordinate x */
    public x: number;
    /** coordinate y */
    public y: number;
    /** stores reference to HTMLElement of Square */
    public el: HTMLCanvasElement;
    /** stores reference to parent HTMLElement
     * @private
     */
    private container: HTMLDivElement;
    /** static property which stores closure used for pasting */
    public pasteCallback: EventListener;

    /**
     * 
     * @param {number} x - coordinate x
     * @param {number} y  - coordinate y
     * @param {HTMLDivElement} container - parent element
     * @todo divide into smaller functions
     * @example
     * const square1 = new Square(1, 5, app.squares2DOM);
     */

    constructor(x: number, y: number, container: HTMLDivElement) {
        this.x = x;
        this.y = y;
        this.container = container;
        this.el = document.createElement("canvas"); // dodanie tla itp
        this.el.classList.add("square");
        this.el.classList.add("unselected");
        //this.el.style.backgroundImage = "url('sprites.png')";
        if (this.container == app.squares1DOM) {
            this.el.style.backgroundPosition = `${-47 * x - x - 2}px ${-47 * y - y - 2}px`;
            this.el.addEventListener("click", () => {
                for (let i = 0; i < app.selected.length; i++) {
                    app.mapSquares[app.selected[i].y][app.selected[i].x].el.style.backgroundPosition = getComputedStyle(this.el).backgroundPosition;
                    //app.mapSquares[app.selected[i]].el.classList.add("unselected");
                    app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.add("unselected");
                    app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.remove("selected");
                    //app.selected++;
                    // app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.add("selected");
                    // app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.remove("unselected");
                }

                if (app.selected.length > 0) {
                    if (app.automat) {
                        const buffer = app.selected[0];
                        buffer.x++;
                        if (buffer.x > 31) {
                            buffer.x = 0;
                            buffer.y++;
                        }
                        app.selected.length = 0;
                        app.selected.push(buffer);
                        app.mapSquares[app.selected[0].y][app.selected[0].x].el.classList.add("selected");
                        app.mapSquares[app.selected[0].y][app.selected[0].x].el.classList.remove("unselected");
                    } else {
                        app.selected.length = 0;
                    }
                }

                app.states.splice(app.statePointer + 1);

                app.states.push([]);

                for (let i = 0; i < app.mapSquares.length; i++) {
                    app.states[app.states.length - 1].push([]);
                    for (let j = 0; j < app.mapSquares[i].length; j++)
                        app.states[app.states.length - 1][app.states[app.states.length - 1].length - 1].push(getComputedStyle(app.mapSquares[i][j].el).backgroundPosition);
                }

                app.statePointer = app.states.length - 1;
            });
        }
        else {
            //if (!app.pasting) {
            this.el.style.backgroundPosition = `94px 382px`;
            this.el.addEventListener("mousedown", (e) => {
                //console.log(e.pageX, e.pageY);
                //console.log(app.squares2DOM?.offsetTop, app.squares2DOM?.offsetLeft);

                if (e.button == 0) {
                    app.pageX1 = e.pageX;
                    app.pageY1 = e.pageY;

                    app.overDiv = document.createElement("div");
                    app.overDiv.id = "overDiv";
                    app.overDiv.style.left = app.pageX1 + "px";
                    app.overDiv.style.top = app.pageY1 + "px";

                    document.body.append(app.overDiv);

                    window.addEventListener("mousemove", app.generateOverDiv);

                    window.addEventListener("mouseup", app.mouseUpEvent);

                    const el = e.target as HTMLCanvasElement;

                    el.classList.remove("unselected");
                    el.classList.add("selected");

                    if (!app.ctrlPressed) {
                        for (let i = 0; i < app.selected.length; i++) {
                            app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.remove("selected");
                            app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.add("unselected");
                        }
                        app.selected = [];
                    }

                    //console.log(this);

                    const index = app.selected.findIndex(el => {
                        return el.x == this.x && el.y == this.y;
                    });

                    console.log(index);

                    if (index == -1 || !app.ctrlPressed) {
                        app.selected.push({
                            x: this.x,
                            y: this.y,
                            bg: getComputedStyle(this.el).backgroundPosition
                        });

                        app.mapSquares[this.y][this.x].el.classList.add("selected");
                        app.mapSquares[this.y][this.x].el.classList.remove("unselected");
                    }
                    else {
                        app.mapSquares[app.selected[index].y][app.selected[index].x].el.classList.remove("selected");
                        app.mapSquares[app.selected[index].y][app.selected[index].x].el.classList.add("unselected");
                        app.selected.splice(index, 1);
                    }

                    app.selected.sort(function (a, b) {
                        if (a.y !== b.y) {
                            return b.y - a.y;
                        }

                        return b.x - a.x;
                    });

                    //console.table(app.selected);
                }
            });
            //}
        }

        this.container.append(this.el);
        //
        if (this.container == app.squares2DOM && this.x == 49) {
            const div = document.createElement("div");
            div.classList.add("break");
            app.squares2DOM.append(div);
        }
        //
        if (this.container == app.squares1DOM && (this.x + 1) % 16 == 0) {
            const div = document.createElement("div");
            div.classList.add("break");
            app.squares1DOM.append(div);
        }
        //
    }
}

export default Square;