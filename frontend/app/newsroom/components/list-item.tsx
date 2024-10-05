import { ListItem, type ListItemProps } from "@chakra-ui/layout";

export default function ArticleListItem({ children, ...rest }: ListItemProps) {
    return (
        <ListItem fontFamily="Helvetica Neue" {...rest}>
            {children}
        </ListItem>
    );
}
