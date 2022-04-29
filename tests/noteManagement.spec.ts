import 'mocha';
import {expect} from 'chai';
import {NoteManagement} from '../src/ejercicio-3/noteMagenement';
import * as chalk from 'chalk';
import {Note} from '../src/ejercicio-3/note';

describe('NoteManagement', () => {
  const noteManagement: NoteManagement = new NoteManagement();
  it('Existe una clase llamada "NoteManagement"', () => {
    expect(NoteManagement != undefined).to.be.true;
  });

  it('Se puede instanciar un objeto de la clase "NoteManagement"', () => {
    expect(noteManagement instanceof NoteManagement).to.be.true;
  });

  it('La clase cuenta con un método para eliminar todas las notas', () => {
    expect('removeAllNotes' in noteManagement).to.be.true;
  });

  it('Se eliminan todas las notas correctamente', () => {
    expect(noteManagement.removeAllNotes()).to.be.equal(chalk.green('All notes have been removed correctly!'));
  });

  it('La clase cuenta con un método para añadir una nota', () => {
    expect('addNote' in noteManagement).to.be.true;
  });

  it('El método que añade notas funciona correctamente', () => {
    const note: Note = new Note('Titulo', 'Cuerpo', 'green');
    expect(noteManagement.addNote(note, 'adrian')).to.be.equal(chalk.green(`Note has been added correctly!`));
    expect(noteManagement.addNote(note, 'adrian')).to.be.equal(chalk.red('Error: This note already exists!'));
    expect(noteManagement.addNote(note, 'adrian2')).to.be.equal(chalk.green(`Note has been added correctly!`));
  });

  it('La clase cuenta con un método para eliminar una nota', () => {
    expect('removeNote' in noteManagement).to.be.true;
    expect(noteManagement.removeNote('Titulo', 'adrian2')).to.be.equal(chalk.green(`Note has been removed correctly!`));
    expect(noteManagement.removeNote('Titulo', 'adrian2')).to.be.equal(chalk.red("Error: This note doesn't exist!"));
  });

  it('La clase cuenta con un método para leer una nota', () => {
    expect('readNote' in noteManagement).to.be.true;
  });

  it('El método para leer una nota funciona correctamente', () => {
    expect(noteManagement.readNote('Titulo', 'adrian')).to.be.equal(chalk.green('Titulo') + '\n' + chalk.green.inverse('Cuerpo\n'));
    expect(noteManagement.readNote('Titulo', 'adrian2')).to.be.equal(chalk.red('Error: This note doesnt exist!'));
  });

  it('La clase cuenta con un método para modificar el cuerpo de una nota', () => {
    expect('modNoteBody' in noteManagement).to.be.true;
  });

  it('El método para modificar el cuerpo de una nota funciona correctamente', () => {
    expect(noteManagement.modNoteBody('Titulo', 'adrian', 'Cuerpo')).to.be.equal(chalk.yellow('Warning: This note already has this body'));
    expect(noteManagement.modNoteBody('Titulo', 'adrian', 'nuevoCuerpo')).to.be.equal(chalk.green('Note body has been modified correctly!'));
    expect(noteManagement.modNoteBody('Titulo', 'adrian2', 'nuevoCuerpo')).to.be.equal(chalk.red('Error: This note doesnt exist!'));
  });

  it('La clase cuenta con un método para modificar el color de una nota', () => {
    expect('modNoteColor' in noteManagement).to.be.true;
  });

  it('El método para modificar el color de una nota funciona correctamente', () => {
    expect(noteManagement.modNoteColor('Titulo', 'adrian', 'green')).to.be.equal(chalk.yellow('Warning: This note already has this color'));
    expect(noteManagement.modNoteColor('Titulo', 'adrian', 'yellow')).to.be.equal(chalk.green('Note color has been modified correctly!'));
    expect(noteManagement.modNoteColor('Titulo', 'adrian2', 'yellow')).to.be.equal(chalk.red('Error: This note doesnt exist!'));
  });

  it('La clase cuenta con un método para listar las notas de un usuario', () => {
    expect('listNotes' in noteManagement).to.be.true;
  });

  it('El método para listar las notas de un usuario funciona correctamente', () => {
    expect(noteManagement.listNotes('adrian')).to.be.equal(chalk.yellow('Titulo') + '\n');
    expect(noteManagement.listNotes('adrian2')).to.be.equal(chalk.red('Error: This user doesnt have any notes!'));
  });

  it('La clase cuenta con un método para eliminar todas las notas de un usuario', () => {
    expect('removeAllUserNotes' in noteManagement).to.be.true;
  });

  it('El método para eliminar todas las notas de un usuario funciona correctamente', () => {
    expect(noteManagement.removeAllUserNotes('adrian')).to.be.equal(chalk.green('User have been removed succesfully!'));
    expect(noteManagement.removeAllUserNotes('adrian')).to.be.equal(chalk.red('Error: This user doesnt exists!'));
  });
});