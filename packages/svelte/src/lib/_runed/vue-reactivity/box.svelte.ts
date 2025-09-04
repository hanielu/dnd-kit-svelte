import {isObject} from '../is.js';

export const BoxSymbol = Symbol('box');

export type Box<T = any, S = T> = {
	[BoxSymbol]: true;
	get current(): T;
	set current(_: S);
};

export function box<T>(value: T): Box<T> {
	let _state = $state(value);

	return {
		[BoxSymbol]: true,
		get current() {
			return _state;
		},
		set current(v: T) {
			_state = v;
		},
	};
}

export function isBox<T>(r: Box<T> | unknown): r is Box<T>;
export function isBox(r: unknown): r is Box {
	return isObject(r) && BoxSymbol in r;
}
