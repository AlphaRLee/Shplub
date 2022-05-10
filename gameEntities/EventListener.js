var EventListener = /** @class */ (function () {
    function EventListener(shplub, eventBuilder) {
        this.shplub = shplub;
        this.eventBuilder = eventBuilder;
    }
    EventListener.prototype.tick = function (emittedEvents, tickCount) {
        var gameEvent = emittedEvents.gameEvent;
        if (!gameEvent)
            return;
        switch (gameEvent.type) {
            case "mouseEnterShplub":
                this.onMouseEnterShplub(gameEvent, tickCount);
                break;
            case "mouseLeaveShplub":
                this.onMouseLeaveShplub(gameEvent, tickCount);
                break;
            default:
                throw new Error("Unexpected gameEvent type ".concat(gameEvent.type));
        }
    };
    EventListener.prototype.onMouseEnterShplub = function (event, tickCount) {
        if (this.shplub.activityState === "idle" || this.shplub.activityState === "looking") {
            this.shplub.activityState = "squishing";
        }
    };
    EventListener.prototype.onMouseLeaveShplub = function (event, tickCount) {
        if (this.shplub.activityState === "squished" || this.shplub.activityState === "squishing") {
            this.shplub.activityState = "unsquishing";
        }
    };
    return EventListener;
}());
export default EventListener;
//# sourceMappingURL=EventListener.js.map