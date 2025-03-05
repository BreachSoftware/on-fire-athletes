import React, { useMemo } from "react";
import {
    Box,
    TextProps,
    BoxProps,
    Menu,
    Button,
    Flex,
    MenuButton,
    MenuItem,
    MenuList,
    useDisclosure,
    MenuProps,
    Input,
    ButtonProps,
    MenuGroup,
    CloseButton,
    HStack,
} from "@chakra-ui/react";
import SharedLabel from "./shared-label";
import { ChevronDownIcon, CheckIcon } from "@chakra-ui/icons";
import { useDebounce } from "./hooks/use-debounce";

export interface GenericSelectProps<T>
    extends Omit<ButtonProps, "value" | "onChange"> {
    label?: string;
    labelProps?: TextProps;
    containerProps?: BoxProps;
    displayTransformer?: (o: T) => string;
    secondaryDisplayTransformer?: (o: T) => string;
    searchByFields?: (keyof T)[];
    options: T[];
    selectedValue?: T | null;
    setSelectedValue: T extends undefined
        ? (selectedValue: T | null | undefined) => void
        : (selectedValue: T) => void;
    menuProps?: MenuProps;
    listItem?: (item: T) => React.ReactNode;
    clickToCancel?: boolean;
    placeholder?: string;
}

export default function GenericSelect<T>({
    label,
    labelProps,
    containerProps,
    displayTransformer = (o: T) => String(o),
    // secondaryDisplayTransformer,
    searchByFields,
    options,
    selectedValue,
    setSelectedValue,
    menuProps,
    listItem,
    clickToCancel,
    ...props
}: GenericSelectProps<T>) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [search, setSearch] = React.useState("");
    const debouncedSearch = useDebounce(search, 1000);
    const filtered = useMemo(() => {
        if (!searchByFields) {
            return options;
        }

        return options.filter((o) => {
            return searchByFields.some((field) => {
                const val = o[field];
                if (typeof val === "string") {
                    return val.toLowerCase().includes(search.toLowerCase());
                }
                return false;
            });
        });
    }, [debouncedSearch, options]);

    return (
        <Box {...containerProps}>
            {label && <SharedLabel {...labelProps}>{label}</SharedLabel>}
            <Menu isOpen={isOpen} onClose={onClose}>
                <HStack>
                    <MenuButton
                        as={Button}
                        variant="outline"
                        rightIcon={<ChevronDownIcon />}
                        textAlign="left"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onOpen();
                        }}
                        {...props}
                    >
                        {selectedValue
                            ? displayTransformer(selectedValue)
                            : props.placeholder || "Select"}
                    </MenuButton>
                    {clickToCancel && !!selectedValue && (
                        <CloseButton
                            size={props?.size || "md"}
                            onClick={() => setSelectedValue(undefined as T)}
                        />
                    )}
                </HStack>
                <MenuList
                    maxH={"296px"}
                    maxW="380px"
                    minW="280px"
                    overflowY="auto"
                    zIndex={40}
                    {...menuProps}
                >
                    <MenuGroup>
                        {searchByFields && (
                            <Box p={3}>
                                <Input
                                    placeholder="Search..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onBlur={(e) => {
                                        e.target.focus();
                                    }}
                                />
                            </Box>
                        )}
                    </MenuGroup>
                    {filtered &&
                        filtered.map((o, index) => {
                            const curVal = o;
                            return (
                                <MenuItem
                                    key={`${displayTransformer(o)}-${index}`}
                                    icon={
                                        selectedValue === curVal ? (
                                            <CheckIcon />
                                        ) : (
                                            <Box w="12px" />
                                        )
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setSelectedValue(curVal);
                                    }}
                                >
                                    <Flex align="center">
                                        {listItem ? (
                                            listItem(o)
                                        ) : (
                                            <>{displayTransformer(o)}</>
                                        )}
                                    </Flex>
                                </MenuItem>
                            );
                        })}
                </MenuList>
            </Menu>
        </Box>
    );
}
