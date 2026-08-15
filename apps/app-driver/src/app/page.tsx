'use client';

import React, { useState } from 'react';
import { DriverHeader } from '../components/DriverHeader';
import { IncomingRideModal } from '../components/IncomingRideModal';
import { ActiveTripNavigation } from '../components/ActiveTripNavigation';
import { SOSButton } from '../components/SOSButton';
import { DriverWalletView } from '../components/DriverWalletView';

export default function DriverAppMainPage() {
  const [showIncomingRide, setShowIncomingRide] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      
      {/* Driver Header & Service Filter */}
      <DriverHeader />

      {/* Main Mobile App Screen */}
      <main className="max-w-md mx-auto px-4 py-6 flex-1 w-full space-y-5">
        
        {/* Test Trigger Button for 15s Countdown Ride Offer Modal */}
        <button
          onClick={() => setShowIncomingRide(true)}
          className="w-full py-2.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 font-extrabold text-xs rounded-2xl border border-sky-500/40 text-center"
        >
          ⚡ Giả Lập Phát Sinh Cuốc Xe Mới (Popup Đếm Ngược 15s)
        </button>

        {/* Interactive Trip Navigation (3 Steps) */}
        <ActiveTripNavigation />

        {/* Emergency SOS Red Alert Button */}
        <SOSButton />

        {/* Driver Dual-Wallet Display */}
        <DriverWalletView />

      </main>

      {/* Incoming Ride Modal (Countdown 15s) */}
      {showIncomingRide && (
        <IncomingRideModal
          id="RIDE-101"
          pickupAddress="123 Nguyễn Huệ, Quận 1, TP.HCM"
          dropoffAddress="456 Nguyễn Thị Thập, Quận 7, TP.HCM"
          distanceKm={5.2}
          netEarnings={68000}
          paymentMethod="CASH_COD"
          onAccept={() => setShowIncomingRide(false)}
          onDecline={() => setShowIncomingRide(false)}
        />
      )}

      <footer className="bg-slate-900 py-4 text-center text-[11px] text-slate-500 border-t border-slate-800">
        <p>&copy; 2026 TQ Platform Driver Mobile App. Expo & React Native Ready.</p>
      </footer>

    </div>
  );
}
