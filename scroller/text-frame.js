"use strict";

const _textFrameContent = Symbol();
const _textFrameOptions = Symbol();
const _textFrameFontStyle = Symbol();

const _defaultOptions = {
    font: "12px Arial",
    style: "black",
    timeout: 0
}

class TextFrame extends Frame {
    constructor(content, options = _defaultOptions) {
        super("canvas", options.timeout || _defaultOptions.timeout)
        this[_textFrameContent] = content;
        this[_textFrameOptions] = options;
    }

    update() {
        const text = this[_textFrameContent];

        const parentBoundingClientRect = this.parent.getBoundingClientRect();

        this.element.width = parentBoundingClientRect.width;
        this.element.height = parentBoundingClientRect.height;

        const context = this.element.getContext("2d");
        context.font = this[_textFrameOptions].font || _defaultOptions.font;
        context.fillStyle = this[_textFrameOptions].style || _defaultOptions.style;
        context.fillText(text, 0, 0);
        
        const textWidth = context.measureText(text).width;
        const textHeight = parseInt(context.font);
        const textVerticalAlignmentPos = (this.element.height + (textHeight / 2)) / 2;

        context.clearRect(0, 0, this.element.width, this.element.height);

        let xpos = -textWidth;

        super.update(() => {
            xpos++;
            context.clearRect(0, 0, this.element.width, this.element.height);
            context.fillText(this[_textFrameContent], xpos, textVerticalAlignmentPos);
            if (xpos > this.element.width) {
                xpos = 0;
                return false;
            }
        });
    }
}
