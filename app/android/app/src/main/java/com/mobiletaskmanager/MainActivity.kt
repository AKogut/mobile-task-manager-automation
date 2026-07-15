package com.mobiletaskmanager

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "MobileTaskManager"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      object : DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled) {
        override fun getLaunchOptions(): Bundle {
          val intent = this@MainActivity.intent
          return Bundle().apply {
            putBoolean(PROP_IS_UI_TEST, intent?.getBooleanExtra(EXTRA_UI_TEST, false) == true)
            putBoolean(
                PROP_IS_UI_TEST_AUTHED,
                intent?.getBooleanExtra(EXTRA_UI_TEST_AUTHED, false) == true,
            )
            putString(PROP_UI_TEST_TASKS, intent?.getStringExtra(EXTRA_UI_TEST_TASKS) ?: "")
          }
        }
      }

  private companion object {
    const val EXTRA_UI_TEST = "uitest"
    const val EXTRA_UI_TEST_AUTHED = "uitest-authed"
    const val EXTRA_UI_TEST_TASKS = "uitest-tasks"
    const val PROP_IS_UI_TEST = "isUITest"
    const val PROP_IS_UI_TEST_AUTHED = "isUITestAuthed"
    const val PROP_UI_TEST_TASKS = "uiTestTasks"
  }
}
