import TradingCardInfo from "./TradingCardInfo";

export default class SerializedTradingCard {
	serialNumber: number;
	TradingCardInfo: TradingCardInfo;

	/**
	 * Constructor for SerializedTradingCard
	 * @param serialNumber - The serial number of the card
	 * @param TradingCardInfo - The TradingCardInfo object of the card
	 */
	constructor(serialNumber: number, TradingCardInfo: TradingCardInfo) {
		this.serialNumber = serialNumber;
		this.TradingCardInfo = TradingCardInfo;
	}
}
