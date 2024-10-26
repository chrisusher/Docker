import { test, expect } from "../fixtures/todo-fixture";

test.describe("Editing", () => {
  test.beforeEach(async ({ toDoList, toDoController, localStorageClient }) => {
    await toDoController.createDefaultTodos(toDoList);
    await localStorageClient.checkNumberOfTodosInLocalStorage(3);
  });

  test("should hide other controls when editing", async ({ page, toDoList, localStorageClient }) => {
    const todoItem = page.getByTestId("todo-item").nth(1);
    await todoItem.dblclick();
    await expect(todoItem.getByRole("checkbox")).not.toBeVisible();
    await expect(
      todoItem.locator("label", {
        hasText: toDoList[1],
      })
    ).not.toBeVisible();
    await localStorageClient.checkNumberOfTodosInLocalStorage(3);
  });

  test("should save edits on blur", async ({ page, toDoList, localStorageClient }) => {
    const todoItems = page.getByTestId("todo-item");
    await todoItems.nth(1).dblclick();
    await todoItems
      .nth(1)
      .getByRole("textbox", { name: "Edit" })
      .fill("buy some sausages");
    await todoItems
      .nth(1)
      .getByRole("textbox", { name: "Edit" })
      .dispatchEvent("blur");

    await expect(todoItems).toHaveText([
      toDoList[0],
      "buy some sausages",
      toDoList[2],
    ]);
    await localStorageClient.checkTodosInLocalStorage("buy some sausages");
  });

  test("should trim entered text", async ({ page, toDoList, localStorageClient }) => {
    const todoItems = page.getByTestId("todo-item");
    await todoItems.nth(1).dblclick();
    await todoItems
      .nth(1)
      .getByRole("textbox", { name: "Edit" })
      .fill("    buy some sausages    ");
    await todoItems
      .nth(1)
      .getByRole("textbox", { name: "Edit" })
      .press("Enter");

    await expect(todoItems).toHaveText([
      toDoList[0],
      "buy some sausages",
      toDoList[2],
    ]);
    await localStorageClient.checkTodosInLocalStorage("buy some sausages");
  });

  test("should remove the item if an empty text string was entered", async ({
    page, toDoList
  }) => {
    const todoItems = page.getByTestId("todo-item");
    await todoItems.nth(1).dblclick();
    await todoItems.nth(1).getByRole("textbox", { name: "Edit" }).fill("");
    await todoItems
      .nth(1)
      .getByRole("textbox", { name: "Edit" })
      .press("Enter");

    await expect(todoItems).toHaveText([toDoList[0], toDoList[2]]);
  });

  test("should cancel edits on escape", async ({ page, toDoList }) => {
    const todoItems = page.getByTestId("todo-item");
    await todoItems.nth(1).dblclick();
    await todoItems
      .nth(1)
      .getByRole("textbox", { name: "Edit" })
      .fill("buy some sausages");
    await todoItems
      .nth(1)
      .getByRole("textbox", { name: "Edit" })
      .press("Escape");
    await expect(todoItems).toHaveText(toDoList);
  });
});
