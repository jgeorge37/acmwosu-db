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

export {currentAcademicYear}