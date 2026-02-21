package com.jfleets.driver

import android.content.Context
import androidx.activity.ComponentActivity
import com.jfleets.driver.config.AppConfig
import com.jfleets.driver.config.messagingHubUrl
import com.jfleets.driver.config.signalRHubUrl
import com.jfleets.driver.service.LocationService
import com.jfleets.driver.service.AndroidNetworkMonitor
import com.jfleets.driver.service.NetworkMonitor
import com.jfleets.driver.service.auth.AuthService
import com.jfleets.driver.service.createAndroidDataStore
import com.jfleets.driver.service.messaging.MessagingService
import com.jfleets.driver.service.realtime.SignalRService
import com.jfleets.driver.util.BarcodeScannerLauncher
import com.jfleets.driver.util.CameraLauncher
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module

private var koinInitialized = false

fun initKoin(activity: ComponentActivity) {
    if (koinInitialized) {
        return
    }

    // Create launchers before Koin initialization (must happen in onCreate before setContent)
    val cameraLauncher = CameraLauncher(activity)
    val barcodeScannerLauncher = BarcodeScannerLauncher(activity)

    startKoin {
        androidLogger()
        androidContext(activity)
        modules(
            // Android-specific module (must be loaded first to provide PreferencesManager)
            androidModule(cameraLauncher, barcodeScannerLauncher),
            commonModule()
        )
    }

    koinInitialized = true
}

private fun androidModule(
    cameraLauncher: CameraLauncher,
    barcodeScannerLauncher: BarcodeScannerLauncher
) = module {
    single { createAndroidDataStore(get<Context>()) }
    single { AuthService(AppConfig.identityServerUrl, get()) }
    single { SignalRService(AppConfig.signalRHubUrl, get()) }
    single { MessagingService(AppConfig.messagingHubUrl, get()) }
    singleOf(::LocationService)
    single<NetworkMonitor> { AndroidNetworkMonitor(get()) }

    // Platform-specific launchers
    single { cameraLauncher }
    single { barcodeScannerLauncher }
}
