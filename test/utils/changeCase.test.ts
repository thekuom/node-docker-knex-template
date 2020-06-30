import { expect } from 'chai';

import { camelCase, snakeCase } from 'src/utils/changeCase';

describe('(Utils) ChangeCase', () => {
  describe('camelCase', () => {
    it('should return null if null', () => {
      expect(camelCase(null)).to.eq(null);
    });
    it('should camelcase string', () => {
      expect(camelCase('foo_bar')).to.eq('fooBar');
    });
    it('should camelcase object', () => {
      expect(camelCase({
        test_field: 'test_field',
      })).to.deep.eq({ testField: 'test_field' });
    });
    it('should camelcase array', () => {
      expect(camelCase([{
        test_field: 'test_field',
        another_field: 'another_field',
      }, {
        foo_field: 'foo',
        bar_field: 'bar',
      }])).to.deep.eq([{
        testField: 'test_field',
        anotherField: 'another_field',
      }, {
        fooField: 'foo',
        barField: 'bar',
      }]);
    });
  });

  describe('snakeCase', () => {
    it('should return null if null', () => {
      expect(snakeCase(null)).to.eq(null);
    });
    it('should camelcase string', () => {
      expect(snakeCase('fooBar')).to.eq('foo_bar');
    });
    it('should camelcase object', () => {
      expect(snakeCase({
        testField: 'testField',
      })).to.deep.eq({ test_field: 'testField' });
    });
    it('should camelcase array', () => {
      expect(snakeCase([{
        testField: 'testField',
        anotherField: 'anotherField',
      }, {
        fooField: 'foo',
        barField: 'bar',
      }])).to.deep.eq([{
        test_field: 'testField',
        another_field: 'anotherField',
      }, {
        foo_field: 'foo',
        bar_field: 'bar',
      }]);
    });
  });
});
