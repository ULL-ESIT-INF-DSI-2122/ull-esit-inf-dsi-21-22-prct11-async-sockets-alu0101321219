import 'mocha';
import {expect} from 'chai';
import {Note} from '../src/ejercicio-3/note';
import {NoteSchema} from '../src/ejercicio-3/interfaces/noteSchema';

describe('Note', () => {
  let redNote: Note;
  let greenNote: Note;
  let blueNote: Note;
  let yellowNote: Note;
  let redNoteSchema: NoteSchema;
  beforeEach(() => {
    redNote = new Note('TituloRojo', 'CuerpoRojo', 'red');
    greenNote = new Note('TituloVerde', 'CuerpoVerde', 'green');
    blueNote = new Note('TituloAzul', 'CuerpoAzul', 'blue');
    yellowNote = new Note('TituloAmarillo', 'CuerpoAmarillo', 'yellow');
    redNoteSchema = {
      title: 'TituloRojo',
      body: 'CuerpoRojo',
      color: 'red',
    };
  });
  it('Existe una clase llamada "Note"', () => {
    expect(Note != undefined).to.be.true;
  });

  it('Se puede instanciar un objeto de la clase Note', () => {
    expect(redNote instanceof Note).to.be.true;
    expect(greenNote instanceof Note).to.be.true;
    expect(blueNote instanceof Note).to.be.true;
    expect(yellowNote instanceof Note).to.be.true;
  });

  it('La clase Note tiene un atributo llamado "title"', () => {
    expect('title' in redNote).to.be.true;
  });

  it('La clase Note tiene un atributo llamado "body"', () => {
    expect('body' in redNote).to.be.true;
  });

  it('La clase Note tiene un atributo llamado "color"', () => {
    expect('color' in redNote).to.be.true;
  });

  it('La clase Note tiene "getters" para cada uno de sus atributos', () => {
    expect('getTitle' in redNote).to.be.true;
    expect('getBody' in redNote).to.be.true;
    expect('getColor' in redNote).to.be.true;
  });

  it('La clase Note tiene "setters" para cada uno de sus atributos', () => {
    expect('setTitle' in redNote).to.be.true;
    expect('setBody' in redNote).to.be.true;
    expect('setColor' in redNote).to.be.true;
  });

  it('Los getters funcionan correctamente', () => {
    expect(redNote.getTitle()).to.be.equal('TituloRojo');
    expect(redNote.getBody()).to.be.equal('CuerpoRojo');
    expect(redNote.getColor()).to.be.equal('red');
    expect(greenNote.getColor()).to.be.equal('green');
    expect(blueNote.getColor()).to.be.equal('blue');
    expect(yellowNote.getColor()).to.be.equal('yellow');
  });

  it('Los setters funcionan correctamente', () => {
    redNote.setTitle('titulo');
    expect(redNote.getTitle()).to.be.equal('titulo');
    redNote.setBody('cuerpo');
    expect(redNote.getBody()).to.be.equal('cuerpo');
    redNote.setColor('yellow');
    expect(redNote.getColor()).to.be.equal('yellow');
  });

  it('La clase Note tiene un método estático "deserialize"', () => {
    expect('deserialize' in Note).to.be.true;
  });

  it('El método deserializa funciona correctamente', () => {
    expect(Note.deserialize(redNoteSchema)).to.be.deep.equal(redNote);
  });
});