export class EnumHelper {
  static isEnumValue(enumValue: string, anEnum: object): boolean {
    return Object.values(anEnum).includes(enumValue);
  }
}
