import 'mocha';
import {expect} from 'chai';
import {AddMapReduce} from './../src/addMapReduce';
import {SubMapReduce} from './../src/subMapReduce';
import {ProdMapReduce} from './../src/prodMapReduce';
import {MapReduce} from '../src/mapReduce';

const myfuncion = function(n: number):number {
  return n *2;
};
const myAddMapReduce: AddMapReduce = new AddMapReduce(myfuncion, 1, 2, 5);
const mySubMapReduce: SubMapReduce = new SubMapReduce(myfuncion, 1, 2, 5);
const myProdMapReduce: ProdMapReduce = new ProdMapReduce(myfuncion, 1, 2, 5);

describe('MapReduce', () => {
  it('Exite una clase MapReduce', () => {
    expect(MapReduce != undefined).to.be.true;
  });

  it('Se puede instanciar un objeto de AddMapReduce', () => {
    expect(myAddMapReduce instanceof AddMapReduce).to.be.true;
  });

  it('Se puede instanciar un objeto de SubMapReduce', () => {
    expect(mySubMapReduce instanceof SubMapReduce).to.be.true;
  });

  it('Se puede instanciar un objeto de ProdMapReduce', () => {
    expect(myProdMapReduce instanceof ProdMapReduce).to.be.true;
  });

  it('Tiene un método run', () => {
    expect('run' in myAddMapReduce).to.be.true;
  });

  it('Tiene un método map', () => {
    expect('map' in myAddMapReduce).to.be.true;
  });

  it('Tiene un método reduce abstracto', () => {
    expect('reduce' in myAddMapReduce).to.be.true;
    expect('reduce' in mySubMapReduce).to.be.true;
    expect('reduce' in myProdMapReduce).to.be.true;
  });

  it('El método run funciona correctamente para AddMapReduce', () => {
    expect(myAddMapReduce.getCollection()).to.be.deep.equal([1, 2, 5]);
    myAddMapReduce.run();
    expect(myAddMapReduce.getCollection()).to.be.deep.equal([22]);
  });

  it('El método run funciona correctamente para SubMapReduce', () => {
    expect(mySubMapReduce.getCollection()).to.be.deep.equal([1, 2, 5]);
    mySubMapReduce.run();
    expect(mySubMapReduce.getCollection()).to.be.deep.equal([-14]);
  });

  it('El método run funciona correctamente para ProdMapReduce', () => {
    expect(myProdMapReduce.getCollection()).to.be.deep.equal([1, 2, 5]);
    myProdMapReduce.run();
    expect(myProdMapReduce.getCollection()).to.be.deep.equal([80]);
  });
});