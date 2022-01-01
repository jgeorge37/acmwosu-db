/*
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
*/

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

export {
  validateLastNameDotNum,
  validateName
}
