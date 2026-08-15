'use client';

import { useState, useEffect } from 'react';

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  provinceName: string;
  districtName: string;
  status: 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';
  errorMsg?: string;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: 10.7769,
    longitude: 106.7009,
    provinceName: 'Thành phố Hồ Chí Minh',
    districtName: 'Quận 1',
    status: 'IDLE'
  });

  const requestGPS = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, status: 'ERROR', errorMsg: 'Trình duyệt không hỗ trợ GPS' }));
      return;
    }

    setLocation(prev => ({ ...prev, status: 'LOADING' }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          provinceName: 'Thành phố Hồ Chí Minh',
          districtName: 'Quận 1',
          status: 'SUCCESS'
        });
      },
      (err) => {
        setLocation(prev => ({ ...prev, status: 'ERROR', errorMsg: err.message }));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    requestGPS();
  }, []);

  return { location, setLocation, requestGPS };
};
