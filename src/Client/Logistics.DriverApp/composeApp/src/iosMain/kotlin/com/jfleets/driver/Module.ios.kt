package com.jfleets.driver

import com.jfleets.driver.config.AppConfig
import com.jfleets.driver.config.messagingHubUrl
import com.jfleets.driver.config.signalRHubUrl
import com.jfleets.driver.service.LocationService
import com.jfleets.driver.service.IosNetworkMonitor
import com.jfleets.driver.service.NetworkMonitor
import com.jfleets.driver.service.auth.AuthService
import com.jfleets.driver.service.createIosDataStore
import com.jfleets.driver.service.messaging.MessagingService
import com.jfleets.driver.service.realtime.SignalRService
import org.koin.core.context.startKoin
import org.koin.core.module.dsl.singleOf
import org.koin.dsl.module

private var koinInitialized = false

fun initKoin() {
    if (koinInitialized) {
        return
    }

    startKoin {
        modules(
            iosModule,
            commonModule()
        )
    }
    koinInitialized = true
}

/**
 * Koin module for iOS-specific dependencies
 */
val iosModule = module {
    single { createIosDataStore() }
    single { AuthService(AppConfig.identityServerUrl, get()) }
    single<SignalRService> { SignalRService(AppConfig.signalRHubUrl, get()) }
    single { MessagingService(AppConfig.messagingHubUrl, get()) }
    singleOf(::LocationService)
    single<NetworkMonitor> { IosNetworkMonitor() }
}
