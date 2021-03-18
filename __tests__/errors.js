const fs = require("fs");
const cp = require("child_process");
const { promisify } = require("util");

const exec = promisify(cp.exec);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);

describe("errors", () => {
  it("throws name not supplied error", async () => {
    try {
      await exec("node .");
    } catch (error) {
      expect(error.message).toMatch(
        /You must provide a course name: create-timesplitter-course <COURSE_NAME>/
      );
    }
  });

  it("throws name to long error", async () => {
    try {
      await exec(
        "node . this is going to be a name that is way too long because names cannot be longer that fifty characters"
      );
    } catch (error) {
      expect(error.message).toMatch(
        /The title \"this is going to be a name that is way too long because names cannot be longer that fifty characters\" is too long. There is a 50 character limit to course titles/
      );
    }
  });

  it("throws directory already exists error", async () => {
    await mkdir("./already-here");
    const { stderr } = await exec("node . Already Here");
    expect(stderr).toMatch(/The directory already-here already exists./);
    await rmdir("./already-here");
  });
});
