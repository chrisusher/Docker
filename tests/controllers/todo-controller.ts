import { Page } from "@playwright/test";

export class ToDoController {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async createDefaultTodos(todoList: Array<string>): Promise<void> {
    const newTodo = this.page.getByPlaceholder("What needs to be done?");

    for (const item of todoList) {
      await newTodo.fill(item);
      await newTodo.press("Enter");
    }
  }
}
