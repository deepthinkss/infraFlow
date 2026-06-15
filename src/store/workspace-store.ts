import { create } from "zustand";

type InspectorTab = "config" | "runtime";

type WorkspaceState = {
  selectedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: InspectorTab;
  setSelectedAppId: (selectedAppId: string) => void;
  setSelectedNodeId: (selectedNodeId: string | null) => void;
  setMobilePanelOpen: (isMobilePanelOpen: boolean) => void;
  setActiveInspectorTab: (activeInspectorTab: InspectorTab) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedAppId: null,
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: "config",
  setSelectedAppId: (selectedAppId) =>
    set({
      selectedAppId,
      selectedNodeId: null,
      isMobilePanelOpen: false,
      activeInspectorTab: "config",
    }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
  setMobilePanelOpen: (isMobilePanelOpen) => set({ isMobilePanelOpen }),
  setActiveInspectorTab: (activeInspectorTab) => set({ activeInspectorTab }),
}));
