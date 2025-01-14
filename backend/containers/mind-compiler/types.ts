export interface CardData {
    frontPrintTradingCard: string | null;
    backPrintTradingCard?: string | null;
    frontPrintBagTag?: string | null;
    backPrintBagTag?: string | null;
}

export interface CompilationResult {
    s3Url: string;
    imageCount: number;
    compilationDuration: number;
}

export type Base64String = string;
export type S3Url = string;
