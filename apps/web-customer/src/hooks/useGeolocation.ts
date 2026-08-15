import { useState, useEffect } from 'react';
import { LocationState } from '../types';

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationState>({
    latitude: 10.7769, // Default HCM City
    longitude: 106.7009,
    provinceCode: '79',
    provinceName: 'TP. Hồ Chí Minh',
    districtCode: '760',
    districtName: 'Quận 1',
    isGpsActive: false,
    statusText: 'Đang xác định GPS...'
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, statusText: 'Trình duyệt không hỗ trợ GPS' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isGpsActive: true,
          statusText: 'GPS Tự Động Ready'
        }));
      },
      (error) => {
        console.warn('[WARN][useGeolocation.ts]: GPS Permission Denied', error.message);
        setLocation(prev => ({
          ...prev,
          isGpsActive: false,
          statusText: 'Chọn vùng thủ công'
        }));
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  const updateManualLocation = (provinceCode: string, provinceName: string, districtCode: string, districtName: string) => {
    setLocation(prev => ({
      ...prev,
      provinceCode,
      provinceName,
      districtCode,
      districtName,
      isGpsActive: false,
      statusText: `${districtName}, ${provinceName}`
    }));
  };

  return { location, updateManualLocation };
};
