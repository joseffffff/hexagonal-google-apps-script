import { StringHelper } from '../../../../../src/_core/domain/services/helpers/StringHelper';

const stringHelper = new StringHelper()

describe('StringHelper tests', () => {

  test('replaceAll replace all the matches with the given value.', () => {
    expect(stringHelper.replaceAll('$var $var', '$var', 'hey')).toBe('hey hey')
  });

  test('replaceAll with no matches in text to replace does nothing', () => {
    const text = 'How are you';
    expect(stringHelper.replaceAll(text, 'hey', 'hello')).toBe(text);
  })
});
