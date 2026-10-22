describe('@/lib/crypto.ts', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('should throw an error on import if ENCRYPTION_KEY is missing or short', async () => {
    process.env.ENCRYPTION_KEY = 'too-short';

    await expect(import('@/lib/crypto')).rejects.toThrow(
      'ENCRYPTION_KEY must be at least 32 characters long',
    );
  });

  it('should encrypt and decrypt a string correctly', async () => {
    process.env.ENCRYPTION_KEY = 'test-key-must-be-32-bytes-long-!!';

    const { decrypt, encrypt } = await import('@/lib/crypto');

    const originalText = 'This will be encrypted and decrypted';
    const encrypted = encrypt(originalText);
    const decrypted = decrypt(encrypted);

    expect(encrypted).not.toBe(originalText);
    expect(decrypted).toBe(originalText);
  });

  it('should produce different outputs for the same input (Random IV)', async () => {
    process.env.ENCRYPTION_KEY = 'test-key-must-be-32-bytes-long-!!';

    const { encrypt } = await import('@/lib/crypto');

    const text = 'Static Text';
    const run1 = encrypt(text);
    const run2 = encrypt(text);

    expect(run1).not.toBe(run2);
  });

  it('should throw an error when trying to decrypt invalid data', async () => {
    process.env.ENCRYPTION_KEY = 'test-key-must-be-32-bytes-long-!!';

    const { decrypt } = await import('@/lib/crypto');

    expect(() => decrypt('invalid-string')).toThrow();
    expect(() => decrypt('bad:format:string')).toThrow();
  });
});
