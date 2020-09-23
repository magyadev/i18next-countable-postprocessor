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

  describe('translating', () => {
    before(() => {
      beforeEach(() => {   
        countableProcessor.setOptions({
          variantSeparator: '_',
          countVariableName: 'count',
        });
      });

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

  describe('configuration', () => {
    beforeEach(() => {   
      countableProcessor.setOptions({
        variantSeparator: '-',
        countVariableName: 'number',
      });

      i18next.addResourceBundle('en', 'case5', {
        "key5-1": 'Should found this phrase and insert number here: {{number}}',
        "key5_1": 'Should ommit this phrase',
      });

      i18next.setDefaultNamespace('case5');
    });

    afterEach(() => {
      countableProcessor.setOptions({
        variantSeparator: '_',
        countVariableName: 'count',
      });
    });
    
    var tests = [
      {args: ['key5', { postProcess: 'countable', number: 1}], expected: 'Should found this phrase and insert number here: 1'},
    ];

    tests.forEach((test) => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(i18next.t.apply(i18next, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('fallback', () => {
    before(() => {
      i18next.addResourceBundle('en', 'case6', {
        "key6_1": 'Should ignore this if count parameter not provided',
        "key6": 'Should use this default key',
      });
      
      i18next.addResourceBundle('en', 'case7', {
        "key7_2": 'Should fallback to plural',
        "key7": 'Default translation',
        "key7_plural": 'Plural translation',
      });

      i18next.addResourceBundle('en', 'case8', {
        "key8_2": 'Should fallback to default',
        "key8": 'Default translation',
      });

      i18next.addResourceBundle('en', 'case9', {
        "key9": 'Should fallback to default',
      });
      
      i18next.setDefaultNamespace('case6');
    });

    var tests = [
      {args: ['key6', { postProcess: 'countable', count: 3 }], expected: 'Should use this default key'},
      {args: ['key66', { postProcess: 'countable', count: 3 }], expected: 'key66'},
      {args: ['key6', { postProcess: 'countable' }], expected: 'Should use this default key'},
      {args: ['key7', { ns: 'case7', postProcess: 'countable', count: 3 }], expected: 'Plural translation'},
      {args: ['key8', { ns: 'case8', postProcess: 'countable', count: 3 }], expected: 'Default translation'},
    ];

    tests.forEach((test) => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(i18next.t.apply(i18next, test.args)).to.eql(test.expected);
      });
    });
  });

  describe('priorities', () => {
    before(() => {
      i18next.addResourceBundle('en', 'case9', {
        "key9_*2": '*2',
        "key9_*22": '*22',
        "key9_322": '322',
        "key9_2": '2',
      });
      i18next.setDefaultNamespace('case9');
    });

    var tests = [
      {args: ['key9', { postProcess: 'countable', count: 2 }], expected: '2'},
      {args: ['key9', { postProcess: 'countable', count: 22 }], expected: '*22'},
      {args: ['key9', { postProcess: 'countable', count: 322 }], expected: '322'},
      {args: ['key9', { postProcess: 'countable', count: 32 }], expected: '*2'},
      {args: ['key9', { postProcess: 'countable', count: 122 }], expected: '*22'},
      {args: ['key9', { postProcess: 'countable', count: 102 }], expected: '*2'},
    ];

    tests.forEach((test) => {
      it('correctly translates for ' + JSON.stringify(test.args) + ' args', () => {
        expect(i18next.t.apply(i18next, test.args)).to.eql(test.expected);
      });
    });
  });
});
