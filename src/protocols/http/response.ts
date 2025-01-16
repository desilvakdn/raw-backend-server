import { Socket } from "net";
import statusCodes from "../../utils/statusCodes";
import statusCodeFromValue from "../../modules/statusFromValue";

class HttpResponse {
  #socket;
  #status = statusCodes.success[200];
  isSent = false;

  constructor();
  constructor(socket?: Socket);

  constructor(socket?: Socket) {
    this.#socket = socket;
  }

  status(code: number) {
    const status = statusCodeFromValue(code);
    console.log(status);
    if (status) {
      this.#status = status;
    }
    return this;
  }

  send(text: string) {
    this.ensureNotSent();
    const response = [];
    response.push(
      `HTTP/1.1 ${this.#status.code} ${this.#status.name}`,
      "Content-Type: text/plain",
      `Content-Length: ${text.length}`,
      "",
      text
    );

    if (this.#socket) {
      this.#socket.write(response.join("\r\n"));
    }

    this.isSent = true;
    return;
  }

  json(obj: Object) {
    this.ensureNotSent();
    const response = [];
    response.push(
      `HTTP/1.1 ${this.#status.code} ${this.#status.name}`,
      "Content-Type: application/json",
      `Content-Length: ${JSON.stringify(obj).length}`,
      "",
      JSON.stringify(obj)
    );

    if (this.#socket) {
      this.#socket.write(response.join("\r\n"));
    }

    this.isSent = true;
    return;
  }

  private ensureNotSent(): void {
    if (this.isSent) {
      throw new Error(
        "You cannot send headers after they have been sent to the client."
      );
    }
  }
}

export default HttpResponse;
