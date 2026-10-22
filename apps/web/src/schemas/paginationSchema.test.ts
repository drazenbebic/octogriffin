import { paginationSchema } from './paginationSchema';

describe('paginationSchema', () => {
  it.each([undefined, {}, { limit: 10, page: 2 }])('accepts %j', params => {
    expect(paginationSchema.safeParse(params).success).toBe(true);
  });

  it.each([
    { page: 0 },
    { page: -1 },
    { page: 1.5 },
    { limit: 0 },
    { limit: 101 },
  ])('rejects %j', params => {
    expect(paginationSchema.safeParse(params).success).toBe(false);
  });
});
