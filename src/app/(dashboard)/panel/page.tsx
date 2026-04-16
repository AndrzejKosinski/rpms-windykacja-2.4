"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAppContext } from '../../../context/AppContext';

const AdminDashboard = dynamic(() => import('../../../views/dashboard/ui/AdminDashboard'), {
  loading: () => (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
      <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-8"></div>
      <div className="font-black text-xl uppercase tracking-[0.3em] animate-pulse text-center px-6">
        Przygotowywanie Panelu Administratora...
      </div>
    </div>
  )
});

const PremiumDashboard = dynamic(() => import('../../../views/dashboard/ui/PremiumDashboard'), {
  loading: () => (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
      <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-8"></div>
      <div className="font-black text-xl uppercase tracking-[0.3em] animate-pulse text-center px-6">
        Ładowanie Twojego Panelu...
      </div>
    </div>
  )
});

export default function PanelPage() {
  const router = useRouter();
  const {
    isLoggedIn,
    userRole,
    currentUser,
    siteContent,
    cmsStatus,
    handleLogout,
    handleUpdateContent,
    initializeCMS
  } = useAppContext();

  console.log("[DEBUG] PanelPage - isLoggedIn:", isLoggedIn, "userRole:", userRole, "email:", currentUser?.email);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  if (!siteContent) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
      <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-8"></div>
      <div className="font-black text-xl uppercase tracking-[0.3em] animate-pulse text-center px-6">
        Łączenie z bazą danych <br/><span className="text-brand-blue">RPMS Cloud CMS</span>
      </div>
    </div>
  );

  if (userRole === 'ADMIN') {
    return (
      <AdminDashboard 
        onLogout={handleLogout} 
        siteContent={siteContent} 
        onUpdateContent={handleUpdateContent}
        cmsStatus={cmsStatus}
        onInitializeCMS={initializeCMS}
      />
    );
  }

  return <PremiumDashboard onLogout={handleLogout} data={siteContent} user={currentUser} />;
}
