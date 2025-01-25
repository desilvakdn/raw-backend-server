import net from "node:net";
import HttpResponse from "./protocols/http/response";
import HttpRequest from "./protocols/http/requests";
import statusCodes from "./utils/statusCodes";
import { Router } from "./protocols/http/router";

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
        if (httpRequest.method !== undefined) {
          if (httpRequest.route) {
            let endPoint = null;

            if (this.routes.has(httpRequest.route)) {
              endPoint = this.routes.get(httpRequest.route);
            } else {
              for (let [key, values] of this.routes) {
                const regexPattern = new RegExp(
                  "^" +
                    key
                      .replace(/:([^/]+)/g, "(?<$1>[^/]+)")
                      .replace(/\//g, "\\/") +
                    "$"
                );

                const match = httpRequest.route.match(regexPattern);
                if (match) {
                  endPoint = values;
                  const groups = match.groups;
                  if (groups) {
                    httpRequest.paths = new Map(Object.entries(groups));
                  }

                  break;
                }
              }
            }

            const handler = endPoint?.[httpRequest.method];
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
