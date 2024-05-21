/* eslint-disable @typescript-eslint/no-explicit-any */
export function isTouchEvent(event) {
    return (event instanceof TouchEvent ||
        event instanceof window.TouchEvent ||
        event?.touches && event?.touches.length ||
        event?.changedTouches && event?.changedTouches.length);
}
export function isOnlyOneTouch(event) {
    return isTouchEvent(event) && ((event.touches && event.touches.length === 1) || (event.changedTouches && event.changedTouches.length === 1));
}
export function getPosition(event) {
    if (event.touches && event.touches.length) {
        return {
            x: event.touches[0].pageX,
            y: event.touches[0].pageY,
        };
    }
    else if (event.changedTouches && event.changedTouches.length) {
        return {
            x: event.changedTouches[0].pageX,
            y: event.changedTouches[0].pageY,
        };
    }
    else {
        return {
            x: event.pageX,
            y: event.pageY,
        };
    }
}
