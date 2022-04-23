import 'mocha';
import {expect} from 'chai';
import {Note} from '../src/note';
import {NotePrinter} from '../src/notePrinter';
import * as chalk from 'chalk';

describe('NotePrinter', () => {
  let redNote: Note;
  let redNotePrinter: NotePrinter;
  beforeEach(() => {
    redNote = new Note('TituloRojo', 'CuerpoRojo', 'red');
    redNotePrinter = new NotePrinter(redNote);
  });

  it('Existe una clase llamada "NotePrinter"', () => {
    expect(NotePrinter != undefined).to.be.true;
  });

  it('Se puede instanciar un objeto de la clase "NotePrinter"', () => {
    expect(redNotePrinter instanceof NotePrinter).to.be.true;
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
  });

  it('El método "print" funciona correctamente', () => {
    expect(redNotePrinter.print()).to.be.equal(chalk.red('TituloRojo') + '\n' + chalk.red.inverse('CuerpoRojo\n'));
  });
});