import { Socket } from "node:net";
import { Method } from "../../types/methodTypes";
import RequestType from "../../types/requestType";
import HttpResponse from "./response";
import statusCodes from "../../utils/statusCodes";

export default class HttpRequest {
  request: RequestType | null;
  #response;

  constructor();
  constructor(data?: string, socket?: Socket);

  constructor(data?: string, socket?: Socket) {
    if (data && socket) {
      const request = this.#processRequestString(data);
      this.request = request;
      this.#response = new HttpResponse(socket);
    } else {
      this.request = null;
    }
  }

  #processRequestString(requestString: string) {
    if (!requestString || !requestString?.trim())
      return this.#handleBadRequest();
    let request: RequestType = {
      method: "GET",
      route: "",
      protocol: {
        name: "",
        version: -1,
      },
      headers: new Map(),
    };
    const seperatedString = requestString
      .split("\r\n\r\n")
      .map((e) => e.trim());

    const headerRowsList = seperatedString[0]
      .split("\r\n")
      .map((e) => e.trim());
    if (headerRowsList.length === 0) return this.#handleBadRequest();
    const requestLine = headerRowsList[0].split(" ");
    if (requestLine.length < 3) return this.#handleBadRequest();
    const validMethods = new Set<Method>([
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
      "HEAD",
      "TRACE",
      "CONNECT",
    ]);
    if (!validMethods.has(requestLine[0] as Method))
      return this.#handleBadRequest();

    request.method = requestLine[0] as Method;
    request.route = requestLine[1];
    const protocolString = requestLine[2].split("/").map((e) => e.trim());
    if (protocolString.length < 2 || isNaN(parseFloat(protocolString[1])))
      return this.#handleBadRequest();
    request.protocol.name = protocolString[0];
    request.protocol.version = parseFloat(protocolString[1]);
    try {
      headerRowsList.slice(1).forEach((singleRow) => {
        const [key, value] = singleRow.split(":");
        request.headers.set(key.trim(), value.trim());
      });
    } catch (error) {
      return this.#handleBadRequest();
    }

    const methodsNotAllowedBody = new Set<Method>(["GET", "DELETE"]);
    if (
      1 < seperatedString.length &&
      !methodsNotAllowedBody.has(request.method)
    ) {
      request.body = seperatedString[1];
    }

    if (!request.headers.has("Content-Length") && request.body)
      return this.#handleBadRequest();

    request.contentLength = Number(request.headers.get("Content-Length"));

    return request;
  }

  #handleBadRequest() {
    if (this.#response) {
      this.#response
        .status(statusCodes.clientError[400].code)
        .send("Bad Request - Invalid syntax");
    }
    return null;
  }

  // #processHeaders(headersString: string) {
  //   const headerRowsList = headersString.split("\r\n").map((e) => e.trim());
  //   let headerMap = new Map();
  //   headerRowsList.forEach((row:string)=>{
  //     headerMap.
  //   })
  // }
}
