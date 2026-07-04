import { GestureCard, PermissionStep, SystemLog } from "../types";

export const GESTURES_DATA: GestureCard[] = [
  {
    id: "lock",
    direction: "RIGHT",
    title: "Swipe DROITE 👉",
    actionName: "Lock Screen Now",
    actionDesc: "Locks the screen instantly. Uses DevicePolicyManager via LOCK_NOW with custom admin privileges.",
    colorClass: "border-red-500 hover:shadow-red-500/20 text-red-400 bg-red-950/25",
    accentColor: "#EF4444",
    arrowIcon: "ArrowRight"
  },
  {
    id: "power",
    direction: "LEFT",
    title: "Swipe GAUCHE 👈",
    actionName: "Open Power Menu",
    actionDesc: "Spawns Android's device power Dialog instantly. Uses AccessibilityService with GLOBAL_ACTION_POWER_DIALOG.",
    colorClass: "border-[rgba(157,0,255,1)] hover:shadow-purple-500/20 text-purple-400 bg-purple-950/25",
    accentColor: "#9D00FF",
    arrowIcon: "ArrowLeft"
  },
  {
    id: "screenshot",
    direction: "UP",
    title: "Swipe HAUT 👆",
    actionName: "Trigger Screenshot",
    actionDesc: "Saves a device screen shot directly to user library. Uses MediaProjectionManager to capture frames.",
    colorClass: "border-[rgba(0,245,255,1)] hover:shadow-cyan-500/20 text-cyan-400 bg-cyan-950/25",
    accentColor: "#00F5FF",
    arrowIcon: "ArrowUp"
  },
  {
    id: "notifications",
    direction: "DOWN",
    title: "Swipe BAS 👇",
    actionName: "Expand Drawer",
    actionDesc: "Pulls down the system notification drawer instantly. Uses AccessibilityService with GLOBAL_ACTION_NOTIFICATIONS.",
    colorClass: "border-emerald-500 hover:shadow-emerald-500/20 text-emerald-400 bg-emerald-950/25",
    accentColor: "#10B981",
    arrowIcon: "ArrowDown"
  }
];

export const PERMISSION_STEPS: PermissionStep[] = [
  {
    id: 1,
    key: "OVERLAY",
    name: "System Overlay",
    androidPermission: "android.permission.SYSTEM_ALERT_WINDOW",
    description: "Allows the background window overlay to display above other apps.",
    requiredFor: "Core Gesture Interception & Background overlay service setup",
    isOptional: false,
    docUrl: "https://developer.android.com/reference/android/Manifest.permission#SYSTEM_ALERT_WINDOW"
  },
  {
    id: 2,
    key: "ACCESSIBILITY",
    name: "Accessibility Service",
    androidPermission: "android.permission.BIND_ACCESSIBILITY_SERVICE",
    description: "Gives permissions to trigger global system actions (notifications drawer, power dialog).",
    requiredFor: "Power Dialog (Swipe Left) & Notification Drawer (Swipe Down) triggers",
    isOptional: false,
    docUrl: "https://developer.android.com/reference/android/accessibilityservice/AccessibilityService"
  },
  {
    id: 3,
    key: "DEVICE_ADMIN",
    name: "Device Administrator",
    androidPermission: "android.app.admin.DeviceAdminReceiver",
    description: "Allows the app lock manager to lock the immediate hardware display dynamically.",
    requiredFor: "Lock Hardware Screen Now (Swipe Right) trigger via lockNow()",
    isOptional: false,
    docUrl: "https://developer.android.com/guide/topics/admin/device-admin"
  },
  {
    id: 4,
    key: "MEDIA_PROJECTION",
    name: "Media Projection Manager",
    androidPermission: "android.media.projection.MediaProjection",
    description: "Enables taking visual frame capture of current screen buffer smoothly.",
    requiredFor: "Grab screen captures (Swipe Up) to save in pictures gallery",
    isOptional: true
  },
  {
    id: 5,
    key: "STORAGE",
    name: "Save External Storage",
    androidPermission: "android.permission.WRITE_EXTERNAL_STORAGE",
    description: "Required when saving captured screenshots to standard DCIM layout below Android 10.",
    requiredFor: "Writing captured screenshots directly to the shared local storage",
    isOptional: true
  },
  {
    id: 6,
    key: "FOREGROUND",
    name: "Foreground Service Permissions",
    androidPermission: "android.permission.FOREGROUND_SERVICE",
    description: "Maintains high priority execution loop active when application process goes in background.",
    requiredFor: "Continuous swipe monitoring active when the screen is active",
    isOptional: false
  }
];

export const INITIAL_SYSTEM_LOGS: SystemLog[] = [
  { timestamp: "09:57:00", message: "BOOTING SWIPECONTROL KERNEL v1.0.4...", type: "info" },
  { timestamp: "09:57:01", message: "HOST OS: Android 14.0 // API LEVEL 34", type: "info" },
  { timestamp: "09:57:02", message: "INITIALIZING OVERLAY WINDOW SERVICE MANAGER...", type: "info" },
  { timestamp: "09:57:03", message: "SYSTEM SHIELDS LOADED. OVERLAYS DOCKED IN SANDBOX.", type: "success" },
  { timestamp: "09:57:04", message: "ACCESSIBILITY DAEMON LISTENING TO CHANNEL...", type: "warning" },
  { timestamp: "09:57:05", message: "SWIPECONTROL IS STANDBY. GESTURE ENGINE INITIALIZED.", type: "success" }
];
