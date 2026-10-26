import { AdEventType, RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const PRODUCTION_UNIT_ID = 'ca-app-pub-7672039594265570/2486080922';
const UNIT_ID = __DEV__ ? TestIds.REWARDED : PRODUCTION_UNIT_ID;

let rewardedAd: RewardedAd | null = null;
let isLoading = false;
let isShowing = false;
let pendingNavigation: (() => void) | null = null;
let pendingReward: (() => Promise<void> | void) | null = null;
let rewardTask = Promise.resolve();

function finishNavigation() {
  const navigate = pendingNavigation;
  pendingNavigation = null;
  pendingReward = null;
  isShowing = false;
  void rewardTask.finally(() => {
    navigate?.();
    preloadRewardedAd();
  });
  rewardTask = Promise.resolve();
}

export function preloadRewardedAd() {
  if (rewardedAd || isLoading) return;

  isLoading = true;
  const ad = RewardedAd.createForAdRequest(UNIT_ID, {
    requestNonPersonalizedAdsOnly: true,
  });

  ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
    isLoading = false;
  });
  ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
    const grantReward = pendingReward;
    pendingReward = null;
    if (grantReward) rewardTask = Promise.resolve(grantReward()).catch(() => undefined);
  });
  ad.addAdEventListener(AdEventType.CLOSED, () => {
    if (rewardedAd === ad) rewardedAd = null;
    finishNavigation();
  });
  ad.addAdEventListener(AdEventType.ERROR, () => {
    if (rewardedAd === ad) rewardedAd = null;
    isLoading = false;
    if (isShowing) finishNavigation();
  });

  rewardedAd = ad;
  ad.load();
}

export function showRewardedAdThen(
  navigate: () => void,
  onRewardEarned: () => Promise<void> | void,
) {
  const ad = rewardedAd;
  if (!ad?.loaded || isShowing) {
    navigate();
    preloadRewardedAd();
    return;
  }

  isShowing = true;
  pendingNavigation = navigate;
  pendingReward = onRewardEarned;
  ad.show().catch(() => {
    if (rewardedAd === ad) rewardedAd = null;
    finishNavigation();
  });
}
