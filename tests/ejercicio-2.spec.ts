import 'mocha';
import {expect} from 'chai';
import {CountFileWords} from '../src/ejercicio-2/countFileWords';

describe('Ejercicio 2', () => {
  const countFileWords: CountFileWords = new CountFileWords('1', '2');
  it('Existe una clase llamada CountFileWords', () => {
    expect(CountFileWords != undefined).to.be.true;
  });

  it('Se puede instanciar un objeto de la clase CountFileWords', () => {
    expect(countFileWords instanceof CountFileWords).to.be.equal(true);
  });

  it('La clase cuenta con un atributo para la ruta del fichero y otro para la palabra a contar', () => {
    expect('filePath' in countFileWords).to.be.true;
    expect('word' in countFileWords).to.be.true;
  });

  it('La clase CountFileWords cuenta con 2 métodos para realizar su cometido', () => {
    expect('method1' in countFileWords).to.be.true;
    expect('method2' in countFileWords).to.be.true;
  });

  it('Se muestra un error al introducir por parámetro un nombre de fichero inválido', (done) => {
    new CountFileWords('ruta/invalida', 'repositorio').method1((err) => {
      if (err) {
        expect(err).to.be.equal("ERROR: ENOENT: no such file or directory, access 'ruta/invalida'");
        done();
      }
    });
  });

  it('Se muestra un error al no encontrar niguna ocurrencia de la palabra introducida', (done) => {
    new CountFileWords('README.md', 'ejemplo').method1((err) => {
      if (err) {
        expect(err).to.be.equal('ERROR: There is no ocurrences...');
        done();
      }
    });
  });
});