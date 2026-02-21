package com.jfleets.driver.viewmodel.base

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.launch

/**
 * Base ViewModel providing a consistent async loading pattern.
 * Subclasses can use [launchWithState] to run suspend blocks
 * with automatic Loading → Success/Error state transitions.
 */
abstract class BaseViewModel : ViewModel() {

    /**
     * Launch a suspend block that updates a [UiState] flow automatically:
     * sets Loading before execution, Success on completion, Error on failure.
     */
    protected fun <T> launchWithState(
        stateFlow: MutableStateFlow<UiState<T>>,
        block: suspend () -> T
    ) {
        viewModelScope.launch {
            stateFlow.value = UiState.Loading
            try {
                val result = block()
                stateFlow.value = UiState.Success(result)
            } catch (e: Exception) {
                stateFlow.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}
