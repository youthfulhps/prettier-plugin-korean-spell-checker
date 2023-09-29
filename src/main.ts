import prettier from 'prettier';
import spellCheckerV3Plugin from './v3';

const isV3 = prettier.version.startsWith('3.');

// TODO: v2
const plugin = isV3 ? spellCheckerV3Plugin : spellCheckerV3Plugin;

export default plugin;
