import {
    currentAcademicYear, validatePassword, validateEmail, validateLetters, validateLastNameDotNum, validateNumber, validateTime
} from '../../../pages/api/utility';

test('buckeye.1@osu.edu to be valid', () => {
    expect(validateEmail("buckeye.1@osu.edu")).toBeTruthy();
  });