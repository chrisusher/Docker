import { test, expect } from "../fixtures/todo-fixture";

test.describe("Persistence", () => {
  test("should persist its data", async ({ page, toDoList, localStorageClient }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");

    for (const item of toDoList.slice(0, 2)) {
      await newTodo.fill(item);
      await newTodo.press("Enter");
    }

    const todoItems = page.getByTestId("todo-item");
    const firstTodoCheck = todoItems.nth(0).getByRole("checkbox");
    await firstTodoCheck.check();
    await expect(todoItems).toHaveText([toDoList[0], toDoList[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(["completed", ""]);

    // Ensure there is 1 completed item.
    await localStorageClient.checkNumberOfCompletedTodosInLocalStorage(1);

    // Now reload.
    await page.reload();
    await expect(todoItems).toHaveText([toDoList[0], toDoList[1]]);
    await expect(firstTodoCheck).toBeChecked();
    await expect(todoItems).toHaveClass(["completed", ""]);
  });
});