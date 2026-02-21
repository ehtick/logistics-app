package com.jfleets.driver.viewmodel

import com.jfleets.driver.api.DriverApi
import com.jfleets.driver.api.LoadApi
import com.jfleets.driver.api.bodyOrThrow
import com.jfleets.driver.api.models.ConfirmLoadStatusCommand
import com.jfleets.driver.api.models.LoadDto
import com.jfleets.driver.api.models.LoadStatus
import com.jfleets.driver.model.getGoogleMapsUrl
import com.jfleets.driver.util.Logger
import com.jfleets.driver.viewmodel.base.BaseViewModel
import com.jfleets.driver.viewmodel.base.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class LoadDetailViewModel(
    private val loadApi: LoadApi,
    private val driverApi: DriverApi,
    private val loadId: String
) : BaseViewModel() {

    private val _uiState = MutableStateFlow<UiState<LoadDto>>(UiState.Loading)
    val uiState: StateFlow<UiState<LoadDto>> = _uiState.asStateFlow()

    init {
        loadDetails()
    }

    private fun loadDetails() {
        launchWithState(_uiState) {
            loadApi.getLoadById(loadId).bodyOrThrow()
        }
    }

    fun confirmPickup() {
        launchSafely(onError = { e ->
            Logger.e("Failed to confirm pickup for load $loadId: ${e.message}", e)
        }) {
            driverApi.confirmLoadStatus(
                ConfirmLoadStatusCommand(loadId = loadId, loadStatus = LoadStatus.PICKED_UP)
            ).bodyOrThrow()
            loadDetails()
        }
    }

    fun confirmDelivery() {
        launchSafely(onError = { e ->
            Logger.e("Failed to confirm delivery for load $loadId: ${e.message}", e)
        }) {
            driverApi.confirmLoadStatus(
                ConfirmLoadStatusCommand(loadId = loadId, loadStatus = LoadStatus.DELIVERED)
            ).bodyOrThrow()
            loadDetails()
        }
    }

    fun refresh() {
        loadDetails()
    }

    fun getGoogleMapsUrl(load: LoadDto): String = load.getGoogleMapsUrl()
}
