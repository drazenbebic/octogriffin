import { roadmap } from '@/config/roadmap';

import { roadmapJsonLd } from './roadmap';

describe('roadmapJsonLd', () => {
  it('lists every roadmap phase in order', () => {
    const list = roadmapJsonLd.mainEntity as unknown as {
      itemListElement: { name: string; position: number }[];
    };

    expect(list.itemListElement).toHaveLength(roadmap.length);
    expect(list.itemListElement.map(item => item.position)).toEqual(
      roadmap.map((_, index) => index + 1),
    );
    expect(list.itemListElement.map(item => item.name)).toContain(
      'Ledger (in progress)',
    );
  });
});
