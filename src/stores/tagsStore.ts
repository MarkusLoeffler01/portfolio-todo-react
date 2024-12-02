import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Tag } from "@/components/dragdrop/TagList";


const tags = [{id: 0, name: "Work"}, {id: 1, name: "Personal"}, {id: 2, name: "Urgent"}];


interface TagState {
    tags: Tag[];
    setTags: (tags: Tag[]) => void;
    removeTag: (tag: Tag) => void;
    addTag: (tag: string) => void;
}


export const useTagsStorePersisted = create(
    persist<TagState>(
        (set, get) => ({
            tags: tags,
            addTag: (tag: string) => {
                const newTag = { id: (get().tags.length + 1), name: tag };
                set({ tags: [...get().tags, newTag] });
            },
            removeTag: (tag: Tag) => set({ tags: get().tags.filter((t) => t.id !== tag.id) }),
            setTags: (tags) => set({ tags })
        }),
        {
            name: "tags",
            storage: createJSONStorage(() => localStorage),
            version: 1
        }
    )
);