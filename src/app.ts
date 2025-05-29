import Square from "./square";
import Position from "./position";
import CanvasList from "./canvasList";
import BgPos from "./bgPos";
import dialogBtns from "./dialogBtns";

const app = {
    body: document.body as HTMLBodyElement,
    overDiv: null as unknown as HTMLDivElement,
    pasteDiv: null as unknown as HTMLDivElement,
    dialogElement: null as unknown as HTMLDialogElement,
    squares1DOM: document.getElementById("squares1") as HTMLDivElement,
    squares2DOM: document.getElementById("squares2") as HTMLDivElement,
    automatDOM: document.getElementById("automat") as HTMLInputElement,
    fileInput: document.getElementById("fileSelect") as HTMLInputElement,
    squares: [] as Square[][],
    mapSquares: [] as Square[][],
    selected: [] as BgPos[],
    copied: [] as BgPos[],
    copyPositionDifferences: [] as Position[],
    pasteElements: [] as CanvasList,
    states: [] as string[][][],
    redoArray: [] as Square[][],
    clickListeners: [] as Function[],
    ctrlPressed: false as boolean,
    pasting: false as boolean,
    automat: false as boolean,
    maxX: 0 as number,
    maxY: 0 as number,
    pageX1: 0 as number,
    pageY1: 0 as number,
    pageX2: 0 as number,
    pageY2: 0 as number,
    maxCopiedX: 0 as number,
    minCopiedX: 0 as number,
    maxCopiedY: 0 as number,
    minCopiedY: 0 as number,
    statePointer: 0 as number,
    redoPointer: 0 as number,
    dialogX: 0 as number,
    dialogY: 0 as number,
    //maxSquare: null as unknown
    dialogButtons: {
        undo: {
            text: "Undo", key: "Z", callback: function (e: MouseEvent) {
                if (app.states.length > 1) {
                    if (app.statePointer - 1 >= 0) {
                        app.statePointer--;

                        console.log("error:", app.statePointer + 1);

                        for (let i = 0; i < app.mapSquares.length; i++) {
                            for (let j = 0; j < app.mapSquares[i].length; j++) {
                                app.mapSquares[i][j].el.style.backgroundPosition = app.states[app.statePointer][i][j];
                            }
                        }

                        console.log("statePtr:", app.statePointer)
                    }
                }
                app.dialogElement.close();
            }
        },
        redo: {
            text: "Redo", key: "Y", callback: function (e: MouseEvent) {
                console.log("Redo");
                if (app.statePointer + 1 < app.states.length) {
                    app.statePointer++;
                    for (let i = 0; i < app.mapSquares.length; i++) {
                        for (let j = 0; j < app.mapSquares[i].length; j++) {
                            app.mapSquares[i][j].el.style.backgroundPosition = app.states[app.statePointer][i][j];
                        }
                    }

                    console.log("statePtr:", app.statePointer)
                }

                app.dialogElement.close();
            }
        },
        cut: {
            text: "Cut", key: "X", callback: (e: MouseEvent) => {
                if (!app.pasting) {
                    app.dialogButtons.copy.callback();
                    app.dialogButtons.delete.callback(e, 1);
                } else {
                    alert("Nie możesz wycinać podczas wklejania");
                }
            }
        },
        copy: {
            text: "Copy", key: "C", callback: function (e: MouseEvent) {
                if (!app.pasting) {
                    if (app.selected.length > 0) {
                        app.copyPositionDifferences = [];
                        app.copied = [...app.selected];
                        console.log(app.copied);

                        for (let i = 0; i < app.selected.length; i++) {
                            app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.add("unselected");
                            app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.remove("selected");
                        }

                        app.selected = [];

                        app.maxCopiedX = app.copied[0].x;
                        app.maxCopiedY = app.copied[0].y;
                        app.minCopiedX = app.copied[0].x;
                        app.minCopiedY = app.copied[0].y;

                        for (let i = 1; i < app.copied.length; i++) {
                            // debugger
                            if (app.copied[i].x > app.maxCopiedX)
                                app.maxCopiedX = app.copied[i].x;

                            if (app.copied[i].x < app.minCopiedX)
                                app.minCopiedX = app.copied[i].x;

                            if (app.copied[i].y > app.maxCopiedY)
                                app.maxCopiedY = app.copied[i].y;

                            if (app.copied[i].y < app.minCopiedY)
                                app.minCopiedY = app.copied[i].y;
                        }

                        app.copied.sort(function (a, b) {
                            if (a.y !== b.y) {
                                // debugger
                                return a.y - b.y;
                            }

                            return a.x - b.x;
                        });

                        for (let i = 0; i < app.copied.length; i++) {
                            app.copyPositionDifferences.push({
                                x: app.copied[i].x - app.minCopiedX,
                                y: app.copied[i].y - app.minCopiedY,
                            });
                        }

                        app.dialogElement.close();
                    } else {
                        alert("Nie zaznaczono żadnego elementu");
                    }
                } else {
                    alert("Nie możesz kopiować podczas wklejania!");
                }
            }
        },
        paste: {
            text: "Paste", key: "V", callback: function (e: MouseEvent) {
                if (!app.pasting) {
                    app.pasting = true;
                    for (let i = 0; i < app.copyPositionDifferences.length; i++) {
                        const canvas = document.createElement("canvas");

                        canvas.classList.add("paste");
                        canvas.classList.add("square");

                        canvas.style.backgroundPosition = app.copied[i].bg;
                        canvas.style.left = ((app.dialogX) + 47 * app.copyPositionDifferences[i].x + 6 * app.copyPositionDifferences[i].x) + "px";
                        canvas.style.top = ((app.dialogY) + 47 * app.copyPositionDifferences[i].y + 6 * app.copyPositionDifferences[i].y) + "px";

                        app.pasteElements.push(canvas);
                        document.body.append(canvas);
                    }

                    for (let i = 0; i < app.mapSquares.length; i++) {
                        for (let j = 0; j < app.mapSquares[i].length; j++) {
                            app.mapSquares[i][j].el.addEventListener("mouseover", app.mouseOverEvent);

                            /**
                             * 
                             * @param i 
                             * @param j 
                             * @returns callback which is used during pasting
                             */

                            function createEventListener(i: number, j: number) {
                                return function () {
                                    console.log("wklejanie click");
                                    //debugger;
                                    for (let k = 0; k < app.copyPositionDifferences.length; k++) {
                                        if (
                                            (i + app.copyPositionDifferences[k].y < app.mapSquares.length)
                                            &&
                                            (j + app.copyPositionDifferences[k].x < app.mapSquares[i + app.copyPositionDifferences[k].y].length)
                                        ) {
                                            app.mapSquares[i + app.copyPositionDifferences[k].y][j + app.copyPositionDifferences[k].x].el.style.backgroundPosition = app.copied[k].bg;
                                        }

                                        app.pasteElements[k].remove();
                                    }

                                    app.pasteElements = [];

                                    for (let n = 0; n < app.mapSquares.length; n++) {
                                        for (let m = 0; m < app.mapSquares[n].length; m++) {
                                            app.mapSquares[n][m].el.removeEventListener("mouseover", app.mouseOverEvent);
                                            app.mapSquares[n][m].el.removeEventListener("click", app.mapSquares[n][m].pasteCallback);
                                        }
                                    }

                                    for (let p = 0; p < app.selected.length; p++) {
                                        app.mapSquares[app.selected[p].y][app.selected[p].x].el.classList.remove("selected");
                                        app.mapSquares[app.selected[p].y][app.selected[p].x].el.classList.add("unselected");
                                    }

                                    app.selected = [];

                                    app.pasting = false;

                                    app.states.push([]);

                                    for (let i = 0; i < app.mapSquares.length; i++) {
                                        app.states[app.states.length - 1].push([]);
                                        for (let j = 0; j < app.mapSquares[i].length; j++)
                                            app.states[app.states.length - 1][app.states[app.states.length - 1].length - 1].push(getComputedStyle(app.mapSquares[i][j].el).backgroundPosition);
                                    }

                                    app.statePointer = app.states.length - 1;
                                };
                            }

                            const listenerCallback = createEventListener(i, j);

                            app.mapSquares[i][j].pasteCallback = listenerCallback;

                            app.mapSquares[i][j].el.addEventListener("click", listenerCallback);
                        }
                    }

                    app.dialogElement.close();
                } else {
                    alert("Już coś wklejasz!");
                }
            }
        },
        delete: {
            text: "Delete", key: "DEL", callback: function (e: MouseEvent, mode: number = 0) {
                if (app.selected.length > 0) {
                    for (let i = 0; i < app.selected.length; i++) {
                        app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.remove("selected");
                        app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.add("unselected");
                        app.mapSquares[app.selected[i].y][app.selected[i].x].el.style.backgroundPosition = `94px 382px`;
                    }
                } else if (app.selected.length <= 0 && mode == 1) {
                    for (let i = 0; i < app.copied.length; i++) {
                        app.mapSquares[app.copied[i].y][app.copied[i].x].el.classList.remove("selected");
                        app.mapSquares[app.copied[i].y][app.copied[i].x].el.classList.add("unselected");
                        app.mapSquares[app.copied[i].y][app.copied[i].x].el.style.backgroundPosition = `94px 382px`;
                    }
                } else {
                    console.log("ee");
                }

                app.selected = [];

                app.states.splice(app.statePointer + 1);

                app.states.push([]);

                for (let i = 0; i < app.mapSquares.length; i++) {
                    app.states[app.states.length - 1].push([]);
                    for (let j = 0; j < app.mapSquares[i].length; j++)
                        app.states[app.states.length - 1][app.states[app.states.length - 1].length - 1].push(getComputedStyle(app.mapSquares[i][j].el).backgroundPosition);
                }

                app.statePointer = app.states.length - 1;
            }
        },
        save: {
            text: "Save to file", key: "S", callback: function (e: MouseEvent) {
                const data: string[][] = [];

                for (let i = 0; i < app.mapSquares.length; i++) {
                    data.push([]);
                    for (let j = 0; j < app.mapSquares[i].length; j++) {
                        data[i].push(getComputedStyle(app.mapSquares[i][j].el).backgroundPosition);
                    }
                }

                const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
                console.log(blob);

                const url = URL.createObjectURL(blob);
                console.log(url);

                const link = document.createElement("a");
                link.innerText = "Save to file";
                link.href = url;
                link.download = "data.json";

                link.click();

                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 0);

                app.ctrlPressed = false;
            }
        },
        load: {
            text: "Load data from file", key: "L", callback: function (e: MouseEvent) {
                document.getElementById("fileSelect")?.click();
                app.ctrlPressed = false;
            }
        },
        close: {
            text: "Close", key: "", callback: function (e: MouseEvent) {
                app.dialogElement.close();
            }
        }
    } as dialogBtns,

    /**
     * Initializes app
     * @returns void, it intializes application
     */

    init(): void {
        app.automat = app.automatDOM.checked;

        const a = [{ a: 1, b: 2 }];
        const b = [{ a: 1, b: 2 }];

        a.push(...b);

        console.log(a);
        // config.json mozna zrobic do przyciskow
        window.addEventListener("keydown", (e) => {
            if (e.key == "Control" || e.key == "Meta")
                this.ctrlPressed = true;
        });

        window.addEventListener("keyup", (e) => {
            if (e.key == "Control" || e.key == "Meta")
                this.ctrlPressed = false;
        });

        window.addEventListener("keydown", (e) => {
            if (e.key == "Delete")
                app.dialogButtons.delete.callback();
        });

        app.fileInput.addEventListener("change", (e) => {
            app.load(e.target as HTMLInputElement);
        });

        app.automatDOM.addEventListener("change", () => {
            app.automat = app.automatDOM.checked;
        });

        app.squares2DOM?.addEventListener("contextmenu", (e) => {
            e.preventDefault();

            const el = e.target as HTMLCanvasElement;

            app.dialogX = el.offsetLeft - 3;
            app.dialogY = el.offsetTop - 3;

            app.dialogElement.showModal();
        });

        for (let i = 0; i < 20; i++) {
            this.squares.push([]);
            for (let j = 0; j < 16; j++) {
                this.squares[i].push(
                    new Square(j, i, this.squares1DOM)
                );
            }
        }

        for (let i = 0; i < 20; i++) {
            this.squares.push([]);
            for (let j = 16; j < 32; j++) {
                //debugger
                this.squares[i].push(
                    new Square(j, i, this.squares1DOM)
                );
            }
        }

        for (let i = 0; i < 32; i++) {
            this.mapSquares.push([]);
            for (let j = 0; j < 50; j++) {
                //debugger // j < 32
                this.mapSquares[i].push(
                    new Square(j, i, this.squares2DOM)
                );
            }
        }

        app.states.push([]);

        for (let i = 0; i < app.mapSquares.length; i++) {
            app.states[app.states.length - 1].push([]);
            for (let j = 0; j < app.mapSquares[i].length; j++)
                app.states[app.states.length - 1][app.states[app.states.length - 1].length - 1].push(getComputedStyle(app.mapSquares[i][j].el).backgroundPosition);
        }

        app.statePointer = app.states.length - 1;

        app.dialogElement = document.createElement("dialog");
        const dialogDiv = document.createElement("div");
        dialogDiv.id = "dialogDiv";
        const div = document.createElement("div");
        div.style.width = "200px";
        div.style.height = "200px";

        for (const button in app.dialogButtons) {
            const dialogButton = document.createElement("div");
            dialogButton.classList.add("option");
            dialogButton.innerText = app.dialogButtons[button].text;
            dialogButton.addEventListener("click", app.dialogButtons[button].callback as EventListener);
            window.addEventListener("keydown", (e) => {
                e.preventDefault();
                if (app.ctrlPressed && e.key == app.dialogButtons[button].key.toLowerCase())
                    app.dialogButtons[button].callback();
            });

            div.append(dialogButton);
        }

        dialogDiv.append(div);

        app.dialogElement.append(dialogDiv);

        document.body.append(app.dialogElement);
    },

    /**
     * Function generating div visualizing marked squares
     * @param {MouseEvent} e1 
     * @returns void, it operates on DOM
     */

    generateOverDiv(e1: MouseEvent): void {
        const width = Math.abs(e1.pageX - app.pageX1);
        const height = Math.abs(e1.pageY - app.pageY1);

        app.overDiv.style.width = width + "px";
        app.overDiv.style.height = height + "px";

        let lowerX: number;
        let lowerY: number;

        if (e1.pageX > app.pageX1) {
            app.overDiv.style.left = app.pageX1 + "px";
            lowerX = app.pageX1;
        } else {
            app.overDiv.style.left = e1.pageX + "px";
            lowerX = e1.pageX;
        }

        if (e1.pageY > app.pageY1) {
            app.overDiv.style.top = app.pageY1 + "px";
            lowerY = app.pageY1;
        } else {
            app.overDiv.style.top = e1.pageY + "px";
            lowerY = e1.pageY;
        }

        const selectedTemp: BgPos[] = [];

        for (let i = 0; i < app.mapSquares.length; i++) {
            for (let j = 0; j < app.mapSquares[i].length; j++) {
                const canvasDOM = app.mapSquares[i][j].el;
                const x2 = canvasDOM.offsetLeft;
                const y2 = canvasDOM.offsetTop;

                canvasDOM.classList.remove("selected");
                canvasDOM.classList.add("unselected");

                if (
                    (lowerX < x2 && Math.abs(lowerX - x2) <= app.overDiv.clientWidth)
                    &&
                    (lowerY < y2 && Math.abs(lowerY - y2) <= app.overDiv.clientHeight)
                ) {

                    canvasDOM.classList.remove("unselected");
                    canvasDOM.classList.add("selected");

                    selectedTemp.push({
                        x: j,
                        y: i,
                        bg: getComputedStyle(canvasDOM).backgroundPosition
                    });

                }
                else if (
                    (x2 < lowerX && Math.abs(lowerX - x2) <= canvasDOM.clientWidth)
                    &&
                    (lowerY < y2 && Math.abs(lowerY - y2) <= app.overDiv.clientHeight)
                ) {

                    canvasDOM.classList.remove("unselected");
                    canvasDOM.classList.add("selected");

                    selectedTemp.push({
                        x: j,
                        y: i,
                        bg: getComputedStyle(canvasDOM).backgroundPosition
                    });

                } else if (
                    (lowerX < x2 && Math.abs(lowerX - x2) <= app.overDiv.clientWidth)
                    &&
                    (y2 < lowerY && Math.abs(lowerY - y2) <= canvasDOM.clientHeight)
                ) {

                    canvasDOM.classList.remove("unselected");
                    canvasDOM.classList.add("selected");

                    selectedTemp.push({
                        x: j,
                        y: i,
                        bg: getComputedStyle(canvasDOM).backgroundPosition
                    });

                } else if (
                    (x2 < lowerX && Math.abs(lowerX - x2) <= canvasDOM.clientWidth)
                    &&
                    (y2 < lowerY && Math.abs(lowerY - y2) <= canvasDOM.clientHeight)
                ) {

                    canvasDOM.classList.remove("unselected");
                    canvasDOM.classList.add("selected");

                    selectedTemp.push({
                        x: j,
                        y: i,
                        bg: getComputedStyle(canvasDOM).backgroundPosition
                    });

                }
            }
        }

        if (app.ctrlPressed) {
            for (let i = 0; i < app.selected.length; i++) {
                for (let j = 0; j < selectedTemp.length; j++) {
                    if (
                        app.selected[i].x == selectedTemp[j].x
                        &&
                        app.selected[i].y == selectedTemp[j].y
                    ) {
                        selectedTemp.splice(j, 1);
                        break;
                    }
                }
            }

            app.selected.push(...selectedTemp)
        }
        else {
            app.selected = [...selectedTemp];
        }

        for (let i = 0; i < app.selected.length; i++) {
            app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.remove("unselected");
            app.mapSquares[app.selected[i].y][app.selected[i].x].el.classList.add("selected");
        }

        app.selected.sort(function (a, b) {
            if (a.y !== b.y) {
                return b.y - a.y;
            }

            return b.x - a.x;
        });
    },

    /**
     * Function handling click mouseUp Event
     * @returns void, it handles mouseUp Event
     */

    mouseUpEvent() {
        window.removeEventListener("mousemove", app.generateOverDiv);
        window.removeEventListener("mouseup", app.mouseUpEvent);

        app.overDiv.remove();
    },

    /**
     * Function which handles map file loading
     * @param {HTMLInputElement} files - File input HTML element 
     */

    load: function (files: HTMLInputElement): void {
        console.log("load z app");
        const file = files.files[0];

        const reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function () {
            const res: string = reader.result as string;
            const response = JSON.parse(res);

            for (let i = 0; i < app.mapSquares.length; i++) {
                for (let j = 0; j < app.mapSquares[i].length; j++) {
                    app.mapSquares[i][j].el.style.backgroundPosition = response[i][j];
                }
            }

            app.states.splice(1, app.states.length - 1);
            app.statePointer = 0;

            app.states.push([]);

            for (let i = 0; i < app.mapSquares.length; i++) {
                app.states[app.states.length - 1].push([]);
                for (let j = 0; j < app.mapSquares[i].length; j++)
                    app.states[app.states.length - 1][app.states[app.states.length - 1].length - 1].push(getComputedStyle(app.mapSquares[i][j].el).backgroundPosition);
            }

            app.statePointer = app.states.length - 1;

            console.log(app.states);
            console.log(app.statePointer);
        };

    },

    /**
     * Function handling mouseOver event
     * @param {Event} e - event object
     * @returns void, because it handles event
     */

    mouseOverEvent: function (e: Event): void {
        if (e.target != app.squares2DOM) {
            const el = e.target as HTMLCanvasElement;

            app.dialogX = el.offsetLeft;
            app.dialogY = el.offsetTop;

            for (let i = 0; i < app.pasteElements.length; i++) {
                if (i == 0) {
                    app.pasteElements[i].style.left = ((app.dialogX - 3) + 47 * app.copyPositionDifferences[i].x + 6 * app.copyPositionDifferences[i].x) + "px";
                    app.pasteElements[i].style.top = ((app.dialogY - 3) + 47 * app.copyPositionDifferences[i].y + 6 * app.copyPositionDifferences[i].y) + "px";
                } else {
                    app.pasteElements[i].style.left = ((app.dialogX - 3) + 47 * app.copyPositionDifferences[i].x + 6 * app.copyPositionDifferences[i].x) + "px";
                    app.pasteElements[i].style.top = ((app.dialogY - 3) + 47 * app.copyPositionDifferences[i].y + 6 * app.copyPositionDifferences[i].y) + "px";
                }
            }
        }
    },
}

export default app;