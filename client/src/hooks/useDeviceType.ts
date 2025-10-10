import { useState, useEffect } from "react";

export const useDeviceType = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isMobile: false,
    isSafari: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isMobile =
      /iphone|ipad|ipod|android|mobile/.test(userAgent) ||
      window.innerWidth <= 768;

    setDeviceInfo({
      isIOS,
      isMobile,
      isSafari,
    });
  }, []);

  return deviceInfo;
};
