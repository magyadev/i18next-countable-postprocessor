export default {
  name: 'countable',
  type: 'postProcessor',

  options: {
    variantSeparator: '_',
    countVariableName: 'count',
  },

  setOptions(options) {
    Object.keys(options).forEach(optionKey => {
      /* istanbul ignore else*/
      if(typeof options[optionKey] === 'string') {
        this.options[optionKey] = options[optionKey];
      }
    })
  },

  buildTryKeysList: function({ translationKey, variantSeparator, count }) {
    const countString = String(count);

    const tryKeys = [ 
        `${translationKey}${variantSeparator}${countString}`, 
    ];

    /* istanbul ignore else*/
    if (countString.length > 2) {
      tryKeys.push(`${translationKey}${variantSeparator}*${countString}`);
      tryKeys.push(`${translationKey}${variantSeparator}*${countString.substr(-3)}`);
    }

    /* istanbul ignore else*/
    if (countString.length > 1) {
        tryKeys.push(`${translationKey}${variantSeparator}*${countString.substr(-2)}`);
    }
    
    tryKeys.push(`${translationKey}${variantSeparator}*${countString.substr(-1)}`);
 
    /* istanbul ignore else*/
    if (count > 1) {
      tryKeys.push(`${translationKey}${variantSeparator}plural`);
    }

    tryKeys.push(translationKey);

    return tryKeys;
  },

  process(value, key, options, translator) {
    const { postProcess, variantSeparator, translationKeyword, ...forwardOptions } = { ...this.options, ...options };
    const countVariableName = forwardOptions.countVariableName;
    const count = forwardOptions[countVariableName];
   
    if (typeof count === 'undefined') {
      return value;
    }

    const keys = Array.isArray(key) ? key : [ key ];
    let tryKeys = [];

    for (let i = 0; i < keys.length; i++) {
      tryKeys = [
        ...tryKeys,
        ...this.buildTryKeysList({ translationKey: keys[i], count, variantSeparator }),
      ];
    }

    return translator.translate(tryKeys, forwardOptions) || value;
  }
}
