/**
 * Gender-based Deterministic Avatar Generator
 * Provides realistic, high-quality music teacher & student portraits.
 */

export const AVATAR_MALE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'; // 男老師照片
export const AVATAR_FEMALE = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'; // 女老師照片

const FEMALE_AVATARS = [
  AVATAR_FEMALE,
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
];

const MALE_AVATARS = [
  AVATAR_MALE,
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
];

/**
 * Returns a dynamic avatar URL based on gender and seed
 */
export const getAvatarByGender = (
  gender?: string,
  seed?: string,
  existingUrl?: string
): string => {
  // Keep custom user-uploaded avatars if available
  if (
    existingUrl &&
    existingUrl.startsWith('http') &&
    !existingUrl.includes('photo-1534528741775-53994a69daeb') &&
    !existingUrl.includes('photo-1544005313-94ddf0286df2') &&
    !existingUrl.includes('photo-1507003211169-0a1dd7228f2d')
  ) {
    return existingUrl;
  }

  const cleanGender = String(gender || '').trim().toLowerCase();

  if (
    cleanGender === 'male' ||
    cleanGender === '男' ||
    cleanGender.includes('male') ||
    cleanGender.includes('男')
  ) {
    return AVATAR_MALE;
  }

  return AVATAR_FEMALE;
};
