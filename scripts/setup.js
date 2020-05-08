const fs = require("fs");
const { exec } = require("child_process");

cleanRepo();

function cleanRepo() {
  fs.readFile(".git/config", "utf8", (_, data) => {
    if (isBoilerplateRepo(data)) {
      console.log("Creating new repository...");
      exec("rm -rf .git/");

      console.log("Creating new repository");
      exec('git init && git add . && git commit -m "Initial commit"');

      console.log("Installing dependencies...");
      exec("npm install");
    }
  });
}

function isBoilerplateRepo(data) {
  if (typeof data !== "string") return false;

  return (
    (data.match(/url\s*=/g) || []).length === 1 &&
    /newyork-anthonyng\/react-boilerplate\.git/.test(data)
  );
}
