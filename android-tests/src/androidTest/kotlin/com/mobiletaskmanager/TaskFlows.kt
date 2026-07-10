package com.mobiletaskmanager

data class TaskSpec(
    val title: String,
    val priority: String = "medium",
    val quickDate: String = "today",
    val completed: Boolean = false,
)

object TaskFlows {

  const val SAMPLE_TITLE = "Buy groceries"
  const val SAMPLE_DESCRIPTION = "Milk, eggs, and bread"
  const val SAMPLE_PRIORITY = "high"
  const val SAMPLE_QUICK_DATE = "tomorrow"

  fun createTask(
      title: String,
      description: String? = null,
      priority: String = SAMPLE_PRIORITY,
      quickDate: String = SAMPLE_QUICK_DATE,
  ) {
    HomeScreen.waitForScreen()
    HomeScreen.tapAddTask()
    TaskFormScreen.fillAndSubmit(
        title = title,
        description = description,
        priority = priority,
        quickDate = quickDate,
    )
    TaskDetailsScreen.waitForScreen()
  }

  fun createSampleTask() {
    createTask(title = SAMPLE_TITLE, description = SAMPLE_DESCRIPTION)
  }

  fun seedTasks(specs: List<TaskSpec>) {
    specs.forEach { spec ->
      createTask(title = spec.title, priority = spec.priority, quickDate = spec.quickDate)
      if (spec.completed) {
        TaskDetailsScreen.tapComplete()
        TaskDetailsScreen.assertStatus(TaskDetailsScreen.STATUS_COMPLETED)
      }
      TaskDetailsScreen.tapHome()
      HomeScreen.waitForScreen()
    }
  }
}
