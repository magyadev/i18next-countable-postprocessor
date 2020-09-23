import { PostProcessorModule } from "i18next";

interface CountableOptions {
	translationKeyword: string;
	variantSeparator: string;
	countVariableName: string;
	keyFilterFn: function;
}

declare const countable: PostProcessorModule & {
	name: 'countable';
	type: 'postProcessor';
	options: CountableOptions;
	setOptions: (options: Partial<CountableOptions>) => void;
};

export = countable;
