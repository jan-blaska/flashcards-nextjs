export type FlashcardSideProps = {
    text?: string;
    secondaryText?: string;
};

export type FlashcardProps = {
    id?: string,
    frontSide?: FlashcardSideProps;
    backSide?: FlashcardSideProps;
};