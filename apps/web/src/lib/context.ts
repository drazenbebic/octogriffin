import { AsyncLocalStorage } from 'node:async_hooks';

interface RequestContext {
  eventName: string;
  hookId: string;
  requestId: string;
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export const getRequestContext = () => {
  return requestContext.getStore();
};
