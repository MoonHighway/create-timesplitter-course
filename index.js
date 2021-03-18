#! /usr/bin/env node
const path = require("path");
const fs = require("fs");
const cp = require("child_process");
const { ncp } = require("ncp");
const { promisify } = require("util");

const [, , ...dirName] = process.argv;
const targetName = dirName.join(" ");
const directoryName = targetName.toLowerCase().replace(/ /g, "-");

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const copyDir = promisify(ncp);
const exec = promisify(cp.exec);

ncp.limit = 16;

if (!dirName.length) {
  throw new Error(
    "You must provide a course name: create-timesplitter-course <COURSE_NAME>"
  );
}

if (directoryName.length >= 50) {
  throw new Error(
    `The title "${targetName}" is too long. There is a 50 character limit to course titles`
  );
}

main().catch((error) => console.error("\n\n    ", error.message));

async function main() {
  const target = path.join(process.cwd(), directoryName);
  const source = path.join(__dirname, "StarterCourse");
  const pkg = path.join(process.cwd(), directoryName, "package.json");
  const content = path.join(process.cwd(), directoryName, "timesplitter.json");

  if (fs.existsSync(target)) {
    throw new Error(`The directory ${directoryName} already exists.`);
  }

  console.log(`
  
  
  Creating Course Directory... 
  ${target}`);
  await copyDir(source, target);

  let contentJSON = JSON.parse(await readFile(content));
  let packageJSON = JSON.parse(await readFile(pkg));

  packageJSON.name = directoryName;
  contentJSON.title = targetName;

  packageJSON = JSON.stringify(packageJSON, null, 2);
  contentJSON = JSON.stringify(contentJSON, null, 2);

  console.log(`  Saving Config Files...`);
  await Promise.all([
    writeFile(content, contentJSON, "UTF-8"),
    writeFile(pkg, packageJSON, "UTF-8"),
  ]);

  console.log(`  Installing Dependencies`);
  await exec(`cd ${directoryName}; npm i; cd ..;`);

  console.log(`
  
    Directory Created - navigate to the directory
    cd ${directoryName};
  
    Running Timesplitter
    npm start

    Running Timesplitter Course Builder
    npn run develop

  `);
}
