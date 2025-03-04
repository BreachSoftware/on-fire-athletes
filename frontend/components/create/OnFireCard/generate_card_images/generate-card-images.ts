import TradingCardInfo from "@/hooks/TradingCardInfo";
import { generateArCardBackImage } from "./generate-print-card-back";
import { generatePrintCardFrontImage } from "./generate-print-card-front";

export async function generateAllCardFronts(fetchedCards: TradingCardInfo[]) {
    const results: Record<
        string,
        {
            imgData: string;
            uuid: string;
        }
    > = {};
    for (let i = 0; i < fetchedCards.length; i++) {
        const card = fetchedCards[i];
        const image = await generatePrintCardFrontImage(
            card.cardImage,
            card.borderColor,
        );
        results[`${card.firstName}_${card.lastName}`] = {
            imgData: image,
            uuid: card.uuid,
        };
    }

    // write results to file
    const jsonString = JSON.stringify(results, null, 2);
    writeJsonToFile(jsonString, "card-fronts.json");
}

export async function generateAllCardBacks(fetchedCards: TradingCardInfo[]) {
    const results: Record<
        string,
        {
            imgData: string;
            uuid: string;
        }
    > = {};

    for (let i = 0; i < fetchedCards.length; i++) {
        console.log(i);

        const card = fetchedCards[i];
        const arCardBack = await generateArCardBackImage(card, {
            totalOverride: 1,
            forPrint: true,
            noNumber: true,
        });
        const fileName1of1 =
            `${card.firstName}_${card.lastName}`.trim() + "_0of0";
        // `${card.firstName}_${card.lastName}`.trim() + "_1of1";
        results[fileName1of1] = {
            imgData: arCardBack,
            uuid: card.uuid,
        };
        // const promises = [...new Array(card.totalCreated)].map(
        //     async (_, index) => {
        //         const editionNumber = index + 1;
        //         const fileName =
        //             `${card.firstName}_${card.lastName}`.trim() +
        //             `_${editionNumber}of${card.totalCreated}`;
        //         const arCardBack = await generateArCardBackImage(card, {
        //             editionNumber,
        //             forPrint: true,
        //         });
        //         results[fileName] = {
        //             imgData: arCardBack,
        //             uuid: card.uuid,
        //         };
        //     },
        // );
        // await Promise.all(promises);
    }

    // write results to file, without using fs
    const jsonString = JSON.stringify(results, null, 2);
    writeJsonToFile(jsonString, "card-backs.json");
}

function writeJsonToFile(jsonString: string, fileName?: string) {
    const blob = new Blob([jsonString], {
        type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    // @ts-ignore
    a.href = url;
    // @ts-ignore
    a.download = fileName || "download.json";
    // @ts-ignore
    a.click();
}
