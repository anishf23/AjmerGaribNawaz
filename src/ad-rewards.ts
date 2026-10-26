import AsyncStorage from '@react-native-async-storage/async-storage';

const BANNER_FREE_UNTIL_KEY = 'BANNER_FREE_UNTIL';
export const BANNER_FREE_REWARD_MINUTES = 15;

export async function grantBannerFreeReward() {
  const expiresAt = Date.now() + BANNER_FREE_REWARD_MINUTES * 60 * 1000;
  await AsyncStorage.setItem(BANNER_FREE_UNTIL_KEY, String(expiresAt));
  return;
}

export async function getBannerFreeUntil() {
  const storedValue = await AsyncStorage.getItem(BANNER_FREE_UNTIL_KEY);
  const expiresAt = Number(storedValue ?? 0);
  return Number.isFinite(expiresAt) && expiresAt > Date.now() ? expiresAt : 0;
}
