import i18next from 'i18next';
import countableProcessor from '../src';
import { expect } from 'chai';

describe('countable postprocessor', () => {
  before(() => {
    i18next
      .use(countableProcessor)
      .init({
        lng: 'en'
      });
  });

  describe('basic', () => {
    before(() => {
      i18next.addResourceBundle('en', 'case1', {
        "key1_1": '{{count}} rekord',
        "key1_*2": '{{count}} rekordy',
        "key1_12": '{{count}} rekordów',
        "key1_plural": '{{count}} rekordów',
      });

      i18next.addResourceBundle('en', 'case2', {
        "key2_1": '{{count}} rekord',
        "key2_plural": '{{count}} rekordów',
        "key2_*2": '{{count}} rekordy',
        "key2_12": '{{count}} rekordów',
        "key2": '{{count}} zzz',
      });

      i18next.addResourceBundle('en', 'case3', {
        "key3_plural": 'More than one record',
        "key3_1": 'Exactly one record',
        "key3_0": 'No records',
      });

      i18next.addResourceBundle('en', 'case4', {
        "key4": 'Uploading {{what}}. Progress: {{count}}%',
        "key4_100": 'Upload is done.',
      });


      i18next.setDefaultNamespace('case1');
    });

    var tests = [
      {args: ['key1', { postProcess: 'countable', count: 1}], expected: '1 rekord'},
      {args: ['key1', { postProcess: 'countable', count: 2}], expected: '2 rekordy'},
      {args: ['key1', { postProcess: 'countable', count: 12}], expected: '12 rekordów'},
      {args: ['key1', { postProcess: 'countable', count: 5}], expected: '5 rekordów'},

      {args: ['key2', { ns: 'case2', postProcess: 'countable', count: 5}], expected: '5 rekordów'},
      {args: ['key2', { ns: 'case2', postProcess: 'countable', count: 12}], expected: '12 rekordów'},
      {args: ['key2', { ns: 'case2', postProcess: 'countable', count: 100}], expected: '100 rekordów'},

      {args: ['case3:key3', { postProcess: 'countable', count: 0}], expected: 'No records'},
      {args: ['case3:key3', { postProcess: 'countable', count: 1}], expected: 'Exactly one record'},
      {args: ['case3:key3', { postProcess: 'countable', count: 50}], expected: 'More than one record'},

      {args: ['key4', { ns: 'case4', postProcess: 'countable', count: 52, what: 'image'}], expected: 'Uploading image. Progress: 52%'},
      {args: ['key4', { ns: 'case4', postProcess: 'countable', count: 100, what: 'image' }], expected: 'Upload is done.'},
    ];

    tests.forEach((test) => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(i18next.t.apply(i18next, test.args)).to.eql(test.expected);
      });
    });
  });
});
