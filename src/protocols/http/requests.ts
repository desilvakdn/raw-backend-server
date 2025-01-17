import { Socket } from "node:net";
import { Method } from "../../types/methodTypes";
import HttpResponse from "./response";
import statusCodes from "../../utils/statusCodes";
import { ProtocolType } from "../../types/httpTypes";
import parseValue from "../../modules/valueParser";

class Request {
  method?: Method;
  route?: string;
  protocol?: ProtocolType;
  headers: Map<string, string> = new Map();
  contentLength?: number;
  body?: string;
  params = new Map<string, any>();

  constructor(
    method?: Method,
    route?: string,
    protocol?: ProtocolType,
    headers?: Map<string, string>,
    contentLength?: number,
    body?: string
  ) {
    this.method = method;
    this.route = route;
    this.protocol = protocol;
    this.headers = headers || new Map();
    this.contentLength = contentLength;
    this.body = body;
  }
}

export default class HttpRequest extends Request {
  #response;

  constructor();
  constructor(data?: string, socket?: Socket);

  constructor(data?: string, socket?: Socket) {
    super();
    if (data && socket) {
      this.#processRequestString(data);
      this.#response = new HttpResponse(socket);
    }
  }

  #processRequestString(requestString: string) {
    if (!requestString || !requestString?.trim())
      return this.#handleBadRequest();
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

    this.method = requestLine[0] as Method;

    const [base, params] = requestLine[1]?.split("?") || [];
    this.route = base;
    if (params) {
      this.params = params.split("&").reduce((map, curr) => {
        const [key, value] = curr.split("=");
        return map.set(
          key,
          value ? parseValue(decodeURIComponent(value)) : value
        );
      }, new Map<string, any>());
    }

    const protocolString = requestLine[2].split("/").map((e) => e.trim());
    if (protocolString.length < 2 || isNaN(parseFloat(protocolString[1])))
      return this.#handleBadRequest();
    this.protocol = {
      name: protocolString[0],
      version: parseFloat(protocolString[1]),
    };
    try {
      headerRowsList.slice(1).forEach((singleRow) => {
        const [key, value] = singleRow.split(":");
        this.headers.set(key.trim(), value.trim());
      });
    } catch (error) {
      return this.#handleBadRequest();
    }

    const methodsNotAllowedBody = new Set<Method>(["GET", "DELETE"]);
    if (1 < seperatedString.length && !methodsNotAllowedBody.has(this.method)) {
      this.body = seperatedString[1];
    }

    if (!this.headers.has("Content-Length") && this.body)
      return this.#handleBadRequest();

    this.contentLength = Number(this.headers.get("Content-Length"));
  }

  #handleBadRequest() {
    if (this.#response) {
      this.#response
        .status(statusCodes.clientError[400].code)
        .send("Bad Request - Invalid syntax");
    }
    return null;
  }
}
