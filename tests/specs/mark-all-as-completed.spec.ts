import { test, expect } from "../fixtures/todo-fixture";

test.describe("Mark all as completed", () => {
  test.beforeEach(async ({ toDoList, toDoController, localStorageClient }) => {
    await toDoController.createDefaultTodos(toDoList);
    await localStorageClient.checkNumberOfTodosInLocalStorage(3);
  });

  test.afterEach(async ({ localStorageClient }) => {
    await localStorageClient.checkNumberOfTodosInLocalStorage(3);
  });

  test("should allow me to mark all items as completed", async ({
    page,
    localStorageClient,
  }) => {
    // Complete all todos.
    await page.getByLabel("Mark all as complete").check();

    // Ensure all todos have 'completed' class.
    await expect(page.getByTestId("todo-item")).toHaveClass([
      "completed",
      "completed",
      "completed",
    ]);
    await localStorageClient.checkNumberOfCompletedTodosInLocalStorage(3);
  });

  test("should allow me to clear the complete state of all items", async ({
    page,
  }) => {
    const toggleAll = page.getByLabel("Mark all as complete");
    // Check and then immediately uncheck.
    await toggleAll.check();
    await toggleAll.uncheck();

    // Should be no completed classes.
    await expect(page.getByTestId("todo-item")).toHaveClass(["", "", ""]);
  });

  test("complete all checkbox should update state when items are completed / cleared", async ({
    page, localStorageClient
  }) => {
    const toggleAll = page.getByLabel("Mark all as complete");
    await toggleAll.check();
    await expect(toggleAll).toBeChecked();
    await localStorageClient.checkNumberOfCompletedTodosInLocalStorage(3);

    // Uncheck first todo.
    const firstTodo = page.getByTestId("todo-item").nth(0);
    await firstTodo.getByRole("checkbox").uncheck();

    // Reuse toggleAll locator and make sure its not checked.
    await expect(toggleAll).not.toBeChecked();

    await firstTodo.getByRole("checkbox").check();
    await localStorageClient.checkNumberOfCompletedTodosInLocalStorage(3);

    // Assert the toggle all is checked again.
    await expect(toggleAll).toBeChecked();
  });
});
