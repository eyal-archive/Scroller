"use strict";

const _scrollerIndex = Symbol();
const _scrollerFrames = Symbol();

class Scroller extends Frame {
    constructor() {
        super("div");
        this[_scrollerIndex] = 0;
        this[_scrollerFrames] = [];
        this.setAttribute("style", "width: 100%; height: 100%; position: relative; overflow: hidden;"); 
    }

    get index() {
        return this[_scrollerIndex];
    }

    set index(value) {
        this[_scrollerIndex] = value;
    }

    addFrame(frame) {
        this[_scrollerFrames].push(frame);
    }

    attachTo(element) {
        if (!this.hasChildren) {
            super.attachTo(new Frame(element));
        }
        else {
            throw new Error("The scroller must be attached to an empty DOM element.");
        }
    }

    start() {
        console.log(`Starting '${this.parent.getAttribute("id")}'.`);

        let frames = this[_scrollerFrames];
        let time = 0;

        if (frames.length > 0) {
            this.update((interval) => {
                time += interval; 

                if (this.index >= frames.length) {
                    this.index = 0;
                    console.log(`Restarting '${this.parent.getAttribute("id")}'.`);
                }

                let frame = frames[this.index];

                if (!frame.isCompleted && !this.hasChildren) {
                    console.log(`Starting frame [${frame.constructor.name}] on '${this.parent.getAttribute("id")}' at index ${this.index} at time ${time}.`);
                    frame.attachTo(this);
                    frame.show();
                    frame.update();
                }
                else if (frame.isCompleted || frame.timeout > 0 && time >= frame.timeout) {
                    console.log(`Ending frame [${frame.constructor.name}] on '${this.parent.getAttribute("id")}' at index ${this.index} at time ${time}.`);
                    frame.hide();
                    frame.detach();
                    time = 0;
                    this.index++
                }
            }, 500);
        }
    }
}