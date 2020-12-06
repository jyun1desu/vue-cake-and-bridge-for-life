//建立新牌組
function buildNewDeck() {
    const suit = ['Spades', 'heart', 'diamond', 'club'];
    const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const deck = []
    for (i = 0; i < suit.length; i++) {
        let card = {};
        for (j = 0; j < number.length; j++) {
            card = {
                suit: suit[i],
                number: number[j]
            }
            deck.push(card)
        }
    }
    return deck
}
//洗牌
function shuffle(deck) {
    let i = deck.length;
    while (i > 1) {
        let index = Math.floor(Math.random() * i--);
        [deck[i], deck[index]] = [deck[index], deck[i]]
    }
    return deck
}
//發牌(給四個玩家)
function dealCards(playerAmount, deck) {
    const players = [];
    for (let i = 0; i < playerAmount; i++) {
        const eachPlayer = [];
        players.push(eachPlayer)
    }
    for (let i = 0; i < deck.length; i = i + 4) {
        players[0].push(deck[i]);
        players[1].push(deck[i + 1]);
        players[2].push(deck[i + 2]);
        players[3].push(deck[i + 3]);
    }
    const sorted = players.map(cards => sortCards(cards))
    return sorted
}
//排序牌
function sortCards(cards) {
    const sorted = cards.sort((cardA, cardB) => {
        const order = ['Spades', 'heart', 'club', 'diamond'];
        cardA = 100 * (4 - order.indexOf(cardA.suit)) + 13 - cardA.number
        cardB = 100 * (4 - order.indexOf(cardB.suit)) + 13 - cardB.number
        return cardB - cardA
    })
    return sorted
}
console.log(dealCards(4, shuffle(buildNewDeck())))