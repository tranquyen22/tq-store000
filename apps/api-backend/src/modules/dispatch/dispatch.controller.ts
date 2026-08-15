import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { DriverWalletService } from './driver-wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('dispatch')
export class DispatchController {
  constructor(
    private readonly dispatchService: DispatchService,
    private readonly driverWalletService: DriverWalletService
  ) {}

  @Post('find-nearest-drivers')
  async findNearestDrivers(@Body() body: { latitude: number; longitude: number; radiusKm?: number }) {
    try {
      const drivers = await this.dispatchService.findNearestDrivers(body);
      return { success: true, count: drivers.length, data: drivers };
    } catch (error) {
      console.error('[ERROR][dispatch.controller.ts - findNearestDrivers]:', error);
      throw error;
    }
  }

  @Post('sos-alert')
  @UseGuards(JwtAuthGuard)
  async triggerSOS(@Body() body: { latitude: number; longitude: number; rideId?: string }, @CurrentUser('sub') userId: string) {
    try {
      return await this.dispatchService.triggerSOSAlert({
        userId,
        latitude: body.latitude,
        longitude: body.longitude,
        rideId: body.rideId
      });
    } catch (error) {
      console.error('[ERROR][dispatch.controller.ts - triggerSOS]:', error);
      throw error;
    }
  }

  @Post('process-commission')
  @UseGuards(JwtAuthGuard)
  async processCommission(@Body() body: { driverUserId: string; rideId: string; fareAmount: number; paymentMethod: 'COD' | 'TQ_WALLET' | 'MOMO_QR' }) {
    try {
      return await this.driverWalletService.processRideCommissionAndEarnings(body);
    } catch (error) {
      console.error('[ERROR][dispatch.controller.ts - processCommission]:', error);
      throw error;
    }
  }
}
