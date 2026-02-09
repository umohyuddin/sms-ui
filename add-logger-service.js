const fs = require('fs');
const path = require('path');

// Get all .component.ts files
function getAllComponentFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(getAllComponentFiles(fullPath));
    } else if (item.name.endsWith('.component.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

function addLoggerService(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already has LoggerService
  if (content.includes('LoggerService')) {
    return { success: false, reason: 'already-has-logger' };
  }
  
  try {
    // Step 1: Add import statement
    if (!content.includes("import { LoggerService }")) {
      // Find where to insert the import - after core imports
      let importInsertPos = -1;
      const importRegex = /import\s+{[^}]*}\s+from\s+['"]\.\.\/\.\.\/\.\.\/core\/services\//g;
      let lastMatch;
      
      while ((lastMatch = importRegex.exec(content)) !== null) {
        importInsertPos = content.indexOf('\n', lastMatch.index) + 1;
      }
      
      // If no core service imports, add after angular imports
      if (importInsertPos === -1) {
        const angularImportRegex = /import\s+{[^}]*}\s+from\s+['"]@angular/g;
        let lastAngularMatch;
        while ((lastAngularMatch = angularImportRegex.exec(content)) !== null) {
          importInsertPos = content.indexOf('\n', lastAngularMatch.index) + 1;
        }
      }
      
      // If still not found, add at beginning after all imports
      if (importInsertPos === -1) {
        const firstClassMatch = content.match(/\n@Component/);
        if (firstClassMatch) {
          importInsertPos = firstClassMatch.index + 1;
        }
      }
      
      if (importInsertPos > 0) {
        const loggerImport = "import { LoggerService } from '../../../../core/services/logger.service';\n";
        content = content.slice(0, importInsertPos) + loggerImport + content.slice(importInsertPos);
      }
    }
    
    // Step 2: Add logger to constructor
    const constructorMatch = content.match(/constructor\s*\(([^)]*)\)/);
    if (constructorMatch) {
      const params = constructorMatch[1];
      if (!params.includes('private logger: LoggerService')) {
        const newParams = params.trim().endsWith(',') || params.trim() === '' 
          ? params + (params.trim() === '' ? '' : ' ') + 'private logger: LoggerService'
          : params + ', private logger: LoggerService';
        content = content.replace(/constructor\s*\([^)]*\)/, `constructor(${newParams})`);
      }
    }
    
    // Step 3: Add logging to ngOnInit
    const ngOnInitMatch = content.match(/ngOnInit\s*\(\)\s*{/);
    if (ngOnInitMatch) {
      const insertPos = ngOnInitMatch.index + ngOnInitMatch[0].length;
      const logStatement = '\n    this.logger.log("ngOnInit called", this.constructor.name);';
      content = content.slice(0, insertPos) + logStatement + content.slice(insertPos);
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    return { success: true };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}

// Main execution
const featuresDir = path.join(__dirname, 'src/app/features');
const files = getAllComponentFiles(featuresDir);

console.log(`Found ${files.length} component files`);

let updated = 0;
let skipped = 0;
let failed = [];
const categories = {};

for (const file of files) {
  const result = addLoggerService(file);
  
  if (result.success) {
    updated++;
    const category = file.split(path.sep).slice(-4, -1).join('/');
    categories[category] = (categories[category] || 0) + 1;
    console.log(`✓ ${path.basename(path.dirname(file))}`);
  } else if (result.reason === 'already-has-logger') {
    skipped++;
  } else {
    failed.push({ file: path.basename(file), error: result.reason });
    console.log(`✗ ${path.basename(file)}: ${result.reason}`);
  }
}

console.log('\n========== SUMMARY ==========');
console.log(`Successfully updated: ${updated} files`);
console.log(`Skipped (already have logger): ${skipped} files`);
console.log(`Failed: ${failed.length} files`);

if (Object.keys(categories).length > 0) {
  console.log('\nCategories updated:');
  for (const [cat, count] of Object.entries(categories).sort()) {
    console.log(`  ${cat}: ${count} files`);
  }
}

if (failed.length > 0) {
  console.log('\nFailed files:');
  failed.forEach(f => console.log(`  ${f.file}: ${f.error}`));
}
