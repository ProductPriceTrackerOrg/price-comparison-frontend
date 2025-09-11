// This script will identify and clean up redundant Header and Footer components
// since they're now included in the root layout.

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const appDirectory = path.join(__dirname, '../app');

// Function to recursively find all .tsx files
function findFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(findFiles(filePath));
    } else {
      // Only include .tsx files
      if (path.extname(file) === '.tsx') {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Find all tsx files in the app directory
const files = findFiles(appDirectory);

// Process each file
files.forEach(file => {
  // Skip the root layout file since we've already modified it
  if (file.includes('layout.tsx') && path.dirname(file) === appDirectory) {
    return;
  }

  // Read the file
  const content = fs.readFileSync(file, 'utf8');
  let modified = content;
  
  // Remove Header and Footer imports
  modified = modified.replace(/import\s+{\s*Header\s*}\s+from\s+["']@\/components\/layout\/header["'];?\n?/g, '');
  modified = modified.replace(/import\s+{\s*Footer\s*}\s+from\s+["']@\/components\/layout\/footer["'];?\n?/g, '');
  
  // Handle combined imports
  modified = modified.replace(/import\s+{\s*([^}]*),\s*Header\s*,\s*([^}]*)\s*}\s+from\s+["']@\/components\/layout\/header["'];?\n?/g, 
    (match, p1, p2) => `import { ${p1}, ${p2} } from "@/components/layout/header";\n`);
  modified = modified.replace(/import\s+{\s*([^}]*),\s*Footer\s*,\s*([^}]*)\s*}\s+from\s+["']@\/components\/layout\/footer["'];?\n?/g,
    (match, p1, p2) => `import { ${p1}, ${p2} } from "@/components/layout/footer";\n`);
  
  // Remove Header and Footer components in JSX (careful with this, might need manual review)
  modified = modified.replace(/<Header\s*\/>\n?/g, '');
  modified = modified.replace(/<Footer\s*\/>\n?/g, '');
  
  // If changes were made, write the file
  if (modified !== content) {
    console.log(`Updating: ${file}`);
    fs.writeFileSync(file, modified, 'utf8');
  }
});

console.log('Done cleaning up Header and Footer components.');
