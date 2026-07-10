package com.mobiletaskmanager

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith

private const val WRONG_PASSWORD = "WrongPassword!"
private const val UNREGISTERED_EMAIL = "unknown@example.com"
private const val AUTH_ERROR_MESSAGE = "Invalid email or password. Please try again."

@RunWith(AndroidJUnit4::class)
class AuthFlowTest {

  @Test
  fun TC_AUTH_001_successfulLoginWithValidCredentials() {
    launchAppForUiTest().use {
      LoginScreen.login(email = DemoCredentials.EMAIL, password = DemoCredentials.PASSWORD)

      HomeScreen.assertDisplayed()
      LoginScreen.assertAuthErrorNotVisible()
    }
  }

  @Test
  fun TC_AUTH_002_loginFailsWithIncorrectPassword() {
    launchAppForUiTest().use {
      LoginScreen.login(email = DemoCredentials.EMAIL, password = WRONG_PASSWORD)

      LoginScreen.assertAuthErrorVisible(AUTH_ERROR_MESSAGE)
      LoginScreen.assertDisplayed()
    }
  }

  @Test
  fun TC_AUTH_003_loginFailsWithUnregisteredEmail() {
    launchAppForUiTest().use {
      LoginScreen.login(email = UNREGISTERED_EMAIL, password = DemoCredentials.PASSWORD)

      LoginScreen.assertAuthErrorVisible(AUTH_ERROR_MESSAGE)
      LoginScreen.assertDisplayed()
    }
  }

  @Test
  fun TC_AUTH_009_successfulLogoutClearsSession() {
    launchHomeForUiTest().use {
      HomeScreen.openSettings()
      SettingsScreen.assertDisplayed()

      SettingsScreen.tapLogout()

      LoginScreen.assertDisplayed()
      HomeScreen.assertNotDisplayed()
    }
  }

  @Test
  fun TC_AUTH_010_settingsScreenDisplaysAccountInfo() {
    launchHomeForUiTest().use {
      HomeScreen.openSettings()

      SettingsScreen.assertDisplayed()
      SettingsScreen.assertAccountName(DemoCredentials.NAME)
      SettingsScreen.assertAccountEmail(DemoCredentials.EMAIL)
    }
  }
}
