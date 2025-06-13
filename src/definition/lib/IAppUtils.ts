import { BlockBuilder } from '../../lib/BlockBuilder';
import { ElementBuilder } from '../../lib/ElementBuilder';

/**
 * App utilities interface for UI builders
 */
export interface IAppUtils {
    elementBuilder: ElementBuilder;
    blockBuilder: BlockBuilder;
} 