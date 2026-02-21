package com.jfleets.driver.viewmodel

import com.jfleets.driver.api.UserApi
import com.jfleets.driver.api.bodyOrThrow
import com.jfleets.driver.api.models.UpdateUserCommand
import com.jfleets.driver.api.models.UserDto
import com.jfleets.driver.service.PreferencesManager
import com.jfleets.driver.viewmodel.base.ActionState
import com.jfleets.driver.viewmodel.base.BaseViewModel
import com.jfleets.driver.viewmodel.base.UiState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class AccountViewModel(
    private val userApi: UserApi,
    private val preferencesManager: PreferencesManager
) : BaseViewModel() {

    private val _uiState = MutableStateFlow<UiState<UserDto>>(UiState.Loading)
    val uiState: StateFlow<UiState<UserDto>> = _uiState.asStateFlow()

    private val _saveState = MutableStateFlow<ActionState<Unit>>(ActionState.Idle)
    val saveState: StateFlow<ActionState<Unit>> = _saveState.asStateFlow()

    init {
        loadUser()
    }

    private fun loadUser() {
        launchWithState(_uiState) {
            val userId = preferencesManager.getUserId()
            if (userId.isNullOrEmpty()) {
                throw IllegalStateException("User ID not available")
            }
            userApi.getUserById(userId).bodyOrThrow()
        }
    }

    fun updateUser(user: UserDto) {
        launchSafely(onError = { e ->
            _saveState.value = ActionState.Error(e.message ?: "Failed to save")
        }) {
            _saveState.value = ActionState.Loading
            val updateUserCommand = UpdateUserCommand(
                id = user.id,
                firstName = user.firstName,
                lastName = user.lastName,
                phoneNumber = user.phoneNumber
            )
            userApi.updateUser(user.id!!, updateUserCommand).bodyOrThrow()
            _uiState.value = UiState.Success(user)
            _saveState.value = ActionState.Success(Unit)
        }
    }

    fun resetSaveState() {
        _saveState.value = ActionState.Idle
    }
}
