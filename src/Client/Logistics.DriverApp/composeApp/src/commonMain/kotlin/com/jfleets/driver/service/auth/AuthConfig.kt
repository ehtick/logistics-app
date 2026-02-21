package com.jfleets.driver.service.auth

import com.jfleets.driver.config.AppConfig

object AuthConfig {
    const val CLIENT_ID = "logistics.driverapp"
    val CLIENT_SECRET: String get() = AppConfig.clientSecret
    const val SCOPE = "openid profile offline_access roles tenant logistics.api.tenant"
}
