import { test, expect } from "../fixtures/todo-fixture";

test.describe("Clear completed button", () => {
  test.beforeEach(async ({ toDoList, toDoController }) => {
    await toDoController.createDefaultTodos(toDoList);
  });

  test("should display the correct text", async ({ page }) => {
    await page.locator(".todo-list li .toggle").first().check();
    await expect(
      page.getByRole("button", { name: "Clear completed" })
    ).toBeVisible();
  });

  test("should remove completed items when clicked", async ({ page, toDoList }) => {
    const todoItems = page.getByTestId("todo-item");
    await todoItems.nth(1).getByRole("checkbox").check();
    await page.getByRole("button", { name: "Clear completed" }).click();
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText([toDoList[0], toDoList[2]]);
  });

  test("should be hidden when there are no items that are completed", async ({
    page,
  }) => {
    await page.locator(".todo-list li .toggle").first().check();
    await page.getByRole("button", { name: "Clear completed" }).click();
    await expect(
      page.getByRole("button", { name: "Clear completed" })
    ).toBeHidden();
  });
});