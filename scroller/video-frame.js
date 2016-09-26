"use strict";

const _videoFrameDurationChangeHandler = Symbol();
const _videoFrameErrorHandler = Symbol();

class VideoFrame extends MediaFrameBase {
    constructor(uri, timeout = 0) {
        super("video", uri, timeout);

        this.setAttribute("preload", "metadata");
        this.setAttribute("type", "video/mp4");
        this.setAttribute("muted", "true");

        this[_videoFrameDurationChangeHandler] = () => {
            if(this.element.readyState) {
                this.element.removeEventListener("canplaythrough", this[_videoFrameDurationChangeHandler], false);

                console.log(`Playing '${this.uri}'.`);
                this.element.play();
            }
        };

        this[_videoFrameErrorHandler] = (e) => {
            switch (e.target.error.code) {
            case e.target.error.MEDIA_ERR_ABORTED:
                console.log("You aborted the video playback.");
                break;
            case e.target.error.MEDIA_ERR_NETWORK:
                console.log("A network error caused the video download to fail part-way.");
                break;
            case e.target.error.MEDIA_ERR_DECODE:
                console.log("The video playback was aborted due to a corruption problem or because the video used features your browser did not support.");
                break;
            case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                console.log("The video could not be loaded, either because the server or network failed or because the format is not supported.");
                break;
            default:
                console.log("An unknown error occurred.");
                break;
            }

            this.complete();
        };

        const onCompleteHandler = () => {
            console.log(`The video '${this.uri}' was ended.`);
            this.complete();
        };

        this.element.addEventListener("ended", onCompleteHandler, false);
        this.element.addEventListener("pause", onCompleteHandler, false);
        this.element.addEventListener("stalled", onCompleteHandler, false);

        this.element.addEventListener("suspend", () => {
            console.log(`The video '${this.uri}' was suspend.`);
        }, false);
    }

    hide() {
        this.element.removeEventListener("error", this[_videoFrameErrorHandler], false);
        this.element.removeEventListener("canplaythrough", this[_videoFrameDurationChangeHandler], false);

        this.element.pause();

        this.element.currentTime = 0;

        this.element.setAttribute("src", "");

        this.element.load();
        
        super.hide();
    }

    update() {
        this.element.setAttribute("src", this.uri);

        this.element.removeEventListener("error", this[_videoFrameErrorHandler], false);
        this.element.addEventListener("error", this[_videoFrameErrorHandler], false);

        this.element.removeEventListener("canplaythrough", this[_videoFrameDurationChangeHandler], false);
        this.element.addEventListener("canplaythrough", this[_videoFrameDurationChangeHandler], false);

        this.element.load();
    }
}
