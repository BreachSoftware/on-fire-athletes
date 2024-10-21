import TradingCardInfo from "@/hooks/TradingCardInfo";
import { useEffect, useRef, useState } from "react";
import SerializedTradingCard from "@/hooks/SerializedTradingCard";
import PaginatedList from "@/app/lockerroom/components/PaginatedList";

interface CardListGridProps {
    cardList: TradingCardInfo[] | SerializedTradingCard[];
    currentUserId: string;
    currentCard: TradingCardInfo;
    privateView: boolean;
    itemsPerPage: number;
    tabName: string;
    // eslint-disable-next-line no-undef
    navigateToTopOfList: React.RefObject<HTMLDivElement>;
    setCurrentCard: (card: TradingCardInfo) => void;
    setCurrentSerializedCard?: (card: SerializedTradingCard) => void;
    onSendCardModalOpen: () => void;
    loginModalOpen: () => void;
    onAddToCollectionModalOpen: () => void;
    setViewCardClicked: (clicked: boolean) => void;
}

/**
 * This component is responsible for rendering the grid of cards that the user has created.
 * @returns the React component for the card list grid
 */
export default function CardListGrid(props: CardListGridProps) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [checkedInitialLoad, setCheckedInitialLoad] = useState(false);

    const targetRef = useRef<HTMLDivElement>(null);

    // UseEffect to scroll to the top of the page when the page changes
    useEffect(() => {
        // Scroll to the top of the page when the page changes if the page didn't just load
        if (
            (!props.currentCard || checkedInitialLoad) &&
            props.navigateToTopOfList.current
        ) {
            props.navigateToTopOfList.current.scrollIntoView({
                behavior: "smooth",
            });
        } else {
            setCheckedInitialLoad(true);
        }
        // Disabled because currentCard and checkedInitialLoad are not dependencies here
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage]);

    return (
        // Paginated List of Cards
        <PaginatedList
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={props.itemsPerPage}
            data={props.cardList}
            targetRef={targetRef}
            hideMobilePadding
            profilePage
            profilePageProps={{
                currentCard: props.currentCard,
                setCurrentCard: props.setCurrentCard,
                setViewCardClicked: props.setViewCardClicked,
                setCurrentSerializedCard: props.setCurrentSerializedCard,
                tabName: props.tabName,
                currentUserId: props.currentUserId,
                onSendCardModalOpen: props.onSendCardModalOpen,
                loginModalOpen: props.loginModalOpen,
                onAddToCollectionModalOpen: props.onAddToCollectionModalOpen,
                privateView: props.privateView,
            }}
        />
    );
}
