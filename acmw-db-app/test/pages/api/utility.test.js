import {
    validatePassword, 
    validateGeneralEmail, 
    validateEmail, 
    validateLetters, 
    validateNumVolHours,
    validateLastNameDotNum, 
    validateTime
} from '../../../pages/api/utility';

describe('validatePassword tests', () => {
    test('len 8, 1 digit, 1 uppercase, 1 special', () => {
        expect(validatePassword('Psswrd4&')).toBe(true);
    });
    test('valid in different order', () => {
        expect(validatePassword('!pss7wRd4')).toBe(true);
    });
    test('too short', () => {
        expect(validatePassword('Psswd4&')).toBe(false);
    });
    test('missing special char', () => {
        expect(validatePassword('MYpassword99')).toBe(false);
    });
    test('missing digit', () => {
        expect(validatePassword('MYpass&woRd$!')).toBe(false);
    });
    test('missing lowercase', () => {
        expect(validatePassword('PAS#SW3OR$D')).toBe(false);
    });
    test('missing uppercase', () => {
        expect(validatePassword('#password89')).toBe(false);
    });
    test('extra strong', () => {
        expect(validatePassword('N#rhhC3^w-88%qqQ!5xxL9nm5!j4')).toBe(true);
    });
    test('empty string', () => {
        expect(validatePassword('')).toBe(false);
    });
});

describe('validateGeneralEmail tests', () => {
    test('generic email', () => {
        expect(validateGeneralEmail("johnsmith@gmail.com")).toBe(true);
    });
    test('email address with numbers', () => {
        expect(validateGeneralEmail("johnsmith100@gmail.com")).toBe(true);
    });
    test('email address with dots', () => {
        expect(validateGeneralEmail("j.o.h.n.smith.100@gmail.com")).toBe(true);
    });
    test('sub-domains involved', () => {
        expect(validateGeneralEmail("johnsmith@student.gmail.com")).toBe(true);
    });
    test('odd domain type', () => {
        expect(validateGeneralEmail("johnsmith@gmail.space")).toBe(true);
    });
    test('missing pre-@ string', () => {
        expect(validateGeneralEmail("@gmail.com")).toBe(false);
    });
    test('missing @', () => {
        expect(validateGeneralEmail("johnsmithatgmail.com")).toBe(false);
    });
    test('missing domain type', () => {
        expect(validateGeneralEmail("johnsmith@gmail.")).toBe(false);
    });
    test('missing domain name', () => {
        expect(validateGeneralEmail("johnsmith@.com")).toBe(false);
    });
    test('empty string', () => {
        expect(validateGeneralEmail("")).toBe(false);
    });
});

describe('validateEmail (OSU) tests', () => {
    test('1 char name, 1 digit num', () => {
        expect(validateEmail("b.1@osu.edu")).toBe(true);
    });
    test('> 1 char name, > 1 digit num', () => {
        expect(validateEmail("buckeye.10000@osu.edu")).toBe(true);
    });
    test('leading zero in number', () => {
        expect(validateEmail("buckeye.01000@osu.edu")).toBe(false);
    });
    test('missing dot', () => {
        expect(validateEmail("buckeye10000@osu.edu")).toBe(false);
    });
    test('missing @', () => {
        expect(validateEmail("buckeye.10000osu.edu")).toBe(false);
    });
    test('missing dot between osu and edu', () => {
        expect(validateEmail("buckeye.10000@osuedu")).toBe(false);
    });
    test('com instead of edu', () => {
        expect(validateEmail("buckeye.10000@osu.com")).toBe(false);
    });
    test('psu instead of osu', () => {
        expect(validateEmail("buckeye.10000@psu.edu")).toBe(false);
    });
});

describe('validateLetters tests, for the use of letters-only', () => {
    test('all letters, mixed case', () => {
        expect(validateLetters("abcABCabcZZ")).toBe(true);
    });
    test('one uppercase', () => {
        expect(validateLetters("Z")).toBe(true);
    });
    test('one lowercase', () => {
        expect(validateLetters("i")).toBe(true);
    });
    test('empty string', () => {
        expect(validateLetters("")).toBe(false);
    });
    test('letters with numbers', () => {
        expect(validateLetters("abc3xyz9")).toBe(false);
    });
});

/* TODO: use a regex for names, not just letters
describe('validateLetters tests, for the use of names', () => {
    test('all letters, mixed case', () => {
        expect(validateLetters("abcABCabcZZ")).toBe(true);
    });
    test('one uppercase', () => {
        expect(validateLetters("Z")).toBe(true);
    });
    test('one lowercase', () => {
        expect(validateLetters("i")).toBe(true);
    });
    test('empty string', () => {
        expect(validateLetters("")).toBe(false);
    });
    test('letters with numbers', () => {
        expect(validateLetters("abc3xyz9")).toBe(false);
    });
    test('name with apostrophe', () => {
        expect(validateLetters("O'Neal")).toBe(true);
    });
    test('name with hypen', () => {
        expect(validateLetters("John-Paul")).toBe(true);
    });
    test('name with accent', () => {
        expect(validateLetters("Noël")).toBe(true);
    });
    test('name with space', () => {
        expect(validateLetters("Ann Marie")).toBe(true);
    });
});
*/

describe('validateNumVolHours tests', () => {
    test('0', () => {
        expect(validateNumVolHours("0")).toBe(false);
    });
    test('empty string', () => {
        expect(validateNumVolHours("")).toBe(false);
    });
    test('1x', () => {
        expect(validateNumVolHours("1x")).toBe(false);
    });
    test('x1', () => {
        expect(validateNumVolHours("x1")).toBe(false);
    });
    test('triple digit', () => {
        expect(validateNumVolHours("100")).toBe(false);
    });
    test('valid single digit', () => {
        expect(validateNumVolHours("6")).toBe(true);
    });
    test('valid double digit', () => {
        expect(validateNumVolHours("10")).toBe(true);
    });
    test('max - 99', () => {
        expect(validateNumVolHours("99")).toBe(true);
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

describe('validateTime tests', () => {
    test('invalid time unit', () => {
        expect(() => validateTime("20", "week")).toThrow();
    });

    /* year */
    test('the year 1999', () => {
        expect(validateTime("1999", "year")).toBe(true);
    });
    test('the year 2000', () => {
        expect(validateTime("2000", "year")).toBe(true);
    });
    test('the year 2000AD', () => {
        expect(validateTime("2000AD", "year")).toBe(false);
    });
    test('the year 0', () => {
        expect(validateTime("0", "year")).toBe(false);
    });

    /* day */
    test('the day 0', () => {
        expect(validateTime("0", "day")).toBe(false);
    });
    test('the day 31', () => {
        expect(validateTime("31", "day")).toBe(true);
    });
    test('the day 32', () => {
        expect(validateTime("32", "day")).toBe(false);
    });

    /* hour */
    test('the hour 00', () => {
        expect(validateTime("00", "hour")).toBe(false);
    });
    test('the hour 1', () => {
        expect(validateTime("1", "hour")).toBe(true);
    });
    test('the hour 13', () => {
        expect(validateTime("13", "hour")).toBe(false);
    });

    /* minute */
    test('the minute 00', () => {
        expect(validateTime("00", "minute")).toBe(true);
    });
    test('the minute 0', () => {
        expect(validateTime("0", "minute")).toBe(false);
    });
    test('the minute 60', () => {
        expect(validateTime("60", "minute")).toBe(false);
    });
    test('the minute 59', () => {
        expect(validateTime("59", "minute")).toBe(true);
    });
});