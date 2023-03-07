import { assert } from "chai";
import { db } from "../src/models/db.js";
import { testPlacemarks, secretPlacemark } from "./fixtures.js";
import { assertSubset } from "./test-utils.js";

suite("Placemark Model tests", () => {
  setup(async () => {
    db.init();
    await db.placemarkStore.deleteAllPlacemarks();
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testPlacemarks[i] = await db.placemarkStore.addPlacemark(testPlacemarks[i]);
    }
  });

  test("delete all placemarks", async () => {
    let returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 3);
    await db.placemarkStore.deleteAllPlacemarks();
    returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 0);
  });

  test("get a placemark - success", async () => {
    const placemark = await db.placemarkStore.addPlacemark(secretPlacemark);
    const returnedPlacemarks = await db.placemarkStore.getPlacemarkById(placemark._id);
    assertSubset(secretPlacemark, returnedPlacemarks);
  });

  test("delete One placemark - success", async () => {
    const id = testPlacemarks[0]._id;
    await db.placemarkStore.deletePlacemark(id);
    const returnedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length - 1);
    const deletedPlacemark = await db.placemarkStore.getPlacemarkById(id);
    assert.isNull(deletedPlacemark);
  });

  test("get a placemark - bad params", async () => {
    assert.isNull(await db.placemarkStore.getPlacemarkById(""));
    assert.isNull(await db.placemarkStore.getPlacemarkById());
  });

  test("delete One placemark - fail", async () => {
    await db.placemarkStore.deletePlacemark("bad-id");
    const allPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(testPlacemarks.length, allPlacemarks.length);
  });
});
