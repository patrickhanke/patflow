package com.hgs_app_mobile

import android.content.Context
import android.content.res.Configuration
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import java.util.Locale

class MainActivity : ReactActivity() {

  override fun attachBaseContext(newBase: Context) {
    val locale = Locale.forLanguageTag("de-DE")
    Locale.setDefault(locale)
    val config = Configuration(newBase.resources.configuration)
    config.setLocale(locale)
    super.attachBaseContext(newBase.createConfigurationContext(config))
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "hgs_app_mobile"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
