import { optional, create, test } from 'vest';

describe('optional hook', () => {
  describe('Functional Optional Interface', () => {
    it('Should omit test failures based on optional functions', () => {
      const suite = create(() => {
        optional({
          f1: () => true,
          f2: () => true,
        });

        test('f1', () => false);
        test('f2', () => false);
      });

      const res = suite();

      expect(res.hasErrors('f1')).toBe(false);
      expect(res.hasErrors('f2')).toBe(false);
      expect(res.isValid('f1')).toBe(true);
      expect(res.isValid('f2')).toBe(true);
      expect(res.isValid()).toBe(true);
    });

    describe('example: "any of" test', () => {
      it('Should allow specifying custom optional based on other tests in the suite', () => {
        const suite = create(() => {
          optional({
            f1: () => !suite.get().hasErrors('f2'),
            f2: () => !suite.get().hasErrors('f1'),
          });

          test('f1', () => false);
          test('f2', () => true);
        });

        const res = suite();

        expect(res.hasErrors('f1')).toBe(false);
        expect(res.hasErrors('f2')).toBe(false);
        expect(res.isValid('f1')).toBe(true);
        expect(res.isValid('f2')).toBe(true);
        expect(res.isValid()).toBe(true);
      });
    });
  });

  describe('boolean optional field indicator', () => {
    describe('When true', () => {
      it('Should omit field as optional', () => {
        const suite = create(() => {
          optional({
            field_1: true,
          });
          test('field_1', () => false);
        });

        const res = suite();

        expect(res.hasErrors('field_1')).toBe(false);
        expect(res.isValid('field_1')).toBe(true);
        expect(res.isValid()).toBe(true);
      });
    });

    describe('When false', () => {
      it('Should fail the field normally', () => {
        const suite = create(() => {
          optional({
            field_1: false,
          });
          test('field_1', () => false);
        });

        const res = suite();

        expect(res.hasErrors('field_1')).toBe(true);
        expect(res.isValid('field_1')).toBe(false);
        expect(res.isValid()).toBe(false);
      });
    });
  });
});
