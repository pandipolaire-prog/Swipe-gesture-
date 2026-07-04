import React, { useState, useEffect } from "react";
import { X, ShieldAlert, Wifi, Bluetooth, Moon, Plane, Zap, MapPin, Camera, Download, AlertTriangle, Fingerprint } from "lucide-react";

// ==========================================
// 1. POWER DIALOG SIMULATOR
// ==========================================
interface PowerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  addLog: (msg: string, type: "info" | "success" | "warning" | "error") => void;
}

export const SimulatedPowerMenu: React.FC<PowerMenuProps> = ({ isOpen, onClose, addLog }) => {
  if (!isOpen) return null;

  const handleAction = (action: string) => {
    addLog(`EXECUTE POWER DIALOG COMMAND: [${action.toUpperCase()}]`, "warning");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
      <div className="relative w-80 max-w-full bg-[#0a0f1d] border-2 border-[rgba(157,0,255,1)] p-6 rounded-2xl box-glow-purple text-center">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="inline-flex p-3 rounded-full bg-purple-950/40 border border-purple-500/50 mb-4 animate-pulse">
          <AlertTriangle className="text-[rgba(157,0,255,1)]" size={28} />
        </div>

        <h3 className="font-orbitron font-black text-xl text-white uppercase tracking-wider mb-1">
          Power Menu
        </h3>
        <p className="text-[#8892A4] font-mono text-xs mb-6">
          GLOBAL_ACTION_POWER_DIALOG
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button 
            onClick={() => handleAction("Power Off")}
            className="p-4 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 hover:border-red-500 rounded-xl transition-all group duration-300"
          >
            <Zap className="mx-auto text-red-500 mb-2 group-hover:scale-110 transition-transform" size={20} />
            <span className="font-sans text-xs text-white uppercase tracking-wide">Power Off</span>
          </button>

          <button 
            onClick={() => handleAction("Restart Device")}
            className="p-4 bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 hover:border-cyan-500 rounded-xl transition-all group duration-300"
          >
            <Zap className="rotate-180 mx-auto text-cyan-400 mb-2 group-hover:scale-110 transition-transform" size={20} />
            <span className="font-sans text-xs text-white uppercase tracking-wide">Restart</span>
          </button>

          <button 
            onClick={() => handleAction("Emergency Sec")}
            className="p-4 bg-[#140b2b] hover:bg-purple-900/30 border border-purple-500/30 hover:border-purple-500 rounded-xl transition-all col-span-2 group duration-300"
          >
            <ShieldAlert className="mx-auto text-purple-400 mb-2 group-hover:scale-110 transition-transform" size={20} />
            <span className="font-sans text-xs text-white uppercase tracking-wider font-bold">Lockdown Mode</span>
          </button>
        </div>

        <p className="text-[10px] text-gray-500 font-mono mt-2">
          SwipeControl Accessibility Service Link Active
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 2. DETAILED NOTIFICATION DRAWER
// ==========================================
interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  addLog: (msg: string, type: "info" | "success" | "warning" | "error") => void;
}

export const SimulatedNotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose, addLog }) => {
  const [activeToggles, setActiveToggles] = useState({
    wifi: true,
    bluetooth: false,
    dnd: true,
    airplane: false,
    battery: false,
    location: true
  });

  const toggle = (key: keyof typeof activeToggles, label: string) => {
    const next = !activeToggles[key];
    setActiveToggles(prev => ({ ...prev, [key]: next }));
    addLog(`TOGGLED HARDWARE MOCK: [${label}] to ${next ? "ON" : "OFF"}`, next ? "success" : "info");
  };

  return (
    <div 
      className={`fixed top-0 inset-x-0 bottom-0 bg-black/60 z-50 transition-all duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-lg mx-auto bg-[#070b14]/95 border-b border-cyan-500/40 p-6 rounded-b-3xl transition-transform duration-300 transform shadow-2xl shadow-cyan-500/10 ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pull handle styling */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-1 bg-cyan-500/30 rounded-full cursor-pointer hover:bg-cyan-500/70" onClick={onClose} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-cyan-500/10 pb-4">
          <div>
            <span className="font-orbitron font-black text-white text-base tracking-widest uppercase">
              SwipeControl HUD System Panel
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
              <p className="text-[10px] text-gray-500 font-mono">
                CONNECTED IP: 127.0.0.1 // CHANNEL_STABLE
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/10 text-cyan-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Simulated Quick Settings Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button 
            onClick={() => toggle("wifi", "Wi-Fi Interface")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
              activeToggles.wifi 
                ? "bg-cyan-950/40 border-cyan-400 text-cyan-400 box-glow-cyan" 
                : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            <Wifi size={20} className="mb-1" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-wide">Wi-Fi</span>
          </button>

          <button 
            onClick={() => toggle("bluetooth", "Bluetooth Controller")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
              activeToggles.bluetooth 
                ? "bg-cyan-950/40 border-cyan-400 text-cyan-400 box-glow-cyan" 
                : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            <Bluetooth size={20} className="mb-1" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-wide">Bluetooth</span>
          </button>

          <button 
            onClick={() => toggle("dnd", "Do Not Disturb Mask")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
              activeToggles.dnd 
                ? "bg-purple-950/40 border-purple-400 text-purple-400 box-glow-purple" 
                : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            <Moon size={20} className="mb-1" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-wide font-mono">Quiet</span>
          </button>

          <button 
            onClick={() => toggle("airplane", "Radio Emission Shield")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
              activeToggles.airplane 
                ? "bg-amber-950/40 border-amber-400 text-amber-400" 
                : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            <Plane size={20} className="mb-1" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-wide">Airplane</span>
          </button>

          <button 
            onClick={() => toggle("battery", "Battery Saver Limit")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
              activeToggles.battery 
                ? "bg-emerald-950/40 border-emerald-400 text-emerald-400" 
                : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            <Zap size={20} className="mb-1" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-wide">Saver</span>
          </button>

          <button 
            onClick={() => toggle("location", "GPS Beacon Matrix")}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
              activeToggles.location 
                ? "bg-cyan-950/40 border-cyan-400 text-cyan-400 box-glow-cyan" 
                : "bg-slate-900/30 border-slate-800 text-slate-500 hover:border-slate-700"
            }`}
          >
            <MapPin size={20} className="mb-1" />
            <span className="text-[10px] font-sans font-bold uppercase tracking-wide">Location</span>
          </button>
        </div>

        {/* Notifications list */}
        <h4 className="text-xs font-orbitron text-gray-400 uppercase tracking-widest pl-1 mb-2">Simulated Activity Notifications</h4>
        <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
          <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00FF41] mt-1.5" />
            <div className="flex-1">
              <span className="text-xs font-sans font-bold text-white uppercase block">SwipeControl Service Running</span>
              <p className="text-[11px] text-[#8892A4]">Listening on foreground overlay overlay channel seamlessly.</p>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">1m</span>
          </div>

          <div className="p-3 bg-purple-950/20 border border-purple-500/10 rounded-xl flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5" />
            <div className="flex-1">
              <span className="text-xs font-sans font-bold text-white uppercase block">Swipe GAUCHE mapping ready</span>
              <p className="text-[11px] text-[#8892A4]">Power Menu and layout controls bound to system loop.</p>
            </div>
            <span className="text-[10px] text-gray-500 font-mono">5m</span>
          </div>
        </div>

        {/* Close Button footer bar */}
        <button 
          onClick={onClose}
          className="w-full py-2 bg-gradient-to-r from-cyan-950 to-blue-950 hover:from-cyan-900 hover:to-blue-900 border border-cyan-500/30 text-cyan-400 font-orbitron font-medium text-xs tracking-widest uppercase rounded-xl transition-all"
        >
          Retract Drawer Control
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. SECURED LOCK SCREEN BLACKOUT
// ==========================================
interface LockScreenProps {
  isOpen: boolean;
  onClose: () => void;
  addLog: (msg: string, type: "info" | "success" | "warning" | "error") => void;
}

export const SimulatedLockScreen: React.FC<LockScreenProps> = ({ isOpen, onClose, addLog }) => {
  const [pin, setPin] = useState<string>("");
  const secretCode = "1337";

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      
      if (nextPin === secretCode) {
        addLog("LOCK DISMISSED: PASSCODE VERIFIED", "success");
        setPin("");
        onClose();
      } else if (nextPin.length === 4) {
        addLog(`WRONG KEY TRIAL: "${nextPin}"`, "error");
        setTimeout(() => setPin(""), 600);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#020409] text-white flex flex-col justify-between p-8 z-50 animate-fade-in font-mono select-none">
      {/* Top Warning header */}
      <div className="max-w-md mx-auto text-center mt-6">
        <div className="flex items-center justify-center gap-2 text-red-500 font-orbitron font-black text-sm tracking-widest uppercase mb-2">
          <ShieldAlert className="animate-pulse" size={20} />
          LockNow Trigger Engage
        </div>
        <p className="text-xs text-[#8892A4]">
          This simulates the device going immediately asleep or secured via security policies.
        </p>
      </div>

      {/* Main Lock Interactive Bio */}
      <div className="flex flex-col items-center justify-center max-w-sm mx-auto my-4 text-center">
        <div className="relative p-6 rounded-full border-2 border-dashed border-red-500/40 mb-4 animate-spin-slow">
          <div className="p-6 bg-red-950/25 border-2 border-red-600 rounded-full box-glow-red animate-pulse flex items-center justify-center">
            <Fingerprint className="text-red-500 transform active:scale-95 duration-200 cursor-pointer" size={60} />
          </div>
        </div>

        <p className="text-xs font-orbitron font-black uppercase text-white tracking-widest">
          SECURITY PROTOCOL ENGAGED
        </p>
        <p className="text-[11px] text-red-400 mt-2">
          Use matrix code <span className="text-white bg-slate-900 px-1 border border-red-500/50 rounded font-bold">1337</span> to override system security.
        </p>

        {/* Pin view boxes */}
        <div className="flex gap-4 justify-center items-center mt-6 h-6">
          {[0, 1, 2, 3].map((idx) => (
            <div 
              key={idx} 
              className={`w-3.5 h-3.5 rounded-full border border-red-500 transition-all duration-200 ${
                pin.length > idx ? "bg-red-500 scale-125 box-glow-red" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Numerical Keyboard */}
      <div className="max-w-xs mx-auto grid grid-cols-3 gap-3 mb-10 w-full">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
          <button 
            key={num}
            onClick={() => handleKeyPress(num)}
            className="w-16 h-16 rounded-full border border-red-500/20 bg-red-950/10 hover:bg-red-950/30 text-white font-orbitron text-xl font-bold flex items-center justify-center mx-auto transition-all active:scale-90"
          >
            {num}
          </button>
        ))}
        <button 
          onClick={() => setPin("")}
          className="col-span-1 text-[10px] text-gray-500 flex items-center justify-center hover:text-red-400 font-sans uppercase font-black"
        >
          CLR
        </button>
        <button 
          onClick={() => handleKeyPress("0")}
          className="w-16 h-16 rounded-full border border-red-500/20 bg-red-950/10 hover:bg-red-950/30 text-gray-100 font-orbitron text-xl font-bold flex items-center justify-center mx-auto transition-all active:scale-90"
        >
          0
        </button>
        <button 
          onClick={() => {
            addLog("HARDWARE MASTER OVERRIDE FORCE RESCUE", "warning");
            onClose();
          }}
          className="col-span-1 text-[10px] text-gray-500 flex items-center justify-center hover:text-cyan-400 font-sans uppercase font-black"
        >
          BYPASS
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 4. SCREENSHOT SNAPSHOT SIMULATOR
// ==========================================
interface ScreenshotProps {
  isOpen: boolean;
  onClose: () => void;
  addLog: (msg: string, type: "info" | "success" | "warning" | "error") => void;
}

export const SimulatedScreenshotFlash: React.FC<ScreenshotProps> = ({ isOpen, onClose, addLog }) => {
  const [showFlashed, setShowFlashed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowFlashed(true);
      const timer = setTimeout(() => {
        setShowFlashed(false);
      }, 500); // 500ms flash duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const downloadMock = () => {
    // Generate simple data URL text file explaining screenshot capture parameters
    const content = `---- SWIPECONTROL SCREENSHOT LOG ----\nCaptured: ${new Date().toISOString()}\nTarget: Web Overlay Simulator Frame\nStatus: Saved to Pictures Gallery via MediaProjectionManager.\n\nSwipeControl Cyberpunk HUD System v1.0`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `swipe_control_screenshot_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    addLog("DOWNLOADED SIMULATED SCREENSHOT PARAMETERS FILE", "success");
    onClose();
  };

  return (
    <>
      {/* 4.1 THE HARD LIGHT FLASH */}
      {showFlashed && (
        <div className="fixed inset-0 bg-white z-[9999] pointer-events-none animate-flash-out" />
      )}

      {/* 4.2 FLOATING HUD FRAME POPUP */}
      <div className="fixed bottom-6 left-6 max-w-sm bg-[#050810]/95 border-2 border-[rgba(0,245,255,1)] p-4 rounded-xl box-glow-cyan z-[60] flex items-center gap-4 animate-slide-up">
        {/* Left icon wrapper */}
        <div className="p-3 bg-cyan-950/50 border border-cyan-500/40 rounded-lg text-cyan-400">
          <Camera size={24} className="animate-pulse" />
        </div>

        {/* Info */}
        <div className="flex-1">
          <span className="text-xs font-orbitron font-black text-white uppercase tracking-wider block">
            SCREENSHOT CAPTURED
          </span>
          <span className="text-[10px] text-[#8892A4] font-mono block">
            MediaProjection saved frame
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          <button 
            onClick={downloadMock}
            className="p-1.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition-colors flex items-center justify-center"
            title="Download Screenshot Info File"
          >
            <Download size={14} />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 border border-slate-800 hover:border-red-500/50 hover:text-red-400 text-gray-500 rounded-lg transition-all"
            title="Dismiss Panel"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </>
  );
};
