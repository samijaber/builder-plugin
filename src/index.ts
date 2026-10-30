import appState from '@builder.io/app-context';
import { when } from 'mobx';
import { enableAgentFirst } from './agent-first';

const OWNER_USER_ID = 'OcOewqA7uqVVlVfqY453F8vgcc33';

when(
  () => appState.user.id !== null,
  () => {
    if (appState.user.id === OWNER_USER_ID) enableAgentFirst();
  },
  { name: 'samijaber-builder-plugin:owner-gate' }
);
