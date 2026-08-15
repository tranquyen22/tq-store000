import { Module } from '@nestjs/common';
import { DispatchController } from './dispatch.controller';
import { DispatchService } from './dispatch.service';
import { DriverWalletService } from './driver-wallet.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DispatchController],
  providers: [DispatchService, DriverWalletService],
  exports: [DispatchService, DriverWalletService],
})
export class DispatchModule {}
