import EventBuilder, { EmittedEvents, GameEvent } from "./EventBuilder";
import Shplub from "./Shplub";

class EventListener {
  private shplub: Shplub;
  private eventBuilder: EventBuilder;

  constructor(shplub: Shplub, eventBuilder: EventBuilder) {
    this.shplub = shplub;
    this.eventBuilder = eventBuilder;
  }

  public tick(emittedEvents: EmittedEvents, tickCount: number) {
    const gameEvent = emittedEvents.gameEvent;
    if (!gameEvent) return;

    switch (gameEvent.type) {
      case "mouseEnterShplub":
        this.onMouseEnterShplub(gameEvent, tickCount);
        break;
      case "mouseLeaveShplub":
        this.onMouseLeaveShplub(gameEvent, tickCount);
        break;
      default:
        throw new Error(`Unexpected gameEvent type ${gameEvent.type}`);
    }
  }

  private onMouseEnterShplub(event: GameEvent, tickCount: number) {
    if (this.shplub.activityState === "idle" || this.shplub.activityState === "looking") {
      this.shplub.activityState = "squishing";
    }
  }

  private onMouseLeaveShplub(event: GameEvent, tickCount: number) {
    if (this.shplub.activityState === "squished" || this.shplub.activityState === "squishing") {
      this.shplub.activityState = "unsquishing";
    }
  }
}

export default EventListener;
