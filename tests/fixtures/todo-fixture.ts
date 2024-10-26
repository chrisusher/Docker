import { test as base, Page } from "@playwright/test";
import { ToDoController } from "../controllers/todo-controller";
import { LocalStorageClient } from "../clients/local-storage-client";

type ToDoFixture = {
  localStorageClient: LocalStorageClient;
  page: Page;
  toDoList: Array<string>;
  toDoController: ToDoController;
};

export const test = base.extend<ToDoFixture>({
  localStorageClient: async ({ page }, use) => {
    await use(new LocalStorageClient(page));
  },
  page: async ({page}, use) => {
    await page.goto("https://demo.playwright.dev/todomvc");
    await use(page);
  },
  toDoController: async ({ page }, use) => {
    const todoController = new ToDoController(page);
    await use(todoController);
  },
  toDoList: async ({}, use) => {
    await use([
      "buy some cheese",
      "feed the cat",
      "book a doctors appointment",
    ]);
  },
});

export { expect } from "@playwright/test";
