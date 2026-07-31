import { create } from 'zustand'

const userConversation = create((set, get) => ({
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

    messages: [],
    setMessages: (messages) => set({ messages }),

    // { [userId]: count }
    unreadCounts: {},

    incrementUnread: (userId) =>
        set((state) => ({
            unreadCounts: {
                ...state.unreadCounts,
                [userId]: (state.unreadCounts[userId] || 0) + 1,
            },
        })),

    clearUnread: (userId) =>
        set((state) => {
            const updated = { ...state.unreadCounts };
            delete updated[userId];
            return { unreadCounts: updated };
        }),
}))

export default userConversation

