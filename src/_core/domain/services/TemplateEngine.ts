import { StringHelper } from './helpers/StringHelper';

export class TemplateEngine {
  constructor(
    private stringHelper: StringHelper,
  ) {
  }

  public render(templateText: string = '', variables: {[x: string]: string} = {}): string {

    let text: string = templateText;

    Object.keys(variables).forEach(variableName => {
      const variableValue = variables[variableName];
      text = this.stringHelper.replaceAll(text, variableName, variableValue);
    });

    return text;
  }
}
