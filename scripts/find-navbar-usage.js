// This script will identify all files that still have NavigationBar usage

const fs = require("fs");
const path = require("path");

const appDirectory = path.join(__dirname, "../app");

// Function to recursively find all .tsx files
function findFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(findFiles(filePath));
    } else {
      // Only include .tsx files
      if (path.extname(file) === ".tsx") {
        results.push(filePath);
      }
    }
  });

  return results;
}

// Check for NavigationBar usage in a file
function checkFile(filePath) {
  // Skip the home page (page.tsx in the root app directory)
  if (filePath === path.join(appDirectory, "page.tsx")) {
    return false;
  }

  const content = fs.readFileSync(filePath, "utf8");

  // Check if the file contains a NavigationBar component
  const hasNavBar = /<NavigationBar\s*\/>/g.test(content);

  // Also check for imports of NavigationBar
  const hasNavBarImport =
    content.includes("NavigationBar") &&
    (content.includes("@/components/layout/navigation-bar") ||
      content.includes("@/components/layout/navigation-bar"));

  return hasNavBar || hasNavBarImport;
}

// Find all tsx files in the app directory
const files = findFiles(appDirectory);

// Check each file
let filesToFix = [];
files.forEach((file) => {
  if (checkFile(file)) {
    const relativePath = path.relative(path.join(__dirname, ".."), file);
    filesToFix.push(relativePath);
  }
});

// Output the results
console.log("Files that still contain NavigationBar:");
filesToFix.forEach((file) => {
  console.log(`- ${file}`);
});

console.log(`\nTotal: ${filesToFix.length} files need to be fixed.`);
