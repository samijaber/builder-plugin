import appState from '@builder.io/app-context';
import { reaction } from 'mobx';

const GRACE_PERIOD_MS = 10_000;
const LOG_PREFIX = '[samijaber/builder-plugin]';

function showAgentTab() {
  appState.contentEditorPage.codeEditorOpen = false;
  appState.fusion!.editor.interactMode = false;
}

// Other load-time code sets Interact after we run, so keep re-asserting Agent
// until the user's first click or keypress, or the grace period ends.
function holdAgentTab(key: string) {
  console.debug(LOG_PREFIX, 'opening Agent tab for', key);
  showAgentTab();

  const stopWatching = reaction(
    () => appState.fusion?.editor.interactMode,
    interactMode => {
      if (!interactMode) return;
      console.debug(LOG_PREFIX, 'Interact was re-selected during load, switching back to Agent');
      showAgentTab();
    },
    { name: 'samijaber-builder-plugin:hold-agent-tab' }
  );

  const stop = () => {
    stopWatching();
    clearTimeout(timer);
    document.removeEventListener('pointerdown', stop, true);
    document.removeEventListener('keydown', stop, true);
  };
  const timer = setTimeout(stop, GRACE_PERIOD_MS);
  document.addEventListener('pointerdown', stop, true);
  document.addEventListener('keydown', stop, true);

  return stop;
}

export function enableAgentFirst() {
  const handled = new Set<string>();
  let stopHolding: (() => void) | undefined;

  console.debug(LOG_PREFIX, 'agent-first enabled');

  return reaction(
    () => {
      const fusion = appState.fusion;
      const projectId = fusion?.editor.currentProject?.value?.id;
      const branchId = fusion?.editor.currentBranch?.id;
      return {
        key: projectId ? `${projectId}:${branchId ?? ''}` : undefined,
        ready: Boolean(fusion?.initState.isComplete && fusion.isAgentTabEnabled),
      };
    },
    ({ key, ready }) => {
      if (!key || !ready || handled.has(key)) return;
      handled.add(key);
      stopHolding?.();
      stopHolding = holdAgentTab(key);
    },
    { name: 'samijaber-builder-plugin:agent-first', fireImmediately: true }
  );
}
