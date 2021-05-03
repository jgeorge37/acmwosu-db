// Functions that do not go with a particular table

function currentAcademicYear() {
  const d = new Date();
  const year = d.getFullYear() - 2000;
  const month = d.getMonth();
  let fall = "AU", spring = "SP";
  if (month >= 8 && month <= 12) {
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

function schoolLevelIntToString(schoolLevel) {
  if(schoolLevel == 1) return "First year";
  if(schoolLevel == 2) return "Second year";
  if(schoolLevel == 3) return "Third year";
  if(schoolLevel == 4) return "Fourth year";
  if(schoolLevel == 5) return "Fifth+ year";
  if(schoolLevel == 6) return "Masters or PhD";
  if(schoolLevel == 7) return "Alum";
  return schoolLevel;
}

function validatePassword(input) {
  //at least one number, one uppercase letter, one lowercase letter, one special character
  const regex = new RegExp(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/);
  return regex.test(input);
}

function validateEmail(input) {
  //matches case insensitive letters. number w/o leading 0 @ osu . edu
  const regex = new RegExp(/^([a-z]+\.[1-9]([0-9]+)?@osu\.edu)$/i);
  return regex.test(input);
}

function validateGeneralEmail(input) {
  const regex = new RegExp(/\S+@\S+\.\S+/);
  return regex.test(input);
}

function validateLetters(input) {
  //letters (case insensitive)
  const regex = new RegExp(/^[a-z]+$/i);
  return regex.test(input);
}

function validateName(input) {
  // checks that string is not empty & contains at least one non-space character
  const regex = new RegExp(/^(?!\s*$).+/);
  return regex.test(input);
}

function validateLastNameDotNum(input) {
  //letters.number (case insensitive)
  const regex = new RegExp(/^[a-z]+\.[1-9]([0-9]+)?$/i);
  return regex.test(input);
}

function validateNumVolHours(input) {
  //integer between 1 and 99, inclusive
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
  }
  return regex.test(input);
}

export {
  currentAcademicYear, 
  schoolLevelIntToString, 
  validatePassword, 
  validateEmail, 
  validateGeneralEmail, 
  validateLetters, 
  validateLastNameDotNum, 
  validateNumVolHours, 
  validateTime, 
  validateName
}
