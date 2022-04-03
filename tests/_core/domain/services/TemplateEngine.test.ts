import { TemplateEngine } from '../../../../src/_core/domain/services/TemplateEngine';
import { StringHelper } from '../../../../src/_core/domain/services/helpers/StringHelper';

describe('Template Engine testing', () => {

  test('TemplateEngine render correctly the variables that it needs.', () => {
    const templateEngine = new TemplateEngine(new StringHelper());
    expect(templateEngine.render('hey $name', { $name: 'John Doe'}))
      .toBe('hey John Doe')
  });
})
