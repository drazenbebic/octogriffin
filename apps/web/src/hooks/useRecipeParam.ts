'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

import type { Recipe } from '@/config/recipes';
import { getRecipe } from '@/utils/recipes';

/**
 * The recipe in `/dashboard?recipe=…`. Unknown slugs are ignored and
 * removed from the URL; `clear` removes a known one once it's been used.
 */
export const useRecipeParam = (): {
  clear: () => void;
  recipe: Recipe | undefined;
} => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('recipe');
  const recipe = getRecipe(slug);

  const clear = useCallback(() => router.replace('/dashboard'), [router]);

  useEffect(() => {
    if (slug && !recipe) {
      clear();
    }
  }, [slug, recipe, clear]);

  return { clear, recipe };
};
