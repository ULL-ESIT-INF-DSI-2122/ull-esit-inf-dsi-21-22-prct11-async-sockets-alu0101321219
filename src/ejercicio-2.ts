import {spawn} from 'child_process';
import * as fs from 'fs';

export class CountFileWords {
  constructor(private filePath: string, private word: string) {}

  public method1(): number {
    let numberOfWords: number = 0;
    fs.access(this.filePath, fs.constants.F_OK, (err) => {
      if (err) {
        throw new Error(`File ${this.filePath} does not exist`);
      } else {
        const cat = spawn('cat', [this.filePath]);
        const grep = spawn('grep', [this.word]);
        cat.stdout.pipe(grep.stdin);

        let grepOutput = '';
        grep.stdout.on('data', (piece) => {
          grepOutput += piece;
        });

        grep.on('close', () => {
          console.log(grepOutput);
          const wordRE = new RegExp(this.word, 'g');
          if (grepOutput.match(wordRE)?.length) {
            numberOfWords = grepOutput.match(wordRE)?.length!;
            console.log(`numberOfWords = ${numberOfWords}`);
          }
        });
      }
    });
    return numberOfWords;
  }
}


if (process.argv.length < 4) {
  console.log('Please, provide a "filename" and a "word to search"');
} else {
  const countFileWords: CountFileWords = new CountFileWords(process.argv[2], process.argv[3]);
  try {
    console.log(countFileWords.method1());
  } catch (error) {
    console.log(error);
  }
}