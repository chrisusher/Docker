import { test, expect } from "../fixtures/todo-fixture";

test.describe("Counter", () => {
  test("should display the current number of todo items", async ({ page, toDoList, localStorageClient }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");

    // create a todo count locator
    const todoCount = page.getByTestId("todo-count");

    await newTodo.fill(toDoList[0]);
    await newTodo.press("Enter");

    await expect(todoCount).toContainText("1");

    await newTodo.fill(toDoList[1]);
    await newTodo.press("Enter");
    await expect(todoCount).toContainText("2");

    await localStorageClient.checkNumberOfTodosInLocalStorage(2);
  });
});
