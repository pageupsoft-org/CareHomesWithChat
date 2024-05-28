export class EnumConverter {
  public static ConvertEnumToArray(enumType): any[] {
    let arr = [];
    let enumerator = enumType;
    var keys = Object.keys(enumType).map(key => {
      /// Check if the enum returns value of the enum or key (In typescript it returns both. E.g. - "A" and "0")
      if (!(parseInt(key) >= 0)) arr.push({ key: key, value: enumerator[key] });
    });
    return arr;
  }
}
