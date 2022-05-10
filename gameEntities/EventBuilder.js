var EventBuilder = /** @class */ (function () {
    function EventBuilder(shplub) {
        var _this = this;
        this.tickCount = -1;
        this.maxMouseEvents = 100;
        this.maxGameEvents = 100;
        this._mouseEvents = [];
        this._gameEvents = [];
        this._mouseIsPressed = false;
        this._mouseIsOverShplub = false;
        this.pressEventHandler = function (event) {
            _this._mouseIsPressed = true;
            _this.pushMouseEvent(event);
        };
        this.moveEventHandler = function (event) {
            _this.pushMouseEvent(event);
        };
        // Mouse up events
        this.releaseEventHandler = function (event) {
            _this._mouseIsPressed = false;
            _this.pushMouseEvent(event);
        };
        // Mouse exits canvas
        this.pressCancelEventHandler = function (event) {
            _this._mouseIsPressed = false;
            _this.pushMouseEvent(event);
        };
        this.shplub = shplub;
    }
    Object.defineProperty(EventBuilder.prototype, "mouseEvents", {
        get: function () {
            return this._mouseEvents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventBuilder.prototype, "gameEvents", {
        get: function () {
            return this._gameEvents;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventBuilder.prototype, "mouseIsPressed", {
        get: function () {
            return this._mouseIsPressed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EventBuilder.prototype, "mouuseIsOverShplub", {
        get: function () {
            return this._mouseIsOverShplub;
        },
        enumerable: false,
        configurable: true
    });
    EventBuilder.prototype.tick = function (tickCount) {
        this.buildGameEvents(this.tickCount); // Build game events from the prev tickCount
        var emittedEvents = {};
        if (this.mouseEvents.length && this.mouseEvents[0].tickCount == this.tickCount) {
            emittedEvents.mouseEvent = this.mouseEvents[0];
        }
        if (this.gameEvents.length && this.gameEvents[0].tickCount == this.tickCount) {
            emittedEvents.gameEvent = this.gameEvents[0];
        }
        this.tickCount = tickCount;
        return emittedEvents;
    };
    EventBuilder.prototype.pushEvent = function (event, eventList, maxSize) {
        eventList.unshift(event);
        if (eventList.length > maxSize) {
            eventList.pop();
        }
    };
    EventBuilder.prototype.pushMouseEvent = function (event) {
        var pos = this.pressPos(event);
        var tickedMouseEvent = {
            type: event.type,
            pos: pos,
            tickCount: this.tickCount,
            mouseIsPressed: this._mouseIsPressed,
            event: event,
        };
        this.pushEvent(tickedMouseEvent, this._mouseEvents, this.maxMouseEvents);
    };
    EventBuilder.prototype.pushGameEvent = function (event) {
        this.pushEvent(event, this._gameEvents, this.maxGameEvents);
    };
    EventBuilder.prototype.pressPos = function (e) {
        var x = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
        var y = e.changedTouches ? e.changedTouches[0].pageY : e.pageY;
        return { x: x, y: y };
    };
    EventBuilder.prototype.buildGameEvents = function (tickCount) {
        if (!this.mouseEvents.length)
            return;
        var lastMouseEvent = this.mouseEvents[0];
        if (tickCount > lastMouseEvent.tickCount)
            return; // No new events since last tick
        this.buildMouseOverShplubEvents(tickCount);
    };
    EventBuilder.prototype.buildMouseOverShplubEvents = function (tickCount) {
        var lastMouseMoveEvent = this.getLastMouseMoveEvent(tickCount);
        if (!lastMouseMoveEvent)
            return;
        if (!this._mouseIsOverShplub && this.isMouseOverShplub(lastMouseMoveEvent)) {
            this._mouseIsOverShplub = true;
            var mouseEnterShplubEvent = {
                type: "mouseEnterShplub",
                tickCount: tickCount,
                mouseEvent: lastMouseMoveEvent,
                prevMouseEvent: this.getPrevMouseMoveEvent(tickCount),
            };
            this.pushGameEvent(mouseEnterShplubEvent);
        }
        else if (this._mouseIsOverShplub && !this.isMouseOverShplub(lastMouseMoveEvent)) {
            this._mouseIsOverShplub = false;
            var mouseLeaveShplubEvent = {
                type: "mouseLeaveShplub",
                tickCount: tickCount,
                mouseEvent: lastMouseMoveEvent,
                prevMouseEvent: this.getPrevMouseMoveEvent(tickCount),
            };
            this.pushGameEvent(mouseLeaveShplubEvent);
        }
    };
    EventBuilder.prototype.isMouseOverShplub = function (event) {
        return this.shplub.isPosInside(event.pos);
    };
    EventBuilder.prototype.getLastMouseMoveEvent = function (tickCount) {
        for (var _i = 0, _a = this.mouseEvents; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            if (tickCount < event_1.tickCount)
                continue;
            if (event_1.type === "mousemove" || event_1.type === "touchmove") {
                return event_1;
            }
        }
        return undefined;
    };
    EventBuilder.prototype.getPrevMouseMoveEvent = function (tickCount) {
        return this.getLastMouseMoveEvent(tickCount - 1);
    };
    return EventBuilder;
}());
export default EventBuilder;
//# sourceMappingURL=EventBuilder.js.map