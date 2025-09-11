// This script will update all layout files to remove redundant padding and height settings
// since they're now included in the root layout.

const fs = require("fs");
const path = require("path");

const appDirectory = path.join(__dirname, "../app");

// Function to recursively find all layout.tsx files
function findLayoutFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(findLayoutFiles(filePath));
    } else {
      // Only include layout.tsx files (but not the root layout)
      if (file === "layout.tsx" && dir !== appDirectory) {
        results.push(filePath);
      }
    }
  });

  return results;
}

// Find all layout.tsx files in the app directory (excluding the root layout)
const layoutFiles = findLayoutFiles(appDirectory);

// Process each layout file
layoutFiles.forEach((file) => {
  // Read the file
  const content = fs.readFileSync(file, "utf8");

  // Remove min-h-screen and pt-16 from section or div elements
  let modified = content
    .replace(/(className=["'])min-h-screen(\s+pt-16)?([^"']*["'])/g, "$1$3")
    .replace(/(className=["'][^"']*)pt-16(\s+[^"']*["'])/g, "$1$2")
    .replace(/(className=["'][^"']*)(\s+)min-h-screen([^"']*["'])/g, "$1$2$3");

  // If changes were made, write the file
  if (modified !== content) {
    console.log(`Updating layout file: ${file}`);
    fs.writeFileSync(file, modified, "utf8");
  }
});

console.log("Done updating layout files.");
