import { CompareObjects } from './compare-objects';

describe('CompareObjects unit tests', () => {
  describe('Method isEqual', () => {
    describe('WHEN objects have not format equal', () => {
      it('SHOULD return false', () => {
        const object1 = { name: 'fulanin' };
        const object2 = { age: 23 };

        const result = CompareObjects.isEqual(object1, object2);

        expect(result).toBeFalsy();
      });
    });

    describe('WHEN objects have not values equal', () => {
      it('SHOULD return false', () => {
        const object1 = { name: 'fulanin' };
        const object2 = { name: 'mariazinha' };

        const result = CompareObjects.isEqual(object1, object2);

        expect(result).toBeFalsy();
      });
    });

    it('SHOULD return true', () => {
      const object1 = { name: 'fulanin' };
      const object2 = { name: 'fulanin' };

      const result = CompareObjects.isEqual(object1, object2);

      expect(result).toBeTruthy();
    });
  });
});
