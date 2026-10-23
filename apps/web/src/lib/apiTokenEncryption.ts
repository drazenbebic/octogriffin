import { encrypt, isEncrypted } from '@/lib/crypto';

type WriteArgs = { create?: unknown; data?: unknown; update?: unknown };

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === 'object';

const encryptValue = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return value && !isEncrypted(value) ? encrypt(value) : value;
  }

  // Updates can also look like `{ set: 'token' }`
  if (isObject(value) && 'set' in value) {
    return { ...value, set: encryptValue(value.set) };
  }

  return value;
};

const encryptData = (data: unknown) => {
  // `createMany` takes a list
  for (const item of [data].flat()) {
    if (isObject(item) && 'apiToken' in item) {
      item.apiToken = encryptValue(item.apiToken);
    }
  }
};

/**
 * Encrypts the API token of any write to Habitica users, so it's never
 * stored in plain text.
 */
export const encryptApiTokens = (args: object) => {
  const { create, data, update } = args as WriteArgs;

  encryptData(data);
  encryptData(create);
  encryptData(update);
};

/**
 * Writing a Habitica user through a GitHub user skips `encryptApiTokens`, so
 * that isn't allowed.
 */
export const refuseNestedHabiticaUserWrites = (args: object) => {
  const { create, data, update } = args as WriteArgs;
  const hasNestedWrite = [data, create, update]
    .flat()
    .some(data => isObject(data) && 'habiticaUser' in data);

  if (hasNestedWrite) {
    throw new Error(
      'Write Habitica users with prisma.habiticaUsers, so their API token is encrypted.',
    );
  }
};
