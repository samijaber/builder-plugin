import appState from '@builder.io/app-context';
import { reaction } from 'mobx';

export function enableAgentFirst() {
  const openedProjects = new Set<string>();

  return reaction(
    () => {
      const fusion = appState.fusion;
      return {
        projectId: fusion?.editor.currentProject?.value?.id,
        ready: Boolean(fusion?.initState.isComplete && fusion.isAgentTabEnabled),
      };
    },
    ({ projectId, ready }) => {
      if (!projectId || !ready || openedProjects.has(projectId)) return;
      openedProjects.add(projectId);
      appState.contentEditorPage.codeEditorOpen = false;
      appState.fusion!.editor.interactMode = false;
    },
    { name: 'samijaber-builder-plugin:agent-first', fireImmediately: true }
  );
}
