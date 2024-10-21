import { test, expect } from '@playwright/test';
import { APP_URL, MONTHS } from '../constants';
import {addDays, formatDate} from '../helpers';

// locators
const locationField = "#bigsearch-query-location-input";
const datesField = 'structured-search-input-field-split-dates-0';
const guestButton = "structured-search-input-field-guests-button";

// Get the current date
const currentDate = new Date();

// Calculate the future dates
const datePlus7 = addDays(currentDate, 7); // Date + 7 days
const datePlus14 = addDays(currentDate, 14); // Date + 14 days

// Format the dates
const checkinDate = formatDate(datePlus7);
const checkoutDate = formatDate(datePlus14);

const checkinDay = datePlus7.getDate();
const checkinMonth = datePlus7.getMonth() + 1;
const checkoutDay = datePlus14.getDate();
const checkoutMonth = datePlus14.getMonth() + 1;

test.beforeEach(async ({ page }) => {
  await page.goto(APP_URL);

  await page.locator(locationField).fill('Rome, Italy');
  await page.getByTestId(datesField).click();
  await page.getByTestId(checkinDate).click();
  await page.getByTestId(checkoutDate).click();
  await page.getByTestId(guestButton).click();
  await page.getByTestId("stepper-adults-increase-button").click();
  await page.getByTestId("stepper-adults-increase-button").click();
  await page.getByTestId("stepper-children-increase-button").click();
  await page.getByTestId("structured-search-input-search-button").click();
});

test('Test 1: Verify that the results match the search criteria'
  , async ({ page }) => {

  await expect(page.getByTestId('little-search-location')).toContainText('Rome');
  await expect(page.getByTestId('little-search-date')).toContainText(String(checkinDay));
  await expect(page.getByTestId('little-search-date')).toContainText(String(checkoutDay));
  await expect(page.getByTestId('little-search-date')).toContainText(MONTHS[checkinMonth]);
  await expect(page.getByTestId('little-search-date')).toContainText(MONTHS[checkoutMonth]);
  await expect(page.getByTestId('little-search-guests')).toContainText('3');
  await expect(page.getByTestId('stays-page-heading')).toContainText('Rome');
});

test('Test 2: Verify that the results and details page match the extra filters'
  , async ({ page }) => {
    const desiredBedrooms = 5

    await page.getByTestId('category-bar-filter-button').click();
    await page.getByTestId('stepper-filter-item-min_bedrooms-stepper-increase-button').click();
    await page.getByTestId('stepper-filter-item-min_bedrooms-stepper-increase-button').click();
    await page.getByTestId('stepper-filter-item-min_bedrooms-stepper-increase-button').click();
    await page.getByTestId('stepper-filter-item-min_bedrooms-stepper-increase-button').click();
    await page.getByTestId('stepper-filter-item-min_bedrooms-stepper-increase-button').click();
    await page.getByText('Show more').click();
    await page.locator('#filter-item-amenities-7').click();
    await page.locator ("//div[contains(@class, 'ptiimno atm_7l_1p8m8iw dir dir-ltr')]").click();
    await page.waitForTimeout(5000);

    const cardContainers = await page.locator('[data-testid="card-container"]').all();
   
      for (let i = 0; i < cardContainers.length; i++) {
        const card = cardContainers[i];
        const textContent = await card.textContent();

        if (textContent &&  textContent.includes('·') && textContent.includes('bedroom')){
          const textSplit = textContent.split('·')
          const indexOfBedrooms = textSplit[1].indexOf("bedroom") 
          const substringBeforeWord = textSplit[1].slice(0, indexOfBedrooms).trim();
          const numberOfBedrooms = parseInt(substringBeforeWord, 10);
          expect (desiredBedrooms<=numberOfBedrooms)
        
      }
      else{
        console.log("Ford the following property the number of bedroom doesn't appear in descriprion, therefore,other test will be created to check it, ", textContent)
      }
    }
    //Open first selection
    await cardContainers[0].click();
    await page.waitForTimeout(5000);
    await page.click('//span[svg//path[@d="m6 6 20 20M26 6 6 26"]]');
    await page.waitForTimeout(5000);
   
  });