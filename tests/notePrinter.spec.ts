import 'mocha';
import {expect} from 'chai';
import {Note} from '../src/note';
import {NotePrinter} from '../src/notePrinter';
import * as chalk from 'chalk';

describe('NotePrinter', () => {
  let redNote: Note;
  let greenNote: Note;
  let blueNote: Note;
  let yellowNote: Note;
  let redNotePrinter: NotePrinter;
  let greenNotePrinter: NotePrinter;
  let blueNotePrinter: NotePrinter;
  let yellowNotePrinter: NotePrinter;
  beforeEach(() => {
    redNote = new Note('TituloRojo', 'CuerpoRojo', 'red');
    greenNote = new Note('TituloVerde', 'CuerpoVerde', 'green');
    blueNote = new Note('TituloAzul', 'CuerpoAzul', 'blue');
    yellowNote = new Note('TituloAmarillo', 'CuerpoAmarillo', 'yellow');
    redNotePrinter = new NotePrinter(redNote);
    greenNotePrinter = new NotePrinter(greenNote);
    blueNotePrinter = new NotePrinter(blueNote);
    yellowNotePrinter = new NotePrinter(yellowNote);
  });

  it('Existe una clase llamada "NotePrinter"', () => {
    expect(NotePrinter != undefined).to.be.true;
  });

  it('Se puede instanciar un objeto de la clase "NotePrinter"', () => {
    expect(redNotePrinter instanceof NotePrinter).to.be.true;
    expect(greenNotePrinter instanceof NotePrinter).to.be.true;
    expect(blueNotePrinter instanceof NotePrinter).to.be.true;
    expect(yellowNotePrinter instanceof NotePrinter).to.be.true;
  });

  it('La clase cuenta con un atributo para almacenar la nota a imprimir', () => {
    expect('note' in redNotePrinter).to.be.true;
  });

  it('La clase cuenta con un método para imprimir el título de la nota', () => {
    expect('printTitle' in redNotePrinter).to.be.true;
  });

  it('La clase cuenta con un método para imprimir la información de una nota', () => {
    expect('print' in redNotePrinter).to.be.true;
  });

  it('El método "printTitle" funciona correctamente', () => {
    expect(redNotePrinter.printTitle()).to.be.equal(chalk.red('TituloRojo'));
    expect(greenNotePrinter.printTitle()).to.be.equal(chalk.green('TituloVerde'));
    expect(blueNotePrinter.printTitle()).to.be.equal(chalk.blue('TituloAzul'));
    expect(yellowNotePrinter.printTitle()).to.be.equal(chalk.yellow('TituloAmarillo'));
  });

  it('El método "print" funciona correctamente', () => {
    expect(redNotePrinter.print()).to.be.equal(chalk.red('TituloRojo') + '\n' + chalk.red.inverse('CuerpoRojo\n'));
    expect(greenNotePrinter.print()).to.be.equal(chalk.green('TituloVerde') + '\n' + chalk.green.inverse('CuerpoVerde\n'));
    expect(blueNotePrinter.print()).to.be.equal(chalk.blue('TituloAzul') + '\n' + chalk.blue.inverse('CuerpoAzul\n'));
    expect(yellowNotePrinter.print()).to.be.equal(chalk.yellow('TituloAmarillo') + '\n' + chalk.yellow.inverse('CuerpoAmarillo\n'));
  });
});