import { FontReference } from "../../_interface/fontReference";

export const countDownFont: FontReference = {
    src: "./fonts/abc.woff",
    name: "abc"
}

export const defaultFont: FontReference = {
    src: "./fonts/Helvetica.woff",
    name: "Helvetica"
}

export const allFonts: FontReference[] =
    [
        countDownFont,
        defaultFont
    ]