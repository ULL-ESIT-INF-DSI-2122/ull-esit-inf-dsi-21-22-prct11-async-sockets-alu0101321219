import 'mocha';
import {expect} from 'chai';
import {NoteManagement} from '../src/noteManagement';
import {Note} from '../src/note';

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
    expect(noteManagement.removeAllNotes()).to.be.true;
  });

  it('La clase cuenta con un método para añadir una nota', () => {
    expect('addNote' in noteManagement).to.be.true;
  });

  it('El método que añade notas funciona correctamente', () => {
    const note: Note = new Note('Titulo', 'Cuerpo', 'green');
    expect(noteManagement.addNote(note, 'adrian')).to.be.true;
    expect(noteManagement.addNote(note, 'adrian')).to.be.false;
    expect(noteManagement.addNote(note, 'adrian2')).to.be.true;
  });

  it('La clase cuenta con un método para eliminar una nota', () => {
    expect('removeNote' in noteManagement).to.be.true;
    expect(noteManagement.removeNote('Titulo', 'adrian2')).to.be.true;
    expect(noteManagement.removeNote('Titulo', 'adrian2')).to.be.false;
  });

  it('La clase cuenta con un método para leer una nota', () => {
    expect('readNote' in noteManagement).to.be.true;
  });

  it('El método para leer una nota funciona correctamente', () => {
    expect(noteManagement.readNote('Titulo', 'adrian')).to.be.deep.equal(new Note('Titulo', 'Cuerpo', 'green'));
    expect(noteManagement.readNote('Titulo', 'adrian2')).to.be.equal(undefined);
  });

  it('La clase cuenta con un método para modificar el cuerpo de una nota', () => {
    expect('modNoteBody' in noteManagement).to.be.true;
  });

  it('El método para modificar el cuerpo de una nota funciona correctamente', () => {
    expect(noteManagement.modNoteBody('Titulo', 'adrian', 'Cuerpo')).to.be.true;
    expect(noteManagement.modNoteBody('Titulo', 'adrian', 'nuevoCuerpo')).to.be.true;
    expect(noteManagement.modNoteBody('Titulo', 'adrian2', 'nuevoCuerpo')).to.be.false;
  });

  it('La clase cuenta con un método para modificar el color de una nota', () => {
    expect('modNoteColor' in noteManagement).to.be.true;
  });

  it('El método para modificar el color de una nota funciona correctamente', () => {
    expect(noteManagement.modNoteColor('Titulo', 'adrian', 'green')).to.be.true;
    expect(noteManagement.modNoteColor('Titulo', 'adrian', 'yellow')).to.be.true;
    expect(noteManagement.modNoteColor('Titulo', 'adrian2', 'yellow')).to.be.false;
  });

  it('La clase cuenta con un método para listar las notas de un usuario', () => {
    expect('listNotes' in noteManagement).to.be.true;
  });

  it('El método para listar las notas de un usuario funciona correctamente', () => {
    expect(noteManagement.listNotes('adrian')).to.be.deep.equal([new Note('Titulo', 'nuevoCuerpo', 'yellow')]);
    expect(noteManagement.listNotes('adrian2')).to.be.equal(undefined);
  });

  it('La clase cuenta con un método para eliminar todas las notas de un usuario', () => {
    expect('removeAllUserNotes' in noteManagement).to.be.true;
  });

  it('El método para eliminar todas las notas de un usuario funciona correctamente', () => {
    expect(noteManagement.removeAllUserNotes('adrian')).to.be.true;
    expect(noteManagement.removeAllUserNotes('adrian')).to.be.false;
  });
});