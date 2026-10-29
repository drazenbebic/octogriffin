import { getRequestContext } from '@/lib/context';
import type { Delivery } from '@/rewards/types';

/**
 * The delivery details of the webhook currently being processed.
 */
export const getDelivery = (id: string): Delivery => {
  const context = getRequestContext();

  return {
    hookId: context?.hookId ?? '',
    id,
    signature: context?.signature ?? '',
  };
};
