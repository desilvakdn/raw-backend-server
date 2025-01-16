import { Method } from "./methodTypes";

interface RequestType {
  method: Method;
  route: string;
  protocol: {
    name: string;
    version: number;
  };
  headers: Map<string, string>;
  contentLength?: number;
  body?: string;
}

export default RequestType;
