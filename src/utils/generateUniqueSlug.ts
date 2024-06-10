

export const getUniqueSlug = (value:string, valueList:Array<any>, index = 0):string => {
  if (!valueList.length || valueList.indexOf(value) < 0) {
    return value;
  }
  if (valueList.indexOf(`${value}-${index + 1}`) < 0) {
    return `${value}-${index + 1}`;
  }
  return getUniqueSlug(value, valueList, index + 1);
};

