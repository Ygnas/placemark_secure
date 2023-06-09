import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { maggie, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("User Firebase tests", () => {
  setup(async () => {
    db.init("firebase");
    await db.userStore.deleteAll();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await db.userStore.addUser(testUsers[i]);
    }
  });

  test("create a user", async () => {
    const newUser = await db.userStore.addUser(maggie);
    assertSubset(maggie, newUser);
  });

  test("delete all users", async () => {
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.size, 3);
    await db.userStore.deleteAll();
    returnedUsers = await db.userStore.getAllUsers();
    if (!returnedUsers) {
      returnedUsers = [];
      returnedUsers.size = 0;
    }
    assert.equal(returnedUsers.size, 0);
  });

  test("get a user - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const userAndID = await db.userStore.getUserByEmail(user.email);
    const returnedUser1 = await db.userStore.getUserById(userAndID._id);
    assert.deepEqual(user, returnedUser1);
    const returnedUser2 = await db.userStore.getUserByEmail(user.email);
    assertSubset(user, returnedUser2);
  });

  test("get a user - bad params", async () => {
    assert.isNull(await db.userStore.getUserByEmail(""));
    assert.isNull(await db.userStore.getUserById(""));
    assert.isNull(await db.userStore.getUserById());
  });

  test("delete One User - fail", async () => {
    await db.userStore.deleteUserById("bad-id");
    const allUsers = await db.userStore.getAllUsers();
    assert.equal(testUsers.length, allUsers.size);
  });

  test("make user admin", async () => {
    await db.userStore.makeUserAdmin(testUsers[0]._id);
    const returnedUser = await db.userStore.getUserById(testUsers[0]._id);
    console.log(returnedUser)
    assert.isTrue(returnedUser.admin);
  });
});
