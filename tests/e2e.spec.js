// @ts-check
const { test, expect } = require('@playwright/test');
const { ONE_MINUTE_IN_MILISECS, wait } = require('./util/time');

const APP_URL = 'http://localhost:8080';
test.describe.configure({ mode: 'serial' });
test.setTimeout(10 * ONE_MINUTE_IN_MILISECS);

test('Page load', async ({ page }) => {
  await page.goto(APP_URL);
  await expect(page).toHaveTitle('Javascript made simple!');
});

test('Creates todo', async ({ page }) => {
  const todoText = 'Buy some groceries';
  await page.goto(APP_URL);
  await wait(500);
  await page.getByPlaceholder('New Todo').fill(todoText);
  await wait(100);
  await page.getByText('Save').click();
  await wait(300);
  await expect(page.getByText(todoText)).toBeVisible();
});

test('Cancels todo creation', async ({ page }) => {
  const todoText = 'Buy some groceries canceled';
  await page.goto(APP_URL);
  await wait(500);
  await page.getByPlaceholder('New Todo').fill(todoText);
  await wait(100);
  await page.getByText('Cancel').click();
  await wait(300);
  await expect(page.getByText(todoText)).toBeHidden();
});

test('Creates todo, editsit and, after, deletes it', async ({ page }) => {
  const todoText = 'Buy some groceries to update it';
  await page.goto(APP_URL);
  await wait(500);
  await page.getByPlaceholder('New Todo').fill(todoText);
  await wait(100);
  await page.getByText('Save').click();
  await wait(300);
  await expect(page.getByText(todoText)).toBeVisible();
  await page.locator('.todo-list-app-todo-list-crud-list-ul-li-action').first().click();
  await wait(500);
  const updatedText = todoText + 'updated';
  await page.locator('input').first().fill(updatedText);
  await wait(500);
  await page.getByText('Save').click();
  await wait(500);
  await expect(page.getByText(updatedText)).toBeVisible();
  await wait(500);
  await page.locator('.todo-list-app-todo-list-crud-list-ul-li-action').last().click();
  await wait(500);
  await expect(page.getByText(updatedText)).toBeHidden();
  await expect(page.getByText('No items have been created yet.')).toBeVisible();
});