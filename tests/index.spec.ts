import 'mocha';
import {expect} from 'chai';
import {add} from '../src/index';

describe("Prueba", () => {
  it("Hola", () => {
    expect(add(3, 4)).to.be.eq(7);
  });
});