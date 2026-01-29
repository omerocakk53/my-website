import React from "react";
import BackgroundAnimation from "../../components/background-animation"; // Corrected path

const HomePage = () => (
  <div className="bg-bg flex flex-col items-center justify-center h-screen relative overflow-hidden">
    <BackgroundAnimation />
    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
      <img src="/logo.png" alt="logo" className="w-12 h-12 mx-auto" />
      <h1 className="text-2xl text-text font-bold">
        Bu Site Arka Planda Veri Kazıyor...
      </h1>
      <h2 className="text-lg font-medium text-text">
        Yakında Public Verilerle...
      </h2>
      <p className="text-lg font-medium text-text">Ömer Ocak - Founder</p>
    </div>
  </div>
);

export default HomePage;
