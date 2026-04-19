import { SheriffConfig } from '@softarc/sheriff-core';

export default {
  tagging: {
    'src/app/<_>':                'app',
    'src/shared/<type>':      'shared',
    'src/entities/<slice>':   'entity',
    'src/features/<slice>':   'feature',
    'src/widgets/<slice>':    'widget',
    'src/pages/<slice>':      'page',
  },

  depRules: {
    'root':     ['app', 'shared', 'entity', 'feature', 'widget', 'page'],
    'app':      ['shared', 'entity', 'feature', 'widget', 'page'],
    'page':     ['shared', 'entity', 'feature', 'widget'],
    'widget':   ['shared', 'entity', 'feature'],
    'feature':  ['shared', 'entity'],
    'entity':   ['shared'],
    'shared':   ['shared'],
  }
} satisfies SheriffConfig;
