import { 
    validateLastNameDotNum, 
    validateName
} from '../../utility/validate_util';


describe('validateName tests, for the use of names', () => {
    test('all letters, mixed case', () => {
        expect(validateName("abcABCabcZZ")).toBe(true);
    });
    test('one uppercase', () => {
        expect(validateName("Z")).toBe(true);
    });
    test('one lowercase', () => {
        expect(validateName("i")).toBe(true);
    });
    test('empty string', () => {
        expect(validateName("")).toBe(false);
    });
    test('space characters', () => {
        expect(validateName("      ")).toBe(false);
    })
    test('letters with numbers', () => {
        expect(validateName("abc3xyz9")).toBe(true);
    });
    test('name with apostrophe', () => {
        expect(validateName("O'Neal")).toBe(true);
    });
    test('name with hypen', () => {
        expect(validateName("John-Paul")).toBe(true);
    });
    test('name with accent', () => {
        expect(validateName("Noël")).toBe(true);
    });
    test('name with space', () => {
        expect(validateName("Ann Marie")).toBe(true);
    });
});

describe('validateLastNameDotNum tests', () => {
    test('single char dot single digit', () => {
        expect(validateLastNameDotNum("g.1")).toBe(true);
    });
    test('name dot longer num', () => {
        expect(validateLastNameDotNum("buckeye.100493")).toBe(true);
    });
    test('name dot num with @osu.edu', () => {
        expect(validateLastNameDotNum("buckeye.1@osu.edu")).toBe(false);
    });
    test('no dot', () => {
        expect(validateLastNameDotNum("buckeye1")).toBe(false);
    });
    test('no name', () => {
        expect(validateLastNameDotNum(".99")).toBe(false);
    });
    test('no num', () => {
        expect(validateLastNameDotNum("buckeye.")).toBe(false);
    });
    test('empty string', () => {
        expect(validateLastNameDotNum("")).toBe(false);
    });
});
