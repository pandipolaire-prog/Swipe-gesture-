import { AndroidFile } from "../types";

export const ANDROID_FILES: AndroidFile[] = [
  {
    name: "MainActivity.kt",
    path: "app/src/main/java/com/cyberpunk/swipecontrol/MainActivity.kt",
    language: "kotlin",
    description: "The primary UI landing screen written in Jetpack Compose, showing system status, instructions, and managing permissions.",
    code: `package com.cyberpunk.swipecontrol

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.app.admin.DevicePolicyManager
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.style.TextAlign
import kotlinx.coroutines.delay

class MainActivity : ComponentActivity() {

    private lateinit var devicePolicyManager: DevicePolicyManager
    private lateinit var compName: ComponentName

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        devicePolicyManager = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        compName = ComponentName(this, MyDeviceAdminReceiver::class.java)

        setContent {
            SwipeControlTheme {
                MainContentScreen(
                    onToggleService = { activate ->
                        if (activate) {
                            startSwipeService()
                        } else {
                            stopSwipeService()
                        }
                    },
                    onRequestOverlay = { requestOverlayPermission() },
                    onRequestAccessibility = { openAccessibilitySettings() },
                    onRequestAdmin = { requestDeviceAdmin() }
                )
            }
        }
    }

    private fun startSwipeService() {
        if (!Settings.canDrawOverlays(this)) {
            Toast.makeText(this, "Permission Overlay requise !", Toast.LENGTH_SHORT).show()
            return
        }
        val intent = Intent(this, SwipeService::class.java)
        startForegroundService(intent)
        Toast.makeText(this, "Service de swipe activé !", Toast.LENGTH_SHORT).show()
    }

    private fun stopSwipeService() {
        val intent = Intent(this, SwipeService::class.java)
        stopService(intent)
        Toast.makeText(this, "Service arrêté", Toast.LENGTH_SHORT).show()
    }

    private fun requestOverlayPermission() {
        if (!Settings.canDrawOverlays(this)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            startActivity(intent)
        }
    }

    private fun openAccessibilitySettings() {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        startActivity(intent)
    }

    private fun requestDeviceAdmin() {
        val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN).apply {
            putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, compName)
            putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Requis pour verrouiller l'écran instantanément avec le Swipe Droite.")
        }
        startActivity(intent)
    }
}

@Composable
fun MainContentScreen(
    onToggleService: (Boolean) -> Unit,
    onRequestOverlay: () -> Unit,
    onRequestAccessibility: () -> Unit,
    onRequestAdmin: () -> Unit
) {
    // Statut local pour simulation réactive
    var isSystemActive by remember { mutableStateOf(false) }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = Color(0xFF050810) // Noir Profond Cyberpunk
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Statut Terminal Header
            Text(
                text = "SWIPECONTROL v1.0 // SYSTEM ACTIVE",
                color = Color(0xFF00F5FF), // Cyan électrique
                fontFamily = FontFamily.Monospace,
                fontSize = 12.sp,
                modifier = Modifier.padding(bottom = 24.dp)
            )

            // Bouton central de type Power (Visual unique)
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(200.dp)
                    .clip(CircleShape)
                    .background(Color(0xFF0A0F1D))
                    .border(2.dp, if (isSystemActive) Color(0xFF00F5FF) else Color(0xFFEF4444), CircleShape)
            ) {
                Button(
                    onClick = {
                        isSystemActive = !isSystemActive
                        onToggleService(isSystemActive)
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                    modifier = Modifier.fillMaxSize()
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = if (isSystemActive) "SYSTEM" else "SYSTEM",
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = if (isSystemActive) "ACTIVE" else "OFFLINE",
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Black,
                            fontSize = 24.sp,
                            color = if (isSystemActive) Color(0xFF00FF41) else Color(0xFFEF4444)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Liste de guides de permissions
            LazyColumn(
                modifier = Modifier.fillMaxWidth().weight(1f),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                item {
                    PermissionCard(
                        title = "1. Superposition d'écran (Overlay)",
                        desc = "Nécessaire pour intercepter les swipes n'importe où sur l'écran d'Android.",
                        onClick = onRequestOverlay
                    )
                }
                item {
                    PermissionCard(
                        title = "2. Service d'accessibilité",
                        desc = "Nécessaire pour déclencher l'ouverture du dialogue d'alimentation et des notifications.",
                        onClick = onRequestAccessibility
                    )
                }
                item {
                    PermissionCard(
                        title = "3. Administrateur de l'appareil",
                        desc = "Requis pour verrouiller l'écran instantanément suite au balayage vers la droite.",
                        onClick = onRequestAdmin
                    )
                }
            }
        }
    }
}

@Composable
fun PermissionCard(title: String, desc: String, onClick: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF0D1527))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(title, color = Color(0xFF00F5FF), fontWeight = FontWeight.Bold)
            Text(desc, color = Color(0xFF8892A4), fontSize = 13.sp, modifier = Modifier.padding(vertical = 8.dp))
            Button(
                onClick = onClick,
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF9D00FF))
            ) {
                Text("Vérifier / Configurer", color = Color.White)
            }
        }
    }
}

@Composable
fun SwipeControlTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = Color(0xFF00F5FF),
            secondary = Color(0xFF9D00FF),
            background = Color(0xFF050810)
        ),
        content = content
    )
}
`
  },
  {
    name: "SwipeService.kt",
    path: "app/src/main/java/com/cyberpunk/swipecontrol/SwipeService.kt",
    language: "kotlin",
    description: "An Android Foreground Service running in background that injects an overlay window to capture touch gestures across all apps.",
    code: `package com.cyberpunk.swipecontrol

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.PixelFormat
import android.os.Build
import android.os.IBinder
import android.view.GestureDetector
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.WindowManager
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import androidx.core.app.NotificationCompat
import kotlin.math.abs

class SwipeService : Service() {

    private lateinit var windowManager: WindowManager
    private lateinit var overlayView: View
    private lateinit var gestureDetector: GestureDetector
    private lateinit var devicePolicyManager: DevicePolicyManager
    private lateinit var adminComponent: ComponentName

    companion object {
        private const val NOTIFICATION_ID = 404
        private const val CHANNEL_ID = "swipe_control_channel"
        private const val SWIPE_THRESHOLD = 100
        private const val SWIPE_VELOCITY_THRESHOLD = 100
    }

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        devicePolicyManager = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        adminComponent = ComponentName(this, MyDeviceAdminReceiver::class.java)

        createNotificationChannel()
        startForeground(NOTIFICATION_ID, createNotification())

        setupOverlayWindow()
    }

    private fun setupOverlayWindow() {
        gestureDetector = GestureDetector(this, SwipeGestureListener())

        // Invisible transparent overlay wrapping the full screen
        overlayView = View(this).apply {
            setOnTouchListener { _, event ->
                gestureDetector.onTouchEvent(event)
                // Return true to consume all touches or false depending on pass-through requirement
                // Note: To capture swipes without blocking buttons behind, layout parameters must be combined carefully
                false 
            }
        }

        val layoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            } else {
                WindowManager.LayoutParams.TYPE_PHONE
            },
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
            PixelFormat.TRANSLUCENT
        )

        layoutParams.gravity = Gravity.TOP or Gravity.LEFT
        windowManager.addView(overlayView, layoutParams)
    }

    private inner class SwipeGestureListener : GestureDetector.SimpleOnGestureListener() {
        override fun onDown(e: MotionEvent): Boolean = true

        override fun onFling(
            e1: MotionEvent?,
            e2: MotionEvent,
            velocityX: Float,
            velocityY: Float
        ): Boolean {
            if (e1 == null) return false
            val diffY = e2.y - e1.y
            val diffX = e2.x - e1.x

            if (abs(diffX) > abs(diffY)) {
                if (abs(diffX) > SWIPE_THRESHOLD && abs(velocityX) > SWIPE_VELOCITY_THRESHOLD) {
                    if (diffX > 0) {
                        onSwipeRight()
                    } else {
                        onSwipeLeft()
                    }
                    return true
                }
            } else {
                if (abs(diffY) > SWIPE_THRESHOLD && abs(velocityY) > SWIPE_VELOCITY_THRESHOLD) {
                    if (diffY > 0) {
                        onSwipeDown()
                    } else {
                        onSwipeUp()
                    }
                    return true
                }
            }
            return false
        }
    }

    private fun onSwipeRight() {
        // LOCK DEVICE (DeviceAdmin required)
        val active = devicePolicyManager.isAdminActive(adminComponent)
        if (active) {
            devicePolicyManager.lockNow()
        } else {
            sendBroadcastToActivity("REQUIRE_ADMIN_PERMISSION")
        }
    }

    private fun onSwipeLeft() {
        // OPEN POWER DIALOG (Accessibility Service required)
        val intent = Intent(this, MyAccessibilityService::class.java).apply {
            action = MyAccessibilityService.ACTION_TRIGGER_POWER_DIALOG
        }
        startService(intent)
    }

    private fun onSwipeUp() {
        // SCREENSHOT (Needs MediaProjection setup initiated in MainActivity or Service)
        // Here, notify or launch screenshot worker via MediaProjection
        sendBroadcastToActivity("TRIGGER_SCREENSHOT")
    }

    private fun onSwipeDown() {
        // OPEN NOTIFICATIONS WINDOW (Accessibility Service required)
        val intent = Intent(this, MyAccessibilityService::class.java).apply {
            action = MyAccessibilityService.ACTION_TRIGGER_NOTIFICATIONS
        }
        startService(intent)
    }

    private fun sendBroadcastToActivity(action: String) {
        val intent = Intent("SwipeControlUpdate").apply {
            putExtra("action", action)
        }
        sendBroadcast(intent)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "SwipeControl Service Actif",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Système de surveillance de superposition gestuelle"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("SwipeControl Système")
            .setContentText("Superposition gestuelle active en arrière-plan")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setOngoing(true)
            .build()
    }

    override fun onDestroy() {
        super.onDestroy()
        if (::overlayView.isInitialized) {
            windowManager.removeView(overlayView)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
`
  },
  {
    name: "MyAccessibilityService.kt",
    path: "app/src/main/java/com/cyberpunk/swipecontrol/MyAccessibilityService.kt",
    language: "kotlin",
    description: "Launches floating dialogs and pulls down standard drawer menus by executing global system actions on Android.",
    code: `package com.cyberpunk.swipecontrol

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent

class MyAccessibilityService : AccessibilityService() {

    companion object {
        const val ACTION_TRIGGER_POWER_DIALOG = "com.cyberpunk.swipecontrol.ACTION_POWER"
        const val ACTION_TRIGGER_NOTIFICATIONS = "com.cyberpunk.swipecontrol.ACTION_NOTIFICATIONS"
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        intent?.let {
            when (it.action) {
                ACTION_TRIGGER_POWER_DIALOG -> {
                    performGlobalAction(GLOBAL_ACTION_POWER_DIALOG)
                }
                ACTION_TRIGGER_NOTIFICATIONS -> {
                    performGlobalAction(GLOBAL_ACTION_NOTIFICATIONS)
                }
            }
        }
        return START_STICKY
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // No specific events to handle, we use manual trigger commands
    }

    override fun onInterrupt() {
        // System interrupted
    }
}
`
  },
  {
    name: "MyDeviceAdminReceiver.kt",
    path: "app/src/main/java/com/cyberpunk/swipecontrol/MyDeviceAdminReceiver.kt",
    language: "kotlin",
    description: "Subclass of DeviceAdminReceiver that permits the application to call the immediate LOCK_NOW terminal command.",
    code: `package com.cyberpunk.swipecontrol

import android.app.admin.DeviceAdminReceiver
import android.content.Context
import android.content.Intent
import android.widget.Toast

class MyDeviceAdminReceiver : DeviceAdminReceiver() {

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        Toast.makeText(context, "Privilèges Device Admin accordés !", Toast.LENGTH_SHORT).show()
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
        Toast.makeText(context, "Privilèges Device Admin révoqués !", Toast.LENGTH_SHORT).show()
    }
}
`
  },
  {
    name: "AndroidManifest.xml",
    path: "app/src/main/AndroidManifest.xml",
    language: "xml",
    description: "App configuration registering all background services, administrative listeners, accessibility system profiles and overlay privileges.",
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.cyberpunk.swipecontrol">

    <!-- Permissions requises -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" android:maxSdkVersion="29" />
    <uses-permission android:name="android.permission.BIND_ACCESSIBILITY_SERVICE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="SwipeControl"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.AppCompat.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Service principal de swipe avec superposition -->
        <service
            android:name=".SwipeService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="specialUse" />

        <!-- Service d'accessibilité -->
        <service
            android:name=".MyAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>

        <!-- Récepteur Administrateur de l'appareil (Verrouillage) -->
        <receiver
            android:name=".MyDeviceAdminReceiver"
            android:label="SwipeControl Admin Lock"
            android:permission="android.permission.BIND_DEVICE_ADMIN"
            android:exported="true">
            <meta-data
                android:name="android.app.device_admin"
                android:resource="@xml/device_admin_rules" />
            <intent-filter>
                <action android:name="android.app.action.DEVICE_ADMIN_ENABLED" />
            </intent-filter>
        </receiver>

    </application>
</manifest>
`
  },
  {
    name: "accessibility_service_config.xml",
    path: "app/src/main/res/xml/accessibility_service_config.xml",
    language: "xml",
    description: "System declaration for the MyAccessibilityService setup to enable notification panel interaction and power button overlay mapping.",
    code: `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeAllMask"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagDefault"
    android:canPerformGestures="false"
    android:canRetrieveWindowContent="false"
    android:description="@string/accessibility_desc" />
`
  }
];
