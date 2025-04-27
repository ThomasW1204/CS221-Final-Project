export function generateSets(totalSets) {
    const cardSets = [];

    for (let i = 1; i <= n; i++) {
        cardSets.push({
            setName: `CardSet_${i}`, // Unique set name
            flashcards: [
                {
                    term: `Term_${i}`,        // Term for the flashcard
                    definition: `Definition_${i}` // Corresponding definition
                }
            ]
        });
    }

    return cardSets;

};