package com.mobiletaskmanager

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Test
import org.junit.runner.RunWith

private const val INVALID_EMAIL = "not-an-email"
private const val WRONG_PASSWORD = "WrongPassword!"
private const val EMPTY = ""
private const val EDITED_EMAIL = "d"

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

  @Test
  fun TC_AUTH_004_loginBlockedWithEmptyEmailField() {
    launchAppForUiTest().use {
      LoginScreen.login(email = EMPTY, password = DemoCredentials.PASSWORD)

      LoginScreen.assertEmailValue(EMPTY)
      LoginScreen.assertEmailErrorVisible()
      LoginScreen.assertDisplayed()
    }
  }

  @Test
  fun TC_AUTH_005_loginBlockedWithEmptyPasswordField() {
    launchAppForUiTest().use {
      LoginScreen.login(email = DemoCredentials.EMAIL, password = EMPTY)

      LoginScreen.assertEmailValue(DemoCredentials.EMAIL)
      LoginScreen.assertPasswordErrorVisible()
      LoginScreen.assertDisplayed()
    }
  }

  @Test
  fun TC_AUTH_007_authErrorBannerDisappearsWhenUserEditsInput() {
    launchAppForUiTest().use {
      LoginScreen.login(email = DemoCredentials.EMAIL, password = WRONG_PASSWORD)
      LoginScreen.assertAuthErrorVisible()

      LoginScreen.typeEmail(EDITED_EMAIL)

      LoginScreen.assertEmailValue(EDITED_EMAIL)
      LoginScreen.assertAuthErrorNotVisible()
      LoginScreen.assertDisplayed()
    }
  }
}
