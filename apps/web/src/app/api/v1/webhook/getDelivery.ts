import { getRequestContext } from '@/lib/context';
import { Delivery } from '@/rewards/types';

/**
 * The delivery details of the webhook currently being processed.
 */
export const getDelivery = (id: string): Delivery => {
  const context = getRequestContext();

  return {
    id,
    signature: context?.signature ?? '',
    hookId: context?.hookId ?? '',
  };
};
