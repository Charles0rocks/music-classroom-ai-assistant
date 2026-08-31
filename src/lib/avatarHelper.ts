/**
 * Gender-based Deterministic Avatar Generator
 * Provides realistic, high-quality music teacher & student portraits
 * with deterministic hashing (same user ID / seed always returns the same picture).
 */

const FEMALE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', // Warm female portrait
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80', // Asian female portrait
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80', // Professional female teacher
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80', // Friendly female portrait
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80', // Female artist
];

const MALE_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', // Friendly male teacher
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', // Professional male teacher
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80', // Musician male teacher
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80', // Asian male portrait
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80', // Male artist
];

const NEUTRAL_AVATARS = [
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&auto=format&fit=crop&q=80', // Music instrument neutral
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80', // General student
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', // General avatar
];

/**
 * Hash a string seed into a deterministic positive integer
 */
const hashSeed = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Returns a deterministic avatar URL based on gender and seed (ID/Email/Name).
 *
 * @param gender - 'male' | 'female' | '男' | '女' | etc.
 * @param seed - Unique identifier (e.g. user_id, email, or name)
 * @param existingUrl - Optional existing avatar URL override
 */
export const getAvatarByGender = (
  gender?: string,
  seed?: string,
  existingUrl?: string
): string => {
  // If user provided a specific custom URL (not generic placeholder), keep it
  if (
    existingUrl &&
    existingUrl.startsWith('http') &&
    !existingUrl.includes('photo-1534528741775-53994a69daeb')
  ) {
    return existingUrl;
  }

  const cleanGender = String(gender || '').trim().toLowerCase();
  const seedKey = seed || 'default-seed';
  const index = hashSeed(seedKey);

  if (
    cleanGender === 'female' ||
    cleanGender === '女' ||
    cleanGender.includes('female') ||
    cleanGender.includes('女')
  ) {
    return FEMALE_AVATARS[index % FEMALE_AVATARS.length];
  }

  if (
    cleanGender === 'male' ||
    cleanGender === '男' ||
    cleanGender.includes('male') ||
    cleanGender.includes('男')
  ) {
    return MALE_AVATARS[index % MALE_AVATARS.length];
  }

  return NEUTRAL_AVATARS[index % NEUTRAL_AVATARS.length];
};
