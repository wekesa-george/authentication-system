const fs = require('fs');
const path = require('path');
require('dotenv').config();

const searchStr = 'ScarfoldAppApplication';
const replaceStr = process.env.APPLICATION_NAME;
const searchStr1 = 'scarfold-app';
const replaceStr2 = process.env.APPLICATION_SHORT_NAME;
function replaceInFile(filePath,searchStr,replaceStr) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${filePath}`);
            return;
        }

        const updatedData = data.replace(new RegExp(searchStr, 'g'), replaceStr);

        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing to file: ${filePath}`);
                return;
            }
            console.log(`Replacement complete in file: ${filePath}`);
        });
    });
}

function traverseDirectory(dirPath) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${dirPath}`);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(dirPath, file);
            fs.stat(filePath, (err, stat) => {
                if (err) {
                    console.error(`Error retrieving file stats: ${filePath}`);
                    return;
                }

                if (stat.isDirectory()) {
                    traverseDirectory(filePath);
                } else if (stat.isFile() && file.endsWith('.ts')) {
                    replaceInFile(filePath,searchStr,replaceStr);
                }
            });
        });
    });
}

function replaceInPackageFiles() {
  const files = ['package.json', 'package-lock.json'];

  files.forEach(file => {
      fs.access(file, fs.constants.F_OK, (err) => {
          if (!err) {
              replaceInFile(file,searchStr1,replaceStr2);
          } else {
              console.error(`File not found: ${file}`);
          }
      });
  });
}

// Start traversal from the current directory
traverseDirectory('./');
replaceInPackageFiles();
