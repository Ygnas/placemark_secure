import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPlacemarks, secretPlacemark, category, testCategory } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Placemark Model tests", () => {

  let categoryList = null;

  setup(async () => {
    db.init();
    await db.categoryStore.deleteAllCategories();
    await db.placemarkStore.deleteAllPlacemarks();
    categoryList = await db.categoryStore.addCategory(category);
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPlacemarks[i] = await db.placemarkStore.addPlacemark(categoryList._id, testPlacemarks[i]);
    }
  });

  test("create single placemark", async () => {
    const catList = await db.categoryStore.addCategory(category);
    const placemark = await db.placemarkStore.addPlacemark(catList._id, secretPlacemark)
    assert.isNotNull(placemark._id);
    assertSubset (secretPlacemark, placemark);
  });

  test("create multiple placemarkApi", async () => {
    const placemarks = await db.categoryStore.getCategoryById(categoryList._id);
    assert.equal(testPlacemarks.length, testPlacemarks.length)
  });

  test("get a placemark - success", async () => {
    const catList = await db.categoryStore.addCategory(category);
    const placemark = await db.placemarkStore.addPlacemark(catList._id, secretPlacemark)
    const newPlacemark = await db.placemarkStore.getPlacemarkById(placemark._id);
    assertSubset (secretPlacemark, newPlacemark);
  });

  test("delete One Placemark - success", async () => {
    const id = testPlacemarks[0]._id;
    await db.placemarkStore.deletePlacemark(id);
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(placemarks.length, testCategory.length - 1);
    const deletedPlacemark = await db.placemarkStore.getPlacemarkById(id);
    assert.isNull(deletedPlacemark);
  });

  test("get a category - bad params", async () => {
    assert.isNull(await db.placemarkStore.getPlacemarkById(""));
    assert.isNull(await db.placemarkStore.getPlacemarkById());
  });

  test("delete One User - fail", async () => {
    await db.placemarkStore.deletePlacemark("bad-id");
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(placemarks.length, testCategory.length);
  });
  
  test("delete all placemarkApi", async () => {
    const placemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(testPlacemarks.length, placemarks.length);
    await db.placemarkStore.deleteAllPlacemarks();
    const newPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(0, newPlacemarks.length);
  });
});
