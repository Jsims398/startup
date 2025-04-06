const MovieEvent = {
  System: "system",
  Rate: "gameEnd",
  Start: "gameStart",
};

class EventMessage {
  constructor(from, rating, value) {
    this.from = from;
    this.rating = rating;
    this.value = value;
  }
}

class MovieEventNotifier {
  events = [];
  handlers = [];

  constructor() {
    let port = window.location.port;
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";

    this.socket = new WebSocket(
      `${protocol}://${window.location.hostname}:${port}/ws`
    );

    this.socket.onopen = (event) => {
      this.receiveEvent(
        new EventMessage("WTW", MovieEvent.System, { msg: "connected" })
      );
    };
    this.socket.onclose = (event) => {
      this.receiveEvent(
        new EventMessage("WTW", MovieEvent.System, { msg: "disconnected" })
      );
    };
    this.socket.onmessage = async (msg) => {
      try {
        const event = JSON.parse(await msg.data.text());
        this.receiveEvent(event);
      } catch {}
    };
  }

  broadcastEvent(from, rating, value) {
    const event = new EventMessage(from, rating, value);
    this.socket.send(JSON.stringify(event));
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    this.events.push(event);

    this.events.forEach((e) => {
      this.handlers.forEach((handler) => {
        handler(e);
      });
    });
  }
}

const MovieNotifier = new MovieEventNotifier();
export { MovieEvent, MovieNotifier };
