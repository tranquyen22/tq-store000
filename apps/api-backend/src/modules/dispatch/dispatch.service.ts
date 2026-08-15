import { Injectable } from '@nestjs/common';
import { prisma } from '@tq-platform/database';
import { DriverServiceType, RideStatus, SOSAlertStatus } from '@tq-platform/types';

@Injectable()
export class DispatchService {
  /**
    Thuật toán tìm tài xế gần nhất theo bán kính (PostGIS Haversine Distance Formula)
   */
  async findNearestDrivers(params: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    serviceType?: DriverServiceType;
    limit?: number;
  }) {
    const { latitude, longitude, radiusKm = 5, serviceType, limit = 10 } = params;

    try {
      // Find active online & not busy drivers
      const activeDrivers = await prisma.driver.findMany({
        where: {
          isOnline: true,
          isBusy: false,
          serviceType: serviceType ? serviceType : undefined,
          currentLat: { not: null },
          currentLng: { not: null },
        },
        include: {
          user: { select: { fullName: true, phone: true, avatar: true } }
        }
      });

      // Calculate Haversine distance in km
      const driversWithDistance = activeDrivers.map(driver => {
        const distKm = this.calculateHaversineDistance(
          latitude,
          longitude,
          driver.currentLat!,
          driver.currentLng!
        );
        return { ...driver, distanceKm: Math.round(distKm * 10) / 10 };
      });

      // Filter by radius & sort by nearest distance
      return driversWithDistance
        .filter(d => d.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, limit);
    } catch (error) {
      console.error('[ERROR][dispatch.service.ts - findNearestDrivers]:', error);
      return [];
    }
  }

  /**
    Khởi tạo tín hiệu Báo động Khẩn cấp SOS
   */
  async triggerSOSAlert(params: {
    userId: string;
    driverId?: string;
    rideId?: string;
    latitude: number;
    longitude: number;
    note?: string;
  }) {
    try {
      const sosRecord = await prisma.sOSAlert.create({
        data: {
          userId: params.userId,
          driverId: params.driverId || null,
          rideId: params.rideId || null,
          latitude: params.latitude,
          longitude: params.longitude,
          status: SOSAlertStatus.TRIGGERED,
          note: params.note || 'Cảnh báo SOS Khẩn cấp phát sinh từ ứng dụng!',
        }
      });

      console.warn(`[EMERGENCY SOS ALERT ACTIVATED] User: ${params.userId}, Lat: ${params.latitude}, Lng: ${params.longitude}`);
      return { success: true, message: 'Đã bắn tín hiệu SOS về trung tâm tổng đài!', sosId: sosRecord.id };
    } catch (error) {
      console.error('[ERROR][dispatch.service.ts - triggerSOSAlert]:', error);
      throw error;
    }
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
