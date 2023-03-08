import { EventEmitter } from "events";
import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, category, testCategory } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Category API tests", () => {
  let user = null;

  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllCategory();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    category.userid = user._id;
  });

  teardown(async () => {});

  test("create category", async () => {
    const returnedCategory = await placemarkService.createCategory(category);
    assert.isNotNull(returnedCategory);
    assertSubset(category, returnedCategory);
  });

  test("delete a category", async () => {
    const categoryN = await placemarkService.createCategory(category);
    const response = await placemarkService.deleteCategory(categoryN._id);
    assert.equal(response.status, 204);
    try {
      const returnedCategory = await placemarkService.getCategory(categoryN.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Category with this id", "Incorrect Response Message");
    }
  });

  test("create multiple categorys", async () => {
    for (let i = 0; i < testCategory.length; i += 1) {
      testCategory[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createCategory(testCategory[i]);
    }
    let returnedLists = await placemarkService.getAllCategorys();
    assert.equal(returnedLists.length, testCategory.length);
    await placemarkService.deleteAllCategory();
    returnedLists = await placemarkService.getAllCategorys();
    assert.equal(returnedLists.length, 0);
  });

  test("remove non-existant category", async () => {
    try {
      const response = await placemarkService.deleteCategory("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Category with this id", "Incorrect Response Message");
    }
  });
});
