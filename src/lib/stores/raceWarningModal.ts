import { writable } from 'svelte/store';

type ModalState = {
  visible: boolean;
  raceId: string | null;
};

function createModalStore() {
  const { subscribe, set, update } = writable<ModalState>({
    visible: false,
    raceId: null
  });

  return {
    subscribe,
    show: (raceId: string) => set({ visible: true, raceId }),
    close: () => set({ visible: false, raceId: null })
  };
}

export const raceWarningModal = createModalStore();
