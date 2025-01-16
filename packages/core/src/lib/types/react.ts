import type {Without} from '@dnd-kit-svelte/utilities';
import type {DOMAttributes} from 'svelte/elements';

export type SyntheticEventName = keyof Without<DOMAttributes<any>, 'children'>;
