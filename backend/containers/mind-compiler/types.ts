export interface CardData {
    frontPrintTradingCard: string | null;
    backPrintTradingCard?: string | null;
    frontPrintBagTagS3URL?: string | null;
    backPrintBagTagS3URL?: string | null;
}

export interface CompilationResult {
    s3Url: string;
    imageCount: number;
    compilationDuration: number;
}

export type Base64String = string;
export type S3Url = string;
