"use-client";

import React, {
    createContext,
    useContext,
    useState,
    PropsWithChildren,
} from "react";
import { Item } from "./page";

const ColorItemContext = createContext<ColorItemProviderType>({
    items: [],
    selectedItems: [],
    setSelectedItems: () => {},
    handleButtonClick: () => {},
});

interface ColorItemProviderProps extends PropsWithChildren {
    items: Item[];
}

export function ColorItemProvider({ items, children }: ColorItemProviderProps) {
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);

    const handleButtonClick = (item: Item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(
                selectedItems.filter((selected) => selected.id !== item.id),
            );
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    return (
        <ColorItemContext.Provider
            value={{
                items,
                selectedItems,
                setSelectedItems,
                handleButtonClick,
            }}
        >
            {children}
        </ColorItemContext.Provider>
    );
}
type SetItems = (items: Item[] | ((prev: Item[]) => Item[])) => void;
type ColorItemProviderType = {
    items: Item[];
    selectedItems: Item[];
    setSelectedItems: SetItems;
    handleButtonClick: (item: Item) => void;
};

export const useColorItemContext = () => {
    return useContext(ColorItemContext);
};
