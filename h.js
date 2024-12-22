import fs from 'fs/promises';
import clipboardy from 'clipboardy';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'form-data.txt');
const copiedFilePath = path.join(__dirname, 'documents', 'form-data.txt');

async function updateNames() {
  try {
    let time = 0;

    while (time < 60000) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const fileContent = await fs.readFile(filePath, 'utf8');

      let myName = null;
      while (myName == null) {
        myName = await getClipboardValue('Copy your name to the clipboard, then press Enter.');
        if (myName == null) {
          throw new Error('No name was provided.');
        }
      }

      let fathersName = null;
      while (fathersName == null) {
        fathersName = await getClipboardValue('Copy your father\'s name to the clipboard, then press Enter.');
        if (fathersName == null) {
          throw new Error('No father\'s name was provided.');
        }
      }

      const updatedContent = fileContent
        .replace('myName', myName)
        .replace('hello', fathersName);

      await fs.writeFile(copiedFilePath, updatedContent, 'utf8');
      console.log('File rewritten successfully!');

      // Copy file content to clipboard
      clipboardy.writeSync(updatedContent);
      console.log('Updated content copied to clipboard.');

      time += 5000;
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function getClipboardValue(promptText) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question(promptText, () => {
      rl.close();
      try {
        resolve(clipboardy.readSync());
      } catch (error) {
        reject(error);
      }
    });
  });
}

updateNames();

