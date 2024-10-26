import { test, expect } from "../fixtures/todo-fixture";

test.describe("Routing", () => {
  test.beforeEach(async ({ toDoList, toDoController, localStorageClient }) => {
    await toDoController.createDefaultTodos(toDoList);
    // make sure the app had a chance to save updated todos in storage
    // before navigating to a new view, otherwise the items can get lost :(
    // in some frameworks like Durandal
    await localStorageClient.checkTodosInLocalStorage(toDoList[0]);
  });

  test("should allow me to display active items", async ({ page, toDoList, localStorageClient }) => {
    const todoItem = page.getByTestId("todo-item");
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();

    await localStorageClient.checkNumberOfCompletedTodosInLocalStorage(1);
    await page.getByRole("link", { name: "Active" }).click();
    await expect(todoItem).toHaveCount(2);
    await expect(todoItem).toHaveText([toDoList[0], toDoList[2]]);
  });

  test("should respect the back button", async ({ page, localStorageClient }) => {
    const todoItem = page.getByTestId("todo-item");
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();

    await localStorageClient.checkNumberOfCompletedTodosInLocalStorage(1);

    await test.step("Showing all items", async () => {
      await page.getByRole("link", { name: "All" }).click();
      await expect(todoItem).toHaveCount(3);
    });

    await test.step("Showing active items", async () => {
      await page.getByRole("link", { name: "Active" }).click();
    });

    await test.step("Showing completed items", async () => {
      await page.getByRole("link", { name: "Completed" }).click();
    });

    await expect(todoItem).toHaveCount(1);
    await page.goBack();
    await expect(todoItem).toHaveCount(2);
    await page.goBack();
    await expect(todoItem).toHaveCount(3);
  });

  test("should allow me to display completed items", async ({
    page,
    localStorageClient,
  }) => {
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();
    await localStorageClient.checkNumberOfCompletedTodosInLocalStorage(1);
    await page.getByRole("link", { name: "Completed" }).click();
    await expect(page.getByTestId("todo-item")).toHaveCount(1);
  });

  test("should allow me to display all items", async ({
    page,
    localStorageClient,
  }) => {
    await page.getByTestId("todo-item").nth(1).getByRole("checkbox").check();
    await localStorageClient.checkNumberOfCompletedTodosInLocalStorage(1);
    await page.getByRole("link", { name: "Active" }).click();
    await page.getByRole("link", { name: "Completed" }).click();
    await page.getByRole("link", { name: "All" }).click();
    await expect(page.getByTestId("todo-item")).toHaveCount(3);
  });

  test("should highlight the currently applied filter", async ({ page }) => {
    await expect(page.getByRole("link", { name: "All" })).toHaveClass(
      "selected"
    );

    //create locators for active and completed links
    const activeLink = page.getByRole("link", { name: "Active" });
    const completedLink = page.getByRole("link", { name: "Completed" });
    await activeLink.click();

    // Page change - active items.
    await expect(activeLink).toHaveClass("selected");
    await completedLink.click();

    // Page change - completed items.
    await expect(completedLink).toHaveClass("selected");
  });
});