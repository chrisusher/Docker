import { test, expect } from "../fixtures/todo-fixture";

test.describe("New Todo", () => {
  test("should allow me to add todo items", async ({
    page,
    toDoList,
    localStorageClient,
  }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");

    // Create 1st todo.
    await newTodo.fill(toDoList[0]);
    await newTodo.press("Enter");

    // Make sure the list only has one todo item.
    await expect(page.getByTestId("todo-title")).toHaveText([toDoList[0]]);

    // Create 2nd todo.
    await newTodo.fill(toDoList[1]);
    await newTodo.press("Enter");

    // Make sure the list now has two todo items.
    await expect(page.getByTestId("todo-title")).toHaveText([
      toDoList[0],
      toDoList[1],
    ]);

    await localStorageClient.checkNumberOfTodosInLocalStorage(2);
  });

  test("should clear text input field when an item is added", async ({
    page,
    toDoList,
    localStorageClient,
  }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");

    // Create one todo item.
    await newTodo.fill(toDoList[0]);
    await newTodo.press("Enter");

    // Check that input is empty.
    await expect(newTodo).toBeEmpty();
    await localStorageClient.checkNumberOfTodosInLocalStorage(1);
  });

  test("should append new items to the bottom of the list", async ({
    page,
    toDoList,
    toDoController,
    localStorageClient,
  }) => {
    // Create 3 items.
    await toDoController.createDefaultTodos(toDoList);

    // create a todo count locator
    const todoCount = page.getByTestId("todo-count");

    // Check test using different methods.
    await expect(page.getByText("3 items left")).toBeVisible();
    await expect(todoCount).toHaveText("3 items left");
    await expect(todoCount).toContainText("3");
    await expect(todoCount).toHaveText(/3/);

    // Check all items in one call.
    await expect(page.getByTestId("todo-title")).toHaveText(toDoList);
    await localStorageClient.checkNumberOfTodosInLocalStorage(3);
  });
});
