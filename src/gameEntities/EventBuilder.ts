import Shplub from "./Shplub";
import Position from "./Position";

interface TickedEvent {
  tickCount: number;
}

export interface TickedMouseEvent extends TickedEvent {
  type: string;
  pos: Position;
  mouseIsPressed: boolean;
  event: MouseEvent | TouchEvent;
}

export interface GameEvent extends TickedEvent {
  type: "mouseEnterShplub" | "mouseLeaveShplub";
}

export interface MouseEnterShplubEvent extends GameEvent {
  tickCount: number;
  mouseEvent: TickedMouseEvent; // mousemove event
  prevMouseEvent: TickedMouseEvent; // Previous mousemove event
}

export interface MouseLeaveShplubEvent extends GameEvent {
  tickCount: number;
  mouseEvent: TickedMouseEvent; // mousemove event
  prevMouseEvent: TickedMouseEvent; // Previous mousemove event
}

export interface EmittedEvents {
  mouseEvent?: TickedMouseEvent;
  gameEvent?: GameEvent;
}

class EventBuilder {
  private tickCount = -1;
  private shplub: Shplub;
  private maxMouseEvents = 100;
  private maxGameEvents = 100;
  private _mouseEvents: TickedMouseEvent[] = [];
  private _gameEvents: GameEvent[] = [];

  private _mouseIsPressed = false;
  private _mouseIsOverShplub = false;

  constructor(shplub: Shplub) {
    this.shplub = shplub;
  }

  get mouseEvents() {
    return this._mouseEvents;
  }

  get gameEvents() {
    return this._gameEvents;
  }

  get mouseIsPressed() {
    return this._mouseIsPressed;
  }

  get mouuseIsOverShplub() {
    return this._mouseIsOverShplub;
  }

  public tick(tickCount: number) {
    this.buildGameEvents(this.tickCount); // Build game events from the prev tickCount

    const emittedEvents: EmittedEvents = {};
    if (this.mouseEvents.length && this.mouseEvents[0].tickCount == this.tickCount) {
      emittedEvents.mouseEvent = this.mouseEvents[0];
    }
    if (this.gameEvents.length && this.gameEvents[0].tickCount == this.tickCount) {
      emittedEvents.gameEvent = this.gameEvents[0];
    }

    this.tickCount = tickCount;

    return emittedEvents;
  }

  private pushEvent<T extends TickedEvent>(event: T, eventList: T[], maxSize: number) {
    eventList.unshift(event);
    if (eventList.length > maxSize) {
      eventList.pop();
    }
  }

  private pushMouseEvent(event: MouseEvent | TouchEvent) {
    const pos = this.pressPos(event);
    const tickedMouseEvent: TickedMouseEvent = {
      type: event.type,
      pos,
      tickCount: this.tickCount,
      mouseIsPressed: this._mouseIsPressed,
      event,
    };

    this.pushEvent(tickedMouseEvent, this._mouseEvents, this.maxMouseEvents);
  }

  private pushGameEvent(event: GameEvent) {
    this.pushEvent(event, this._gameEvents, this.maxGameEvents);
  }

  private pressPos(e: MouseEvent | TouchEvent): Position {
    const x = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].pageX : (e as MouseEvent).pageX;
    const y = (e as TouchEvent).changedTouches ? (e as TouchEvent).changedTouches[0].pageY : (e as MouseEvent).pageY;
    return { x, y };
  }

  public pressEventHandler = (event: MouseEvent | TouchEvent) => {
    this._mouseIsPressed = true;
    this.pushMouseEvent(event);
  };

  public moveEventHandler = (event: MouseEvent | TouchEvent) => {
    this.pushMouseEvent(event);
  };

  // Mouse up events
  public releaseEventHandler = (event: MouseEvent) => {
    this._mouseIsPressed = false;
    this.pushMouseEvent(event);
  };

  // Mouse exits canvas
  public pressCancelEventHandler = (event: MouseEvent) => {
    this._mouseIsPressed = false;
    this.pushMouseEvent(event);
  };

  private buildGameEvents(tickCount: number) {
    if (!this.mouseEvents.length) return;

    const lastMouseEvent = this.mouseEvents[0];
    if (tickCount > lastMouseEvent.tickCount) return; // No new events since last tick

    this.buildMouseOverShplubEvents(tickCount);
  }

  private buildMouseOverShplubEvents(tickCount: number) {
    const lastMouseMoveEvent = this.getLastMouseMoveEvent(tickCount);
    if (!lastMouseMoveEvent) return;

    if (!this._mouseIsOverShplub && this.isMouseOverShplub(lastMouseMoveEvent)) {
      this._mouseIsOverShplub = true;

      const mouseEnterShplubEvent: MouseEnterShplubEvent = {
        type: "mouseEnterShplub",
        tickCount,
        mouseEvent: lastMouseMoveEvent,
        prevMouseEvent: this.getPrevMouseMoveEvent(tickCount),
      };
      this.pushGameEvent(mouseEnterShplubEvent);
    } else if (this._mouseIsOverShplub && !this.isMouseOverShplub(lastMouseMoveEvent)) {
      this._mouseIsOverShplub = false;

      const mouseLeaveShplubEvent: MouseLeaveShplubEvent = {
        type: "mouseLeaveShplub",
        tickCount,
        mouseEvent: lastMouseMoveEvent,
        prevMouseEvent: this.getPrevMouseMoveEvent(tickCount),
      };
      this.pushGameEvent(mouseLeaveShplubEvent);
    }
  }

  private isMouseOverShplub(event: TickedMouseEvent): boolean {
    return this.shplub.isPosInside(event.pos);
  }

  private getLastMouseMoveEvent(tickCount: number) {
    for (const event of this.mouseEvents) {
      if (tickCount < event.tickCount) continue;
      if (event.type === "mousemove" || event.type === "touchmove") {
        return event;
      }
    }

    return undefined;
  }

  private getPrevMouseMoveEvent(tickCount: number) {
    return this.getLastMouseMoveEvent(tickCount - 1);
  }
}

export default EventBuilder;
