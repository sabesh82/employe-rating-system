import { create } from "zustand";

type OrgStore = {
  orgId: string | null;
  setOrgId: (id: string) => void;
};

export const useOrgStore = create<OrgStore>((set) => ({
  orgId: null,
  setOrgId: (id) => set({ orgId: id }),
}));
