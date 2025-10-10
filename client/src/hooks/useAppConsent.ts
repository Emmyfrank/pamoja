import { useState } from "react";

const STORAGE_KEYS = {
  APP_CONSENT: "pamoja_app_consent",
  COMMUNITY_GUIDELINES: "pamoja_community_guidelines_last_shown",
  AGE_VERIFIED: "pamoja_age_verified",
  TOO_YOUNG: "pamoja_too_young",
};

interface AppConsentState {
  hasConsented: boolean;
  isAgeVerified: boolean;
  isTooYoung: boolean;
  shouldShowGuidelines: boolean;
  handleConsent: (accepted: boolean) => void;
  handleGuidelinesDismiss: () => void;
  resetConsent: () => void;
}

export const useAppConsent = (): AppConsentState => {
  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.APP_CONSENT) === "true";
  });

  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AGE_VERIFIED) === "true";
  });

  const [isTooYoung, setIsTooYoung] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.TOO_YOUNG) === "true";
  });

  const [shouldShowGuidelines, setShouldShowGuidelines] = useState<boolean>(
    () => {
      const lastShown = localStorage.getItem(STORAGE_KEYS.COMMUNITY_GUIDELINES);
      if (!lastShown) return true;

      const lastShownDate = new Date(lastShown);
      const today = new Date();
      const daysSinceLastShown = Math.floor(
        (today.getTime() - lastShownDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      return daysSinceLastShown >= 1;
    }
  );

  const handleConsent = (accepted: boolean) => {
    if (accepted) {
      localStorage.setItem(STORAGE_KEYS.APP_CONSENT, "true");
      localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, "true");
      localStorage.setItem(STORAGE_KEYS.TOO_YOUNG, "false");
      setHasConsented(true);
      setIsAgeVerified(true);
      setIsTooYoung(false);
    } else {
      localStorage.setItem(STORAGE_KEYS.APP_CONSENT, "true");
      localStorage.setItem(STORAGE_KEYS.AGE_VERIFIED, "false");
      localStorage.setItem(STORAGE_KEYS.TOO_YOUNG, "true");
      setHasConsented(true);
      setIsAgeVerified(false);
      setIsTooYoung(true);
    }
  };

  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEYS.APP_CONSENT);
    localStorage.removeItem(STORAGE_KEYS.AGE_VERIFIED);
    localStorage.removeItem(STORAGE_KEYS.TOO_YOUNG);
    setHasConsented(false);
    setIsAgeVerified(false);
    setIsTooYoung(false);
  };

  const handleGuidelinesDismiss = () => {
    localStorage.setItem(
      STORAGE_KEYS.COMMUNITY_GUIDELINES,
      new Date().toISOString()
    );
    setShouldShowGuidelines(false);
  };

  return {
    hasConsented,
    isAgeVerified,
    isTooYoung,
    shouldShowGuidelines,
    handleConsent,
    handleGuidelinesDismiss,
    resetConsent,
  };
};
