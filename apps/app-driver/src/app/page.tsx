'use client';

import React, { useState } from 'react';
import { DriverHeader } from '../components/DriverHeader';
import { IncomingRideModal } from '../components/IncomingRideModal';
import { ActiveTripNavigation } from '../components/ActiveTripNavigation';
import { SOSButton } from '../components/SOSButton';
import { DriverWalletView } from '../components/DriverWalletView';
import { DriverServiceType } from '@tq-platform/types';
import { DriverTrip, DriverWalletsState } from '../types';

const sampleIncomingTrip: DriverTrip = {
  id: 'TRIP-7712',
  customerName: 'Phạm Minh Tuấn',
  customerPhone: '0987654321',
  pickupAddress: '456 Lê Duẩn, Quận 1, TP. Hồ Chí Minh',
  dropoffAddress: '789 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh',
  distanceKm: 5.4,
  fareAmount: 120000,
  netEarnings: 96000, // 80% thực nhận
  paymentMethod: 'COD',
  serviceType: 'CAR_TAXI',
  status: 'SEARCHING'
};

export default function DriverMobileScreen() {
  const [isOnline, setIsOnline] = useState(true);
  const [selectedService, setSelectedService] = useState<DriverServiceType>(DriverServiceType.CAR_TAXI);
  const [incomingTrip, setIncomingTrip] = useState<DriverTrip | null>(sampleIncomingTrip);
  const [activeTrip, setActiveTrip] = useState<DriverTrip | null>(null);

  const [wallets, setWallets] = useState<DriverWalletsState>({
    earningsBalance: 3450000,
    depositBalance: 476000
  });

  const handleAcceptRide = (trip: DriverTrip) => {
    setActiveTrip(trip);
    setIncomingTrip(null);
  };

  const handleCompleteTrip = (trip: DriverTrip) => {
    if (trip.paymentMethod === 'COD') {
      const commission = trip.fareAmount * 0.2;
      setWallets(prev => ({
        ...prev,
        depositBalance: prev.depositBalance - commission
      }));
    } else {
      setWallets(prev => ({
        ...prev,
        earningsBalance: prev.earningsBalance + trip.netEarnings
      }));
    }
    setActiveTrip(null);
    alert(`Đã hoàn tất chuyến đi ${trip.id}! Cảm ơn đối tác.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white max-w-md mx-auto border-x border-slate-800">
      
      {/* Header with Online Toggle & Service Filter */}
      <DriverHeader
        isOnline={isOnline}
        onToggleOnline={setIsOnline}
        selectedService={selectedService}
        onSelectService={setSelectedService}
        driverName="Tài xế Nguyễn Văn Hùng"
      />

      <main className="flex-1 p-4 space-y-4">
        
        {/* Dual-Wallet Balances */}
        <DriverWalletView wallets={wallets} />

        {/* Active Journey Controller */}
        {activeTrip ? (
          <ActiveTripNavigation trip={activeTrip} onCompleteTrip={handleCompleteTrip} />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center text-xs text-slate-400 space-y-2">
            <p className="font-bold text-slate-200">
              {isOnline ? 'Đang bật quét cuốc trong bán kính 5 km...' : 'Bạn đang Offline, bật Online để nhận cuốc xe!'}
            </p>
            {isOnline && (
              <button onClick={() => setIncomingTrip(sampleIncomingTrip)} className="px-3 py-1 bg-sky-500/20 text-sky-400 rounded-lg font-bold border border-sky-500/30">
                [Mô phỏng cuốc xe nổ]
              </button>
            )}
          </div>
        )}

        {/* Emergency Red SOS Alert Button */}
        <SOSButton />

      </main>

      {/* 15s Countdown Modal Popup */}
      <IncomingRideModal
        trip={incomingTrip}
        onAccept={handleAcceptRide}
        onDecline={() => setIncomingTrip(null)}
      />

    </div>
  );
}
