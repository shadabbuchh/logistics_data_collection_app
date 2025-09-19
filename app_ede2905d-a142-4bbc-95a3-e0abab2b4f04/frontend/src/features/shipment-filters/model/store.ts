import { create } from 'zustand';

interface ShipmentFilters {
  status?: string;
  timeWindow?: string;
  priority?: string;
  search?: string;
}

interface ShipmentFiltersState {
  filters: ShipmentFilters;
  setFilter: (key: keyof ShipmentFilters, value: string | undefined) => void;
  clearFilters: () => void;
}

export const useShipmentFiltersStore = create<ShipmentFiltersState>(set => ({
  filters: {},
  setFilter: (key, value) =>
    set(state => ({
      filters: {
        ...state.filters,
        [key]: value || undefined,
      },
    })),
  clearFilters: () =>
    set(() => ({
      filters: {},
    })),
}));
