"use strict";

const _mediaFrameUri = Symbol();

class MediaFrameBase extends Frame {
    constructor(elementOrTagName, uri, timeout = 0) {
        super(elementOrTagName, timeout);
        this[_mediaFrameUri] = uri;
        this.setAttribute("style", "width: 100%; height: 100%;"); 
    }

    get uri() {
        return this[_mediaFrameUri];
    }
}