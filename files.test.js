const cp = require("child_process");
const fs = require("fs");
const { promisify } = require("util");

const exec = promisify(cp.exec);
const exists = promisify(fs.exists);

describe("files", () => {
  let results;
  beforeAll(async () => {
    results = await exec("node . Sample Course");
  });
  afterAll(async () => {
    await exec("rm -Rf ./sample-course");
  });
  it("creates the correct directory", async () => {
    const result = await exists("./sample-course");
    expect(result).toEqual(true);
  });
});
