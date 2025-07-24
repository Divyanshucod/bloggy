
export type customeElement = {
    type: string;
        children: customElementChildren;
        url?: string | undefined;
        align?: string | undefined;
    }

export type customElementChildren = {
    text: string;
    code?: boolean | undefined;
    bold?: boolean | undefined;
    superscript?: boolean | undefined;
    italic?: boolean | undefined;
    underline?: boolean | undefined;
    subscript?: boolean | undefined;
    highlight?: boolean | undefined;
    strikethrough?: boolean | undefined;
}[];
export const cookie_name = 'medium-cookie'