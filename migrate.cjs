const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const moves = {
  marketing: [
    'Header.tsx', 'Hero.tsx', 'HeroAnimation.tsx', 'WhyUs.tsx', 'TargetAudience.tsx', 
    'ProcessSteps.tsx', 'LegalSupport.tsx', 'AiOperations.tsx', 'DashboardPreview.tsx', 
    'Comparison.tsx', 'Pricing.tsx', 'LeadForm.tsx', 'FinalCTA.tsx', 'Footer.tsx', 
    'Blog.tsx', 'SEO.tsx', 'TrustBar.tsx'
  ],
  dashboard: [
    'PremiumDashboard.tsx', 'AdminDashboard.tsx', 'WorkspaceChat.tsx', 
    'ActivityLogViewer.tsx', 'CMSManager.tsx'
  ],
  shared: [
    'AuthModals.tsx', 'LawyerModal.tsx', 'ConsultationModal.tsx', 'SolutionModal.tsx', 
    'WhyUsDetailModal.tsx', 'TimedCTAPopup.tsx'
  ],
  auth: [
    'OnboardingWizard.tsx', 'OnboardingDashboard.tsx'
  ]
};

// Create directories
Object.keys(moves).forEach(dir => {
  const dirPath = path.join(componentsDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Move files
const fileToNewDir = {};
Object.entries(moves).forEach(([dir, files]) => {
  files.forEach(file => {
    const oldPath = path.join(componentsDir, file);
    const newPath = path.join(componentsDir, dir, file);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      fileToNewDir[file] = dir;
    }
  });
});

// Update imports in MainApp.tsx
const mainAppPath = path.join(componentsDir, 'MainApp.tsx');
if (fs.existsSync(mainAppPath)) {
  let content = fs.readFileSync(mainAppPath, 'utf8');
  Object.entries(fileToNewDir).forEach(([file, dir]) => {
    const componentName = file.replace('.tsx', '');
    const regex = new RegExp(`import ${componentName} from '\\.\\/${componentName}';`, 'g');
    content = content.replace(regex, `import ${componentName} from './${dir}/${componentName}';`);
  });
  fs.writeFileSync(mainAppPath, content);
}

// Update imports in all moved files
const updateImportsInFile = (filePath, currentDir) => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  // Fix imports to other components
  Object.entries(fileToNewDir).forEach(([file, targetDir]) => {
    const componentName = file.replace('.tsx', '');
    // Regex to match import ... from './ComponentName'
    const regex1 = new RegExp(`from '\\.\\/${componentName}'`, 'g');
    const regex2 = new RegExp(`from "\\.\\/${componentName}"`, 'g');
    
    let newImportPath;
    if (currentDir === targetDir) {
      newImportPath = `./${componentName}`;
    } else {
      newImportPath = `../${targetDir}/${componentName}`;
    }
    
    if (regex1.test(content) || regex2.test(content)) {
      content = content.replace(regex1, `from '${newImportPath}'`);
      content = content.replace(regex2, `from "${newImportPath}"`);
      changed = true;
    }
  });

  // Fix imports to parent directories (e.g. '../panel/...' -> '../../panel/...')
  const parentRegex1 = /from '\.\.\/panel\//g;
  const parentRegex2 = /from "\.\.\/panel\//g;
  if (parentRegex1.test(content) || parentRegex2.test(content)) {
    content = content.replace(parentRegex1, `from '../../panel/`);
    content = content.replace(parentRegex2, `from "../../panel/`);
    changed = true;
  }
  
  const configRegex1 = /from '\.\.\/config'/g;
  const configRegex2 = /from "\.\.\/config"/g;
  if (configRegex1.test(content) || configRegex2.test(content)) {
    content = content.replace(configRegex1, `from '../../config'`);
    content = content.replace(configRegex2, `from "../../config"`);
    changed = true;
  }
  
  const utilsRegex1 = /from '\.\.\/utils\//g;
  const utilsRegex2 = /from "\.\.\/utils\//g;
  if (utilsRegex1.test(content) || utilsRegex2.test(content)) {
    content = content.replace(utilsRegex1, `from '../../utils/`);
    content = content.replace(utilsRegex2, `from "../../utils/`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
  }
};

Object.entries(moves).forEach(([dir, files]) => {
  files.forEach(file => {
    const filePath = path.join(componentsDir, dir, file);
    updateImportsInFile(filePath, dir);
  });
});

console.log('Migration complete');
