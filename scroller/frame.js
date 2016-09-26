"use strict";

const _frameElement = Symbol();
const _frameElementStyle = Symbol();
const _frameParent = Symbol();
const _frameCompleted = Symbol();
const _frameTimeout = Symbol();

class Frame {
    constructor(elementOrTagName, timeout = 0) {
        if (typeof(elementOrTagName) === "string") {
            this[_frameElement] = document.createElement(elementOrTagName);
        }
        else {
            this[_frameElement] = elementOrTagName;
        }

        this[_frameElementStyle] = this[_frameElement].style;
        this[_frameTimeout] = timeout * 1000;
    }

    get isCompleted() {
        return this[_frameCompleted];
    }

    get element() {
        return this[_frameElement];
    }

    get timeout() {
        return this[_frameTimeout];
    }

    get parent() {
        if (this[_frameParent] != null) {
            return this[_frameParent];
        } 
        else {
            throw Error(`The element ${this.element} has no parent.`);
        }
    }

    get hasChildren() {
        return this.element.children.length !== 0;
    }

    get hasParent() {
        return this[_frameParent] != null;
    }

    get style() {
        return this[_frameElementStyle];
    }

    attachTo(frame) {
        this[_frameCompleted] = false;
        frame.element.appendChild(this.element);
        this[_frameParent] = frame
    }

    detach() {
        this[_frameCompleted] = false;
        if (this.hasParent && this.parent.element.contains(this.element)) {
            this.parent.element.removeChild(this.element);
            this[_frameParent] = null;
        }
    }

    getBoundingClientRect() {
        return this.element.getBoundingClientRect();
    }

    hide() {
        this.element.style.display = "none";
    }
    
    setAttribute(attribute, value) {
        this.element.setAttribute(attribute, value);
    }

    getAttribute(attribute) {
        return this.element.getAttribute(attribute);
    }

    show() {
        this.element.style.display = "initial";
        this.element.style.position = "absolute";
        this.element.style.top = 0;
        this.element.style.left = 0;
    }

    update(callback, duration = 0) {
        if (!callback) return;
        
        this[_frameCompleted] = false;

        let handle = null;
        let elapsed = null;
        let request = true;
        
        const onupdate = (timestamp) => {
            if (!elapsed) elapsed = timestamp;
           
            let interval = timestamp - elapsed;

            if (interval >= duration) {
                request = callback(interval);
                elapsed = null;
            }

            if (request !== false) {
                handle = window.requestAnimationFrame(onupdate);
            }
            else {
                console.log(`The frame [${this.constructor.name}] ended.`);
                this.complete();
                window.cancelAnimationFrame(handle);
            }
        }

        onupdate();
    }

    complete() {
        this[_frameCompleted] = true;
    }
}