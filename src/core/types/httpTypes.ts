import HttpRequest from "../core/protocols/http/requests";
import HttpResponse from "../core/protocols/http/response";
import { Methods } from "../core/protocols/http/router";

export interface ProtocolType {
  name: string;
  version: number;
}

export type RouteInformation = Partial<
  Record<Methods, (req: HttpRequest, res: HttpResponse) => void>
>;
