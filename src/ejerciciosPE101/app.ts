import {Management} from "./management";

if (process.argv.length < 4) {
  console.log('Please, provide a filename and command options');
} else {
  const myManagement: Management = new Management();
  try {
    const commandOptions: string[] = [];
    for (let i = 4; i < process.argv.length; i++) {
      commandOptions.push(process.argv[i]);
    }
    myManagement.initialize(process.argv[2], process.argv[3], ...commandOptions);
  } catch (error) {
    console.log('An error have been ocurred: ');
    console.error(error);
  }
}