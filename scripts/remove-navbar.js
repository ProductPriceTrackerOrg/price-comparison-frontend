// This script will remove the NavigationBar component from all non-home pages

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

// Process a file to remove NavigationBar component
function processFile(filePath) {
  // Skip the home page (page.tsx in the root app directory)
  if (filePath === path.join(appDirectory, "page.tsx")) {
    return false;
  }

  const content = fs.readFileSync(filePath, "utf8");
  let modified = content;

  // Remove NavigationBar import
  modified = modified.replace(
    /import\s+{\s*NavigationBar\s*}\s+from\s+["']@\/components\/layout\/navigation-bar["'];?\n?/g,
    ""
  );

  // Handle combined imports
  modified = modified.replace(
    /import\s+{\s*([^}]*),\s*NavigationBar\s*,\s*([^}]*)\s*}\s+from\s+["']@\/components\/layout\/navigation-bar["'];?\n?/g,
    (match, p1, p2) => {
      // If there are other components, keep the import but remove NavigationBar
      if (p1.trim() || p2.trim()) {
        return `import { ${p1}${
          p1.trim() && p2.trim() ? ", " : ""
        }${p2} } from "@/components/layout/navigation-bar";\n`;
      }
      // If NavigationBar was the only component, remove the whole import
      return "";
    }
  );

  // Remove NavigationBar component in JSX
  modified = modified.replace(/<NavigationBar\s*\/>\n?/g, "");

  // If changes were made, write the file
  if (modified !== content) {
    console.log(`Removing NavigationBar from: ${filePath}`);
    fs.writeFileSync(filePath, modified, "utf8");
    return true;
  }

  return false;
}

// Find all tsx files in the app directory
const files = findFiles(appDirectory);

// Process each file
let modifiedCount = 0;
files.forEach((file) => {
  if (processFile(file)) {
    modifiedCount++;
  }
});

console.log(`Removed NavigationBar from ${modifiedCount} files.`);
