export interface GestureCard {
  id: string;
  direction: "UP" | "DOWN" | "LEFT" | "RIGHT";
  title: string;
  actionName: string;
  actionDesc: string;
  colorClass: string; // Tailwind color variable matching our palette
  accentColor: string; // hex
  arrowIcon: string;
}

export interface PermissionStep {
  id: number;
  key: "OVERLAY" | "ACCESSIBILITY" | "DEVICE_ADMIN" | "MEDIA_PROJECTION" | "STORAGE" | "FOREGROUND";
  name: string;
  androidPermission: string;
  description: string;
  requiredFor: string;
  isOptional: boolean;
  docUrl?: string;
}

export interface SystemLog {
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "code";
}

export interface AndroidFile {
  name: string;
  path: string;
  code: string;
  language: string;
  description: string;
}
