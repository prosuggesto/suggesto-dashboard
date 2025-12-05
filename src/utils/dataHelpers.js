/**
 * Transforms a ranked object (e.g., { top1: "Val", top2: "Val" }) into an array.
 * @param {Object} obj - The object containing ranked items.
 * @returns {Array} - Array of objects [{ name: "Val", rank: 1 }, ...].
 */
export const transformRankedData = (obj) => {
    if (!obj) return [];
    return Object.entries(obj)
        .sort((a, b) => {
            const rankA = parseInt(a[0].replace('top', ''), 10);
            const rankB = parseInt(b[0].replace('top', ''), 10);
            return rankA - rankB;
        })
        .map(([key, value]) => ({
            name: value,
            rank: parseInt(key.replace('top', ''), 10)
        }));
};

/**
 * Transforms a questions object (e.g., { Q1: { ... }, Q2: { ... } }) into an array.
 * @param {Object} obj - The object containing questions.
 * @returns {Array} - Array of question objects.
 */
export const transformQuestions = (obj) => {
    if (!obj) return [];
    return Object.entries(obj)
        .sort((a, b) => {
            const numA = parseInt(a[0].replace('Q', ''), 10);
            const numB = parseInt(b[0].replace('Q', ''), 10);
            return numA - numB;
        })
        .map(([key, value]) => {
            // If value is a string, it's the old format or simple format
            if (typeof value === 'string') {
                return { text: value, id: key };
            }
            // If value is an object, it's the new format
            return {
                id: key,
                text: value.question,
                reponse: value.reponse,
                produit: value.produit
            };
        });
};
