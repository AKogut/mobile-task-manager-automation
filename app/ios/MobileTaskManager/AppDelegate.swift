import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    let arguments = ProcessInfo.processInfo.arguments
    let isUITest = arguments.contains("-uitest")
    let isUITestAuthed = arguments.contains("-uitest-authed")

    var uiTestTasks = ""
    if let flagIndex = arguments.firstIndex(of: "-uitest-tasks"),
       flagIndex + 1 < arguments.count {
      uiTestTasks = arguments[flagIndex + 1]
    }

    factory.startReactNative(
      withModuleName: "MobileTaskManager",
      in: window,
      initialProperties: [
        "isUITest": isUITest,
        "isUITestAuthed": isUITestAuthed,
        "uiTestTasks": uiTestTasks,
      ],
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
