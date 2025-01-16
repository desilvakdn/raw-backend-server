import net from "node:net";
import HttpResponse from "../protocols/http/response";
import HttpRequest from "../protocols/http/requests";
import statusCodes from "../utils/statusCodes";
import RequestType from "../types/requestType";
import { Router } from "../protocols/http/router";

class HttpServer extends Router {
  server;

  constructor() {
    super();
    this.server = net.createServer((socket) => {
      console.log("Client is connected !");

      socket.on("data", (data) => {
        const message = data.toString();
        const httpRequest = new HttpRequest(message, socket);
        const httpResponse = new HttpResponse(socket);
        if (httpRequest.request !== null) {
          const request: RequestType = httpRequest.request;

          if (this.routes.has(request.route)) {
            const endPoint = this.routes.get(request.route);
            const handler = endPoint?.[request.method];
            if (handler) {
              handler(httpRequest, httpResponse);
            } else {
              httpResponse.status(statusCodes.clientError[405].code).send("");
            }
          } else {
            httpResponse.status(statusCodes.clientError[405].code).send("");
          }
        }
      });

      socket.on("end", () => {
        console.log("Client disconnected");
      });

      socket.on("error", (err) => {
        socket.end();
        console.log("Error occured : ", err);
      });
    });
  }
}

export default HttpServer;
