import React from "react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

interface SearchBarInputProps {
    searchValue: string;
    onSearch: (value: string) => void;
}

export default function SearchBarInput({
    searchValue,
    onSearch,
}: SearchBarInputProps) {
    return (
        <InputGroup>
            <Input
                variant="search"
                placeholder="Search"
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                py={0}
            />
            <InputRightElement mr="6px" mt="-1px">
                <Search2Icon color="white" fontSize="17px" />
            </InputRightElement>
        </InputGroup>
    );
}
