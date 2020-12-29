// Functions that do not go with a particular table

function currentAcademicYear() {
  const d = new Date();
  const year = d.getFullYear() - 2000;
  const month = d.getMonth();
  let fall = "AU", spring = "SP";
  if (8 <= month <= 12) {
    // it's currrently fall semester
    fall += year;
    spring += (year + 1);
  } else {
    //it's currrently spring (or summer)
    fall += (year - 1);
    spring += year;
  }
  return [fall, spring];
}

function validatePassword(input) {
  //at least one number, one uppercase letter, one lowercase letter, one special character
  const regex = new RegExp(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/i);
  return regex.test(input);
}

function validateEmail(input) {
  //matches case insensitive letters. number w/o leading 0 @ osu . edu
  const regex = new RegExp(/^([a-z]+\.[1-9]([0-9]+)?@osu\.edu)$/i);
  return regex.test(input);
}

function validateLetters(input) {
  //letters (case insensitive)
  const regex = new RegExp(/^[a-z]+$/i);
  return regex.test(input);
}

function validateLastNameDotNum(input) {
  //letters.number (case insensitive)
  const regex = new RegExp(/^[a-z]+\.[0-9]+$/i);
  return regex.test(input);
}

function validateNumber(input) {
  //two digit number
  const regex = new RegExp("^([1-9][0-9]{0,1})$");
  return regex.test(input);
}

function validateTime(input, unit) {
  var regex;
  switch (unit) {
    case "minute":
      regex = new RegExp(/^[0-5][0-9]$/);
      break;
    case "hour":
      regex = new RegExp(/^([1-9]|(1[0-2]))$/)
      break;
    case "day":
      regex = new RegExp(/^([1-9]|(1[0-9])|(2[0-9])|(3[0-1]))$/)
      break;
    case "year":
      regex = new RegExp(/^[1-2][0-9][0-9][0-9]$/)
      break;
    default:
      throw("Not a valid unit of time.")
      break;
  }
  return regex.test(input);
}

export {currentAcademicYear, validatePassword, validateEmail, validateLetters, validateLastNameDotNum, validateNumber, validateTime}
