"use strict";

class ImageFrame extends MediaFrameBase {
    constructor(uri, timeout = 0) {
        super("img", uri, timeout);
        this.setAttribute("src", uri);
    }
}