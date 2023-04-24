const request = require('request');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const urlArg = process.argv[2];
const localPathArg = process.argv[3];

if (!urlArg || !localPathArg) {
  console.error('Usage: node fetcher.js <URL> <LocalFilePath>');
  process.exit(1);
}

const localPath = path.resolve(localPathArg);
if (fs.existsSync(localPath)) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('File already exists. Do you want to overwrite it? (Y/N): ', (answer) => {
    if (answer.trim().toLowerCase() !== 'y') {
      console.log('File not overwritten. Exiting...');
      rl.close();
      process.exit(0);
    }

    downloadAndSaveFile(urlArg, localPath);
    rl.close();
  });
} else {
  downloadAndSaveFile(urlArg, localPath);
}

function downloadAndSaveFile(url, localPath) {
  request.get(url, (err, response, body) => {
    if (err) {
      console.error('Error downloading file:', err);
      process.exit(1);
    }

    if (response.statusCode !== 200) {
      console.error('Error downloading file:', response.statusMessage);
      process.exit(1);
    }

    fs.writeFile(localPath, body, (err) => {
      if (err) {
        console.error('Error saving file:', err);
        process.exit(1);
      }

      console.log(`Downloaded and saved ${body.length} bytes to ${localPath}`);
    });
  });
}
