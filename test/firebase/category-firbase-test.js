import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCategory, category } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Category Firebase tests", () => {

  setup(async () => {
    db.init("firebase");
    await db.categoryStore.deleteAllCategories();
    for (let i = 0; i < testCategory.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testCategory[i] = await db.categoryStore.addCategory(testCategory[i]);
    }
  });

  test("create a category", async () => {
    const categoryN = await db.categoryStore.addCategory(category);
    assertSubset(categoryN, category);
    assert.isDefined(categoryN._id);
  });

  test("get a category - success", async () => {
    const categoryN = await db.categoryStore.addCategory(category);
    const returnedCategory = await db.categoryStore.getCategoryById(category._id);
    assertSubset(categoryN, category);
  });

  test("delete One Playist - success", async () => {
    const id = testCategory[0]._id;
    await db.categoryStore.deleteCategoryById(id);
    const returnedCategorys = await db.categoryStore.getAllCategorys();
    console.log(returnedCategorys);
    assert.equal(returnedCategorys.size, testCategory.length - 1);
    const deletedCategory = await db.categoryStore.getCategoryById(id);
    assert.isNull(deletedCategory);
  });

  test("get a category - bad params", async () => {
    assert.isNull(await db.categoryStore.getCategoryById(""));
    assert.isNull(await db.categoryStore.getCategoryById());
  });

  test("delete One Category - fail", async () => {
    await db.categoryStore.deleteCategoryById("bad-id");
    const allCategorys = await db.categoryStore.getAllCategorys();
    assert.equal(testCategory.length, allCategorys.size);
  });

  test("delete all categorys", async () => {
    let returnedCategorys = await db.categoryStore.getAllCategorys();
    assert.equal(returnedCategorys.size, 3);
    await db.categoryStore.deleteAllCategories();
    returnedCategorys = await db.categoryStore.getAllCategorys();
    if (!returnedCategorys) {
      returnedCategorys = [];
      returnedCategorys.size = 0;
    }
    assert.equal(returnedCategorys.size, 0);
  });
});
