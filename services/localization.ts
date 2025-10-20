// A placeholder for a more complex localization service.
// For this app, we are not implementing full i18n.

type LocalizationStrings = {
    [key: string]: string;
};

const strings: LocalizationStrings = {
    welcome: "Welcome",
    startQuiz: "Start Quiz",
};

export const t = (key: string): string => {
    return strings[key] || key;
};
