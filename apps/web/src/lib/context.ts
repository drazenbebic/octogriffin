import { AsyncLocalStorage } from 'node:async_hooks';

interface RequestContext {
  eventName: string;
  hookId: string;
  requestId: string;
  signature: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export const getRequestContext = () => {
  return requestContext.getStore();
};
