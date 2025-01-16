import HttpRequest from "./requests";
import HttpResponse from "./response";

export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
  TRACE = "TRACE",
  CONNECT = "CONNECT",
}

type RouteInformation = Partial<
  Record<Methods, (req: HttpRequest, res: HttpResponse) => void>
>;

export class Router {
  routes: Map<string, RouteInformation> = new Map();

  constructor() {}

  get(path: string, callback: (req: HttpRequest, res: HttpResponse) => void) {
    this.routes.set(path, {
      ...(this.routes.get(path) || {}),
      GET: callback,
    });
  }

  post(path: string, callback: (req: HttpRequest, res: HttpResponse) => void) {
    this.routes.set(path, {
      ...(this.routes.get(path) || {}),
      POST: callback,
    });
  }
}
