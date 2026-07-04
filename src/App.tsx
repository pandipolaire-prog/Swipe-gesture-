import React, { useState, useEffect, useRef } from "react";
import { 
  Power, Shield, Settings, Sliders, Play, Code2, 
  Terminal, Server, Copy, Check, ChevronRight, 
  RefreshCw, Info, Lock, Eye, AlertCircle, Share2,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Camera, Phone, Cpu
} from "lucide-react";
import { MatrixBackground } from "./components/MatrixBackground";
import { SimulatedPowerMenu, SimulatedNotificationDrawer, SimulatedLockScreen, SimulatedScreenshotFlash } from "./components/Simulators";
import { ANDROID_FILES } from "./data/androidCode";
import { GESTURES_DATA, PERMISSION_STEPS, INITIAL_SYSTEM_LOGS } from "./data/appData";
import { GestureCard, PermissionStep, SystemLog } from "./types";

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"simulator" | "code" | "spec">("simulator");
  
  // Power state de SwipeControl
  const [isSystemActive, setIsSystemActive] = useState<boolean>(true);
  
  // Simulated android states
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_SYSTEM_LOGS);
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    OVERLAY: false,
    ACCESSIBILITY: false,
    DEVICE_ADMIN: false,
    MEDIA_PROJECTION: true,
    STORAGE: true,
    FOREGROUND: true,
  });

  // Simulator overlays
  const [isPowerOpen, setIsPowerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [isScreenshotOpen, setIsScreenshotOpen] = useState(false);

  // Selected file in Android Code tab
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<boolean>(false);

  // Swipe gesture touch detection variables for phone simulation
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [swipeFeedback, setSwipeFeedback] = useState<string>("");

  // Auto-scrolling logs
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Helper to append timestamped logger reports
  const addLog = (message: string, type: "info" | "success" | "warning" | "error") => {
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    setLogs(prev => [...prev, { timestamp: timeStr, message, type }]);
  };

  // Toggle dynamic permissions inside the audit system
  const togglePermission = (key: string, name: string) => {
    const updated = !permissions[key];
    setPermissions(prev => ({ ...prev, [key]: updated }));
    addLog(`PERMISSION OVERRIDE: [${name}] set to ${updated ? "GRANTED" : "REVOKED"}`, updated ? "success" : "warning");
  };

  // Triggering visual Android action simulators
  const triggerGestureAction = (gestureId: string, actionName: string) => {
    if (!isSystemActive) {
      addLog(`WARNING: Swipe blocked. System is offline. Toggle Power central core!`, "error");
      return;
    }

    addLog(`GESTURE DETECTED: [${actionName.toUpperCase()}] triggered via swipe.`, "info");

    switch (gestureId) {
      case "lock":
        if (!permissions.DEVICE_ADMIN) {
          addLog("DENIED: LOCK_NOW requires DevicePolicyManager Admin privileges. Grant Step 3!", "error");
          alert("Erreur de permission : Administrateur d'appareil requis ! activez le Step 3 dans les guides à gauche.");
        } else {
          setIsLockOpen(true);
          addLog("LOCK COMMAND EXECUTED: Device Locked Successfully.", "success");
        }
        break;
      case "power":
        if (!permissions.ACCESSIBILITY) {
          addLog("DENIED: ACCESS_SERVICE_POWER dialog requires Accessibility active state. Grant Step 2!", "error");
          alert("Erreur de permission : Service d'Accessibilité requis ! activez le Step 2.");
        } else {
          setIsPowerOpen(true);
          addLog("ACCESSIBILITY TRIGGER: Displaying GLOBAL_ACTION_POWER_DIALOG.", "success");
        }
        break;
      case "screenshot":
        setIsScreenshotOpen(true);
        addLog("PROJECTION CAPTURE: Executed Screenshot. Frame added to local DCIM folder.", "success");
        break;
      case "notifications":
        if (!permissions.ACCESSIBILITY) {
          addLog("DENIED: NOTIFICATION expansion requires Accessibility daemon. Grant Step 2!", "error");
          alert("Erreur de permission : Service d'Accessibilité requis ! activez le Step 2.");
        } else {
          setIsNotificationOpen(true);
          addLog("ACCESSIBILITY TRIGGER: Displaying GLOBAL_ACTION_NOTIFICATIONS.", "success");
        }
        break;
    }
  };

  // Drag handlers on mobile screen container to calculate manual Swipes
  const handleDragStart = (clientX: number, clientY: number) => {
    setTouchStart({ x: clientX, y: clientY });
    setSwipeFeedback("");
  };

  const handleDragEnd = (clientX: number, clientY: number) => {
    if (!touchStart) return;
    const deltaX = clientX - touchStart.x;
    const deltaY = clientY - touchStart.y;

    setTouchStart(null);
    const minThreshold = 40; // Pixels to distinguish swipe gesture in browser mockup

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minThreshold) {
        if (deltaX > 0) {
          setSwipeFeedback("DROITE 👉 (Verrouiller)");
          triggerGestureAction("lock", "Lock Screen Now");
        } else {
          setSwipeFeedback("GAUCHE 👈 (Power Menu)");
          triggerGestureAction("power", "Open Power Menu");
        }
      }
    } else {
      if (Math.abs(deltaY) > minThreshold) {
        if (deltaY > 0) {
          setSwipeFeedback("BAS 👇 (Notifications)");
          triggerGestureAction("notifications", "Expand Drawer");
        } else {
          setSwipeFeedback("HAUT 👆 (Screenshot)");
          triggerGestureAction("screenshot", "Trigger Screenshot");
        }
      }
    }
  };

  // Helper to copy file code
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(true);
    addLog(`COPIED CODEFILE: [${ANDROID_FILES[selectedFileIndex].name}] to Clipboard`, "success");
    setTimeout(() => setCopiedIndex(false), 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#050810] text-white flex flex-col font-sans overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* 1. MATRIX CYBER BG */}
      <MatrixBackground />

      {/* 2. DYNAMIC ACCENT OVERLAYS (LOCKS / DRAWER / MENUS) */}
      <SimulatedPowerMenu 
        isOpen={isPowerOpen} 
        onClose={() => setIsPowerOpen(false)} 
        addLog={addLog} 
      />
      <SimulatedNotificationDrawer 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
        addLog={addLog} 
      />
      <SimulatedLockScreen 
        isOpen={isLockOpen} 
        onClose={() => setIsLockOpen(false)} 
        addLog={addLog} 
      />
      <SimulatedScreenshotFlash 
        isOpen={isScreenshotOpen} 
        onClose={() => setIsScreenshotOpen(false)} 
        addLog={addLog} 
      />

      {/* 3. TERMINAL STATUS BAR - CYBERPUNK HUD HEADER */}
      <header className="border-b border-cyan-500/25 bg-[#070b14]/90 sticky top-0 z-40 backdrop-blur-md px-4 py-3 flex flex-wrap justify-between items-center gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute animate-ping inline-flex h-3 w-3 rounded-full bg-[#00FF41] opacity-75" />
            <div className={`p-1.5 rounded-lg border ${isSystemActive ? 'border-cyan-400 bg-cyan-950/20' : 'border-red-500 bg-red-950/20'}`}>
              <Cpu className={isSystemActive ? 'text-cyan-400 animate-pulse' : 'text-red-500'} size={18} />
            </div>
          </div>
          <div>
            <h1 className="font-orbitron font-black uppercase text-base text-white tracking-widest flex items-center gap-2">
              SWIPECONTROL
              <span className="text-[10px] py-0.5 px-2 rounded-full border border-cyan-500/30 text-cyan-400 font-mono">
                v1.0.4 // HUD
              </span>
            </h1>
            <p className="text-[10px] text-[#8892A4] font-mono leading-none tracking-normal">
              SYSTEM STATUS: {isSystemActive ? "ACTIVE // OVERLAY_CAPTURE_BOUND" : "STANDBY // BLOCKED"}
            </p>
          </div>
        </div>

        {/* Global tab nav buttons */}
        <div className="flex items-center gap-2 border border-slate-800 p-1 rounded-xl bg-black/40">
          <button 
            onClick={() => setActiveTab("simulator")}
            className={`px-4 py-1.5 rounded-lg font-orbitron font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "simulator" 
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Sliders size={13} />
            HUD Monitor
          </button>
          
          <button 
            onClick={() => {
              setActiveTab("code");
              addLog(`LOADED SOURCE VIEWER: Inspecting Android native classes.`, "info");
            }}
            className={`px-4 py-1.5 rounded-lg font-orbitron font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "code" 
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Code2 size={13} />
            Kotlin Source
          </button>

          <button 
            onClick={() => setActiveTab("spec")}
            className={`px-4 py-1.5 rounded-lg font-orbitron font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeTab === "spec" 
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/30" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Info size={13} />
            Android Specs
          </button>
        </div>

        {/* System telemetry info */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>MEM: 44.2 MB // CPU: 1.2%</span>
          </div>
          <div className="border-l border-slate-800 h-4" />
          <span>SYS_ALERT_WINDOW_ACTIVE</span>
        </div>
      </header>

      {/* 4. MAIN LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10">
        
        {/* ========================================================
            TAB 1: HUD SIMULATION MONITOR
            ======================================================== */}
        {activeTab === "simulator" && (
          <>
            {/* Left Column: Permissions Audit Guidance & Setup */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <section className="bg-[#070b14]/90 border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between backdrop-blur-sm">
                <div>
                  <div className="flex justify-between items-start mb-4 border-b border-cyan-500/10 pb-3">
                    <div>
                      <h2 className="font-orbitron font-black text-white text-sm uppercase tracking-widest flex items-center gap-2">
                        <Shield className="text-cyan-400" size={16} />
                        Android Permissions Guide
                      </h2>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Interactive steps required to activate gestures natively on Android
                      </p>
                    </div>
                    <span className="text-[10px] text-cyan-500 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded font-mono">
                      STEPS REQUIRED
                    </span>
                  </div>

                  <p className="text-xs text-[#8892A4] mb-4 leading-relaxed font-mono">
                    Android enforces strict sandboxes. For our floating overlay service (<span className="text-white font-bold">SwipeService</span>) to trace gestures and execute device-level commands, you must authorize the security gates below. Click indicators to override & grant manually:
                  </p>

                  <div className="space-y-3">
                    {PERMISSION_STEPS.slice(0, 3).map((step) => (
                      <div 
                        key={step.id}
                        className={`p-3 rounded-xl border transition-all duration-300 ${
                          permissions[step.key]
                            ? "bg-cyan-950/15 border-cyan-500/30 text-white"
                            : "bg-slate-900/35 border-slate-800/80 text-gray-400"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2.5 items-start">
                            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold font-mono text-[11px] border ${
                              permissions[step.key]
                                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                                : "bg-slate-800 border-slate-700 text-slate-400"
                            }`}>
                              {step.id}
                            </span>
                            <div>
                              <span className="text-xs font-bold uppercase tracking-wide block text-white">
                                {step.name}
                              </span>
                              <p className="text-[11px] text-[#8892A4] mt-1 font-mono">
                                {step.description}
                              </p>
                              <code className="text-[10px] text-purple-400 block mt-1 font-mono break-all font-light">
                                {step.androidPermission}
                              </code>
                            </div>
                          </div>

                          <button 
                            type="button"
                            onClick={() => togglePermission(step.key, step.name)}
                            className={`px-2.5 py-1 text-[10px] font-bold font-orbitron uppercase rounded tracking-wider transition-all cursor-pointer ${
                              permissions[step.key]
                                ? "bg-green-500/25 border border-green-400/40 text-[#00FF41]"
                                : "bg-red-500/15 border border-red-500/30 text-red-400"
                            }`}
                          >
                            {permissions[step.key] ? "GRANTED" : "REVOKE"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-3">
                  <AlertCircle size={16} className="text-purple-400 min-w-[16px]" />
                  <p className="text-[10px] text-purple-300 leading-normal font-mono">
                    NOTE: Enabling Step 1 (Overlay) lets <span className="text-white font-bold">WindowManager</span> detect swipes. Step 2 unlocks notifications and power dialogue triggers. Step 3 enables screen lock features.
                  </p>
                </div>
              </section>

              {/* Step checklist for optional Projection modules */}
              <section className="bg-[#070b14]/90 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-sm">
                <h3 className="font-orbitron font-black text-white text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sliders className="text-purple-400" size={14} />
                  Simulated Device Storage & Media
                </h3>
                <div className="space-y-2">
                  {PERMISSION_STEPS.slice(3, 6).map((step) => (
                    <div key={step.id} className="flex justify-between items-center p-2 bg-slate-900/30 rounded-lg border border-slate-800/50">
                      <div className="text-left">
                        <span className="text-xs text-slate-300 block">{step.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono break-all">{step.androidPermission}</span>
                      </div>
                      <button 
                        onClick={() => togglePermission(step.key, step.name)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          permissions[step.key] ? "bg-emerald-500/20 text-[#00FF41] border border-emerald-500/25" : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {permissions[step.key] ? "OK" : "DENIED"}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Interaction Arena & Gestures list */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Central Power trigger and phone mockup simulator */}
              <section className="bg-[#070b14]/90 border border-slate-800/80 p-6 rounded-3xl flex flex-col items-center justify-between min-h-[350px] relative backdrop-blur-sm overflow-hidden">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 font-mono text-[9px] text-gray-400 bg-black/40 border border-slate-800 px-2 py-1 rounded">
                  <div className={`w-1.5 h-1.5 rounded-full ${isSystemActive ? 'bg-cyan-400 animate-ping' : 'bg-red-500'}`} />
                  TEST PLAYGROUND
                </div>

                <div className="w-full text-center mb-4">
                  <h3 className="font-orbitron font-black text-white text-sm uppercase tracking-widest">
                    SYSTEM ACTIVATION TERMINAL
                  </h3>
                  <p className="text-[11px] text-[#8892A4] mt-1 font-mono">
                    Interact with the Core Toggle or perform mock swipes on the device
                  </p>
                </div>

                {/* Main Visual Arena Flexbox spacing */}
                <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1 my-2">
                  
                  {/* Left sub-column: Big Power Switch with Neon glowing ring */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center py-4">
                    <div className="relative flex items-center justify-center">
                      
                      {/* Pulsing ring outer */}
                      <div className={`absolute w-36 h-36 rounded-full border-2 border-dashed transition-all duration-1000 ${
                        isSystemActive 
                          ? "border-cyan-500/50 animate-spin-slow scale-110" 
                          : "border-red-500/30 scale-100"
                      }`} />

                      {/* Power glow circle */}
                      <div className={`p-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isSystemActive 
                          ? "border-cyan-400 bg-cyan-950/20 box-glow-cyan" 
                          : "border-red-500 bg-red-950/15 box-glow-red"
                      }`}>
                        <button 
                          onClick={() => {
                            const nextState = !isSystemActive;
                            setIsSystemActive(nextState);
                            addLog(`CORE TOGGLE TRIPPED: System ${nextState ? "ONLINE" : "OFFLINE"}`, nextState ? "success" : "error");
                          }}
                          className={`w-20 h-20 rounded-full flex flex-col items-center justify-center text-white transition-all cursor-pointer ${
                            isSystemActive ? "bg-cyan-500 text-black hover:bg-cyan-400" : "bg-red-500/90 hover:bg-red-400"
                          }`}
                        >
                          <Power size={32} className={isSystemActive ? "animate-pulse" : ""} />
                        </button>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <span className={`font-orbitron font-black text-sm tracking-widest ${isSystemActive ? "text-cyan-400 glow-cyan" : "text-red-500"}`}>
                        {isSystemActive ? "SYSTEM ACTIVE" : "SYSTEM OFFLINE"}
                      </span>
                      <p className="text-[10px] text-gray-500 font-mono mt-1 leading-tight">
                        {isSystemActive ? "Foreground overlay listener on" : "Gestures listener disabled"}
                      </p>
                    </div>
                  </div>

                  {/* Right sub-column: Interactive Mobile phone swipe simulator zone! */}
                  <div className="md:col-span-7 flex flex-col items-center justify-center">
                    
                    {/* Simulated Mobile Mock */}
                    <div 
                      className="relative w-56 h-[310px] rounded-[36px] border-4 border-slate-700 bg-[#02050b] flex flex-col justify-between p-4 overflow-hidden shadow-2xl focus-within:outline-none cursor-grab active:cursor-grabbing font-mono"
                      onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)}
                      onMouseUp={(e) => handleDragEnd(e.clientX, e.clientY)}
                      onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
                      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
                    >
                      {/* Top phone bezel/camera */}
                      <div className="flex justify-center w-full z-20">
                        <div className="w-16 h-4 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700 mr-2" />
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
                        </div>
                      </div>

                      {/* Active simulation display interface */}
                      <div className="relative flex-1 flex flex-col justify-between py-2 text-center select-none z-10">
                        <div className="text-slate-600 text-[8px] tracking-widest flex justify-between px-2">
                          <span>SwipeControl OS</span>
                          <span>9:57 AM</span>
                        </div>

                        {/* Mid swipe detector core visual */}
                        <div className="my-auto py-3">
                          <p className="text-[9px] text-[#8892A4] uppercase tracking-wider mb-2">Swipe gestures inside target phone</p>
                          
                          <div className="inline-flex p-3 rounded-full border border-slate-800/80 bg-slate-900/40 relative animate-pulse">
                            <Sliders className="text-cyan-500 font-bold" size={24} />
                          </div>

                          {swipeFeedback ? (
                            <div className="mt-3 bg-cyan-950/40 border border-cyan-400/50 p-1.5 rounded text-cyan-400 text-[10px] font-bold tracking-widest animate-bounce">
                              DETECTED: {swipeFeedback}
                            </div>
                          ) : (
                            <p className="text-[10px] text-cyan-500/60 mt-3 animate-pulse">
                              Drag mouse here in Up/Down/Left/Right paths!
                            </p>
                          )}
                        </div>

                        <div className="text-gray-600 text-[8px] flex justify-around mb-1">
                          <span>👈 Swipe Dialog</span>
                          <span>Swipe Lock 👉</span>
                        </div>
                      </div>

                      {/* Bottom notch navigation line */}
                      <div className="flex justify-center w-full pb-1 z-20">
                        <div className="w-24 h-1 bg-slate-700 rounded-full" />
                      </div>

                      {/* Simulated overlay grid indicators within phone frame */}
                      <div className="absolute inset-x-0 inset-y-12 grid grid-cols-2 grid-rows-2 opacity-5 pointer-events-none">
                        <div className="border-r border-b border-cyan-500 border-dashed" />
                        <div className="border-l border-b border-cyan-500 border-dashed" />
                        <div className="border-r border-t border-cyan-500 border-dashed" />
                        <div className="border-l border-t border-cyan-500 border-dashed" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guide overlay notification */}
                <div className="w-full flex items-center gap-2 mt-2 bg-purple-950/15 border border-purple-500/20 px-3 py-1.5 rounded-xl">
                  <Info className="text-purple-400 min-w-[14px]" size={14} />
                  <p className="text-[10.5px] text-[#8892A4] leading-normal font-mono text-left">
                    SwipeControl is currently simulating the background system context. Perform swiping in the phone, or click on standard layout list cards below to trigger gesture simulations directly!
                  </p>
                </div>
              </section>

              {/* 4 Gesture triggers in a 2x2 grid */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-orbitron font-black text-xs text-gray-400 uppercase tracking-widest">
                    Quick Action Triggers (Grid view)
                  </h4>
                  <span className="text-[10px] text-gray-500 font-mono">
                    CLICK TO EMULATE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {GESTURES_DATA.map((gesture: GestureCard) => {
                    return (
                      <button 
                        key={gesture.id}
                        type="button"
                        onClick={() => triggerGestureAction(gesture.id, gesture.actionName)}
                        className={`text-left p-4 rounded-2xl border flex flex-col justify-between gap-3 backdrop-blur-sm transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5 cursor-pointer ${gesture.colorClass}`}
                      >
                        {/* Circle glowing indicator on card margin */}
                        <div className="absolute top-4 right-4 flex items-center justify-center p-1 bg-black/40 rounded-full pointer-events-none border border-slate-800 group-hover:scale-110 transition-transform">
                          {gesture.id === "lock" && <Lock size={12} />}
                          {gesture.id === "power" && <Power size={12} />}
                          {gesture.id === "screenshot" && <Camera size={12} />}
                          {gesture.id === "notifications" && <Eye size={12} />}
                        </div>

                        <div>
                          <span className="text-[11px] font-mono tracking-wider font-bold">
                            {gesture.title}
                          </span>
                          <span className="text-sm font-orbitron font-black uppercase text-white block mt-1 tracking-wider">
                            {gesture.actionName}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#8892A4] leading-relaxed font-mono">
                          {gesture.actionDesc}
                        </p>

                        <div className="flex items-center gap-1.5 mt-1 border-t border-slate-900 pt-2 text-[10px] font-mono text-cyan-400 group-hover:gap-2 transition-all">
                          EMULATE TRIGGER ACTION
                          <ChevronRight size={10} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </>
        )}

        {/* ========================================================
            TAB 2: KOTLIN NATIVE SOURCE CODE CONSOLE
            ======================================================== */}
        {activeTab === "code" && (
          <div className="lg:col-span-12 flex flex-col lg:flex-row gap-6">
            
            {/* Left selector menu column */}
            <div className="lg:w-1/4 flex flex-col gap-4">
              <div className="bg-[#070b14]/90 border border-slate-800/80 p-4 rounded-2xl backdrop-blur-sm">
                <h3 className="font-orbitron font-black text-xs text-white uppercase tracking-widest pl-1 mb-4 flex items-center gap-2">
                  <Terminal className="text-purple-400 animate-pulse" size={14} />
                  Android Native Codebase
                </h3>
                <p className="text-[11px] text-gray-500 pl-1 leading-normal mb-4 font-mono">
                  Synthesized Kotlin classes and XML resources for direct APK assembly in Android Studio.
                </p>

                <div className="space-y-1.5">
                  {ANDROID_FILES.map((file, idx) => (
                    <button 
                      key={file.name}
                      onClick={() => {
                        setSelectedFileIndex(idx);
                        addLog(`LOADED FILE PREVIEW: Inspecting [${file.name}] code block.`, "info");
                      }}
                      className={`w-full text-left p-3 rounded-xl border font-mono text-xs transition-all flex items-center justify-between gap-1 cursor-pointer ${
                        selectedFileIndex === idx
                          ? "bg-purple-950/20 border-purple-500 text-purple-300 font-bold"
                          : "bg-transparent border-slate-800/70 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="truncate text-left pr-2">
                        <span className="block font-bold">{file.name}</span>
                        <span className="text-[9px] text-slate-500 lowercase block truncate">{file.path}</span>
                      </div>
                      <ChevronRight size={12} className={selectedFileIndex === idx ? "text-purple-400" : "text-gray-600"} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Technical description block */}
              <div className="bg-[#070b14]/90 border border-slate-800/80 p-4 rounded-xl font-mono text-[11px] text-[#8892A4] space-y-3">
                <span className="text-white font-bold uppercase block border-b border-slate-800 pb-1.5">File Information</span>
                <p>{ANDROID_FILES[selectedFileIndex].description}</p>
                <div className="text-[10px] text-gray-500 space-y-1">
                  <div>• Path: <code className="text-purple-300 break-all">{ANDROID_FILES[selectedFileIndex].path}</code></div>
                  <div>• Format: <span className="text-cyan-400 uppercase font-black">{ANDROID_FILES[selectedFileIndex].language}</span></div>
                </div>
              </div>
            </div>

            {/* Right code text previewer panel */}
            <div className="lg:w-3/4 flex flex-col gap-3">
              <div className="bg-[#02050b] border-2 border-slate-800/80 p-4 rounded-2xl flex flex-col h-[520px] shadow-2xl relative">
                
                {/* Code Header bar with copy command */}
                <div className="flex justify-between items-center bg-[#070c14] border border-slate-800 px-4 py-2.5 rounded-xl mb-4 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span className="font-bold text-gray-300 truncate tracking-wide max-w-sm">
                      {ANDROID_FILES[selectedFileIndex].path}
                    </span>
                  </div>

                  <button 
                    onClick={() => copyToClipboard(ANDROID_FILES[selectedFileIndex].code)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 border border-purple-500 hover:bg-purple-500 transition-all text-white font-bold rounded-lg cursor-pointer text-[11px] font-orbitron uppercase tracking-widest text-shadow"
                  >
                    {copiedIndex ? (
                      <>
                        <Check size={12} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                {/* Preformatted code region */}
                <div className="flex-1 overflow-auto bg-[#040810] border border-slate-900 rounded-xl p-4 font-mono select-text text-gray-300 text-xs leading-5">
                  <pre className="text-left w-full h-full font-light whitespace-pre">
                    <code>
                      {ANDROID_FILES[selectedFileIndex].code}
                    </code>
                  </pre>
                </div>

                <div className="absolute bottom-6 right-8 opacity-60 pointer-events-none text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                  SwipeControl Code-Desk 1.0.4 // SECURED
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 3: ANDROID SYSTEM DECK / SPECIFICATION SUMMARY
            ======================================================== */}
        {activeTab === "spec" && (
          <div className="lg:col-span-12 flex flex-col gap-6">
            <div className="bg-[#070b14]/90 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-sm">
              <h2 className="font-orbitron font-black text-xl text-white uppercase tracking-widest mb-4 border-b border-cyan-500/10 pb-3 flex items-center gap-2">
                <Sliders className="text-cyan-400" size={20} />
                NATIVE GESTURES & INTENT ACTION BLUEPRINTS
              </h2>

              <p className="text-sm text-[#8892A4] font-mono mb-6 leading-relaxed">
                Learn how the Android architecture operates inside <span className="text-white font-bold">WindowManager</span> and the accessibility layers. To convert this code into an active executable APK, compile these files into standard Android project directory layout using target Android SDK 36 and Gradle Kotlin DSL build configurations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs text-left">
                
                {/* Gestures Details panel */}
                <div className="p-5 rounded-2xl border border-slate-800 bg-[#02050b]/60">
                  <h3 className="font-orbitron font-bold text-cyan-400 uppercase tracking-wider mb-3 block border-b border-slate-900 pb-2">
                    ⚡ Gesture Event Receivers
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-white font-bold uppercase block text-[11px] flex items-center gap-1 text-red-400">
                        <ArrowRight size={13} />
                        Right Swipe → Lock Device
                      </span>
                      <p className="text-[#8892A4] mt-1 leading-normal pl-4">
                        Dispatches the DevicePolicyManager instance command <code className="text-gray-300">lockNow()</code> directly. Android forces user registration under Device Administration rules to invoke hardware lock calls safely.
                      </p>
                    </div>

                    <div>
                      <span className="text-white font-bold uppercase block text-[11px] flex items-center gap-1 text-purple-400">
                        <ArrowLeft size={13} />
                        Left Swipe → Open Power Dialog
                      </span>
                      <p className="text-[#8892A4] mt-1 leading-normal pl-4">
                        Issues a System Accessibility event through <code className="text-gray-300">performGlobalAction(GLOBAL_ACTION_POWER_DIALOG)</code>. It runs seamlessly over any application on Android without bringing down your frame.
                      </p>
                    </div>

                    <div>
                      <span className="text-white font-bold uppercase block text-[11px] flex items-center gap-1 text-cyan-400">
                        <ArrowUp size={13} />
                        Up Swipe → Instant Screen Capture
                      </span>
                      <p className="text-[#8892A4] mt-1 leading-normal pl-4">
                        Sets up a Foreground Service projection media pipeline using Android's <code className="text-gray-300">MediaProjectionManager</code>, capturing digital layout pixels and writing them smoothly to local Storage folders.
                      </p>
                    </div>

                    <div>
                      <span className="text-white font-bold uppercase block text-[11px] flex items-center gap-1 text-emerald-400">
                        <ArrowDown size={13} />
                        Down Swipe → Expand Alerts Center
                      </span>
                      <p className="text-[#8892A4] mt-1 leading-normal pl-4">
                        Triggers system action <code className="text-gray-300">GLOBAL_ACTION_NOTIFICATIONS</code> via the Bound Accessibility Daemon, pulling down the alerts drawer instantly from any nested view channel.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tech specification constraints */}
                <div className="p-5 rounded-2xl border border-slate-800 bg-[#02050b]/60 flex flex-col justify-between">
                  <div>
                    <h3 className="font-orbitron font-bold text-purple-400 uppercase tracking-wider mb-3 block border-b border-slate-900 pb-2">
                      ⚙️ Hardware Spec Metrics
                    </h3>

                    <div className="space-y-2 text-[#8892A4]">
                      <div className="flex justify-between py-1 border-b border-slate-900/60 font-light">
                        <span>Min SDK Support</span>
                        <span className="text-white font-bold font-mono">Android 10.0 (API 29)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900/60 font-light">
                        <span>Target SDK Compilation</span>
                        <span className="text-white font-bold font-mono">Android 14.1 (API 34)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900/60 font-light">
                        <span>Development Framework</span>
                        <span className="text-white font-bold font-mono">Kotlin 2.2.0 + Compose UI</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900/60 font-light">
                        <span>Foreground Priority Status</span>
                        <span className="text-white font-bold font-mono">START_STICKY Foreground</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-900/60 font-light">
                        <span>Swipe Detector Threshold</span>
                        <span className="text-white font-bold font-mono">100 DIP swipe drag minimum</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Core placeholder details */}
                  <div className="mt-6 p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex gap-4 items-center">
                    <div className="w-12 h-12 bg-slate-900 rounded border border-purple-500/50 flex flex-wrap p-1 gap-1 items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-cyan-400" />
                      <div className="w-2.5 h-2.5 bg-slate-900" />
                      <div className="w-2.5 h-2.5 bg-cyan-400" />
                      <div className="w-2.5 h-2.5 bg-cyan-400" />
                      <div className="w-2.5 h-2.5 bg-cyan-400" />
                      <div className="w-2.5 h-2.5 bg-cyan-400" />
                    </div>
                    <div>
                      <span className="font-orbitron font-bold text-white text-xs block uppercase">Export Target Archive</span>
                      <p className="text-[10px] text-gray-400 font-mono leading-normal mt-1">
                        Use the export feature in the top menu settings to grab a complete standalone bundle zip containing native Gradle blueprints.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* 5. RETRO TERMINAL LOG CONSOLE (Scroll logs tracing events) */}
      <footer className="border-t border-slate-800 bg-[#02050b]/90 p-4 font-mono z-10 select-none">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          
          {/* Header detail */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 tracking-wider">
                SWIPECONTROL REALTIME DIAGNOSTICS CHANNEL
              </span>
            </div>
            
            <button 
              onClick={() => {
                setLogs([]);
                addLog("LOG RETRACTED. RESTART TRACE LOGS CONSOLE CHANNEL.", "success");
              }}
              className="px-2 py-0.5 border border-slate-800 text-[9px] uppercase tracking-wider hover:border-cyan-500/50 hover:text-cyan-400 rounded transition-all cursor-pointer"
            >
              Clear Logs
            </button>
          </div>

          {/* Scroller */}
          <div className="h-28 overflow-y-auto space-y-1.5 scrollbar text-[11px] leading-relaxed select-text pr-1 text-left">
            {logs.map((log, idx) => {
              let color = "text-gray-400";
              if (log.type === "success") color = "text-[#00FF41] font-bold";
              if (log.type === "warning") color = "text-yellow-400 font-bold";
              if (log.type === "error") color = "text-red-500 font-bold";
              
              return (
                <div key={idx} className="flex gap-3 font-mono">
                  <span className="text-slate-600 block shrink-0">{log.timestamp}</span>
                  <span className="text-purple-500 font-bold block shrink-0">[KERN]</span>
                  <span className={`${color} block flex-1 break-all`}>{log.message}</span>
                </div>
              );
            })}
            <div ref={logsEndRef} />
          </div>

          {/* Layout Footer legal lines */}
          <div className="border-t border-slate-900/80 pt-2.5 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <span>SWIPECONTROL CAPABLE APPLET v1.0.4</span>
              <span className="border-l border-slate-800 h-3" />
              <span>CRAFTED CYBERPUNK HUD THEME</span>
            </div>
            <span>© 2026 SWIPECONTROL DAEMON. ALL RIGHTS PRIVILEGED.</span>
          </div>

        </div>
      </footer>
    </div>
  );
}

