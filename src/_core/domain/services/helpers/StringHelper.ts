export class StringHelper {

  public replaceAll(text: string, textToReplace: string, textAfterReplace: string): string {

    let resultText: string = text;

    while (resultText.includes(textToReplace)) {
      resultText = resultText.replace(textToReplace, textAfterReplace);
    }

    return resultText;
  }

  public static random(digits: number = 5): string {
    return Math.random().toString(36).substr(2, digits);
  }
}
