@file:OptIn(kotlin.time.ExperimentalTime::class)

package com.jfleets.driver.viewmodel

import com.jfleets.driver.api.LoadApi
import com.jfleets.driver.api.bodyOrThrow
import com.jfleets.driver.api.models.LoadDto
import com.jfleets.driver.viewmodel.base.BaseViewModel
import com.jfleets.driver.viewmodel.base.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlin.time.Clock
import kotlin.time.Duration.Companion.days

class PastLoadsViewModel(
    private val loadApi: LoadApi
) : BaseViewModel() {

    private val _uiState = MutableStateFlow<UiState<List<LoadDto>>>(UiState.Loading)
    val uiState: StateFlow<UiState<List<LoadDto>>> = _uiState.asStateFlow()

    init {
        loadPastLoads()
    }

    private fun loadPastLoads() {
        launchWithState(_uiState) {
            val now = Clock.System.now()
            val ninetyDaysAgo = now.minus(90.days)
            val response = loadApi.getLoads(
                onlyActiveLoads = false,
                startDate = ninetyDaysAgo,
                endDate = now
            ).bodyOrThrow()
            response?.items ?: emptyList()
        }
    }

    fun refresh() {
        loadPastLoads()
    }
}
