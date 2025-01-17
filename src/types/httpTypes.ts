import HttpRequest from "../protocols/http/requests";
import HttpResponse from "../protocols/http/response";
import { Methods } from "../protocols/http/router";

export interface ProtocolType {
  name: string;
  version: number;
}

export type RouteInformation = Partial<
  Record<Methods, (req: HttpRequest, res: HttpResponse) => void>
>;
