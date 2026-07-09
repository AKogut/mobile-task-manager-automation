package com.mobiletaskmanager

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith

private const val INVALID_EMAIL = "not-an-email"

@RunWith(AndroidJUnit4::class)
class LoginScreenTest {

  @Test
  fun TC_AUTH_012_unauthenticatedUserLandsOnLoginScreen() {
    launchAppForUiTest().use { LoginScreen.assertDisplayed() }
  }

  @Test
  fun TC_AUTH_008_demoCredentialsCardIsVisible() {
    launchAppForUiTest().use {
      LoginScreen.waitForScreen()

      LoginScreen.assertDemoCredentials()
    }
  }

  @Test
  fun TC_AUTH_006_loginBlockedWithInvalidEmailFormat() {
    launchAppForUiTest().use {
      LoginScreen.login(email = INVALID_EMAIL, password = DemoCredentials.PASSWORD)

      LoginScreen.assertEmailValue(INVALID_EMAIL)
      LoginScreen.assertEmailErrorVisible()
      LoginScreen.assertDisplayed()
    }
  }
}
