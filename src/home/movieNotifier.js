export class MovieEvent {
  static Rating = "rating";
  static System = "system";
  static Start = "start";
  static End = "end";

  constructor(from, type, value) {
    this.from = from;
    this.type = type;
    this.value = value;
    this.timestamp = new Date();
  }
}

class EventMessage {
  constructor(from, rating, value) {
    this.from = from;
    this.rating = rating;
    this.value = value;
    this.timestamp = new Date().toISOString();
  }
}

class MovieEventNotifier {
  events = [];
  handlers = [];

  constructor() {
    let port = window.location.port;
    const protocol = window.location.protocol === "http:" ? "ws" : "wss";

    // console.log(
    //   `Connecting to WebSocket at ${protocol}://${window.location.hostname}:${port}/ws`
    // );

    this.socket = new WebSocket(
      `${protocol}://${window.location.hostname}:${port}/ws`
    );

    this.socket.onopen = (event) => {
      // console.log("WebSocket connected");
      this.receiveEvent(
        new EventMessage("System", MovieEvent.System, {
          msg: "connected to server",
        })
      );
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket disconnected");
      this.receiveEvent(
        new EventMessage("System", MovieEvent.System, {
          msg: "Disconnected from server",
        })
      );
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.receiveEvent(
        new EventMessage("System", MovieEvent.System, {
          msg: "Error in connection",
        })
      );
    };

    this.socket.onmessage = async (msg) => {
      try {
        console.log("Received WebSocket message:", msg.data);
        const event = JSON.parse(msg.data);
        console.log("Parsed event:", event);
        this.receiveEvent(event);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };
  }

  broadcastEvent(from, rating, value) {
    const event = new EventMessage(from, rating, value);
    console.log("Broadcasting event:", event);

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(event));
    } 
    else {
      console.warn("WebSocket not connected, can't send message");
      this.receiveEvent(event);
    }
  }

  addHandler(handler) {
    console.log("Adding event handler");
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    console.log("Removing event handler");
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    console.log("Processing received event:", event);
    this.events.push(event);

    this.handlers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error("Error in event handler:", error);
      }
    });
  }
}

const MovieNotifier = new MovieEventNotifier();
export { MovieNotifier };
