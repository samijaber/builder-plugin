declare module '@builder.io/app-context' {
  interface FusionEditor {
    interactMode: boolean;
    currentProject?: { value?: { id?: string } };
  }

  interface AppState {
    user: { id: string | null };
    fusion?: {
      isAgentTabEnabled: boolean;
      initState: { isComplete: boolean };
      editor: FusionEditor;
    };
    contentEditorPage: { codeEditorOpen: boolean };
  }

  const appState: AppState;
  export default appState;
}
