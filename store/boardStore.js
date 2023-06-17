import { create } from "zustand";

const useBoardStore = create((set, get) => ({
  groups: [],
  cards: [],
  searchQuery: "",
  filteredCards: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStartupGroups: (data) => {
    set({ groups: data });
  },
  setCards: (data) => set({ cards: data }),
  createGroup: (data) => set((state) => ({ groups: [...state.groups, data] })),
  createCard: (data) => set((state) => ({ cards: [...state.cards, data] })),
  editCard: (id, data) =>
    set((state) => ({
      cards: state.cards.map((card) => {
        if (card.id === id) return data;
        else return card;
      }),
    })),
  getCardById: (id) => {
    const state = get();
    return state.cards.find((card) => card.id === id);
  },
  filterCards: () => {
    set((state) => {
      const { cards, searchQuery } = state;
      if (!searchQuery) {
        // If search query is empty, show all cards
        return { filteredCards: cards};
      }
      // Filter cards based on search query
      const filteredCards = cards.filter((card) =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return { filteredCards };
    });
  },
}));

export default useBoardStore;
