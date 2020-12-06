function buildNewDeck(deck=[]){
    const suit = ['Spades','heart','diamond','club'];
    const number = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    for(i=0;i<suit.length;i++){
        let card={};
        for(j=0;j<number.length;j++){
            card = {
                suit:suit[i],
                number:number[j]
            }
            deck.push(card)
        }
    }
    return deck
}

const deck = buildNewDeck();
console.log(deck)