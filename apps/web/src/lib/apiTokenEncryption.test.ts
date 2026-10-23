import {
  encryptApiTokens,
  refuseNestedHabiticaUserWrites,
} from './apiTokenEncryption';

jest.mock('@/lib/crypto', () => ({
  encrypt: (text: string) => `encrypted(${text})`,
  isEncrypted: (text: string) => text.startsWith('encrypted('),
}));

describe('encryptApiTokens', () => {
  it.each([
    [
      'create',
      { data: { apiToken: 'token' } },
      { data: { apiToken: 'encrypted(token)' } },
    ],
    [
      'createMany',
      { data: [{ apiToken: 'a' }, { apiToken: 'b' }] },
      { data: [{ apiToken: 'encrypted(a)' }, { apiToken: 'encrypted(b)' }] },
    ],
    [
      'an update with set',
      { data: { apiToken: { set: 'token' } } },
      { data: { apiToken: { set: 'encrypted(token)' } } },
    ],
    [
      'upsert',
      { create: { apiToken: 'a' }, update: { apiToken: 'b' } },
      {
        create: { apiToken: 'encrypted(a)' },
        update: { apiToken: 'encrypted(b)' },
      },
    ],
  ])('encrypts the token of %s', (_, args, expected) => {
    encryptApiTokens(args);

    expect(args).toEqual(expected);
  });

  it('does not encrypt a token twice', () => {
    const args = { data: { apiToken: 'encrypted(token)' } };

    encryptApiTokens(args);

    expect(args.data.apiToken).toBe('encrypted(token)');
  });

  it('leaves reads alone', () => {
    const args = { where: { userId: 'habitica-user' } };

    encryptApiTokens(args);

    expect(args).toEqual({ where: { userId: 'habitica-user' } });
  });
});

describe('refuseNestedHabiticaUserWrites', () => {
  it('refuses to write a Habitica user through a GitHub user', () => {
    expect(() =>
      refuseNestedHabiticaUserWrites({
        data: { habiticaUser: { create: { apiToken: 'token' } } },
      }),
    ).toThrow('Write Habitica users with prisma.habiticaUsers');
  });

  it('allows other writes and reads', () => {
    expect(() =>
      refuseNestedHabiticaUserWrites({ data: { login: 'octocat' } }),
    ).not.toThrow();
    expect(() =>
      refuseNestedHabiticaUserWrites({ include: { habiticaUser: true } }),
    ).not.toThrow();
  });
});
