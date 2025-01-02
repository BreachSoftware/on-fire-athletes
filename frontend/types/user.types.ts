export type UserFields = {
    uuid: string;
    avatar?: string | null;
    bio?: string | null;
    bought_cards?: any[] | null; // TODO, define this type
    cards?: any[] | null;
    stripe_customer_id?: string | null;
    email: string;
    facebookLink?: string | null;
    first_name: string | null;
    generated: number | null;
    hometown?: string | null;
    instagramLink?: string | null;
    last_name: string | null;
    media?: any[] | null;
    position?: string | null;
    snapchatLink?: string | null;
    socials?: any[] | null;
    team?: string | null;
    team_hometown?: string | null;
    tiktokLink?: string | null;
    xLink?: string | null;
    youtubeLink?: string | null;
    subscription_expires_at?: number | null;
    subscription_id?: string | null;
};
