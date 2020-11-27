// to run node black-jack.js
const redux = require("redux")

// store, actions, reducer

// initialize - start with a fresh deck
//shuffle - shuffle the deck
// deal - give two cards to dealer and the player
// hit - give one card just to the player

// const storeStructure = {
//   deck: [],
//   dealer: [],
//   player: []
// }

//returns a fresh unshuffled deck
function createDeck() {
  const suits = ["heart", "diamonds", "spades", "clubs"]
  const faces = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"]
  const deck = []

  for (suit of suits) {
    for (face of faces) {
      deck.push({ suit: suit, face: face })
    }
  }
  return deck
}

// reducer

const reducer = (state, action) => {
  if (state === undefined) {
    return {
      deck: createDeck(),
      dealer: [],
      player: []
    }
  }

  switch (action.type) {
    case "DEAL": {
      const copy = [...state.deck]
      return {
        deck: copy,
        dealer: [copy.pop(), copy.pop()],
        player: [copy.pop(), copy.pop()]
      }
    }
    case "HIT": {
      if (state.deck.length < 1) {
        return state
      }
      if (handvalue(state.player) >= 21) {
        return state
      }
      const copy = [...state.deck]
      return {
        deck: copy,
        dealer: state.dealer,
        player: [...state.player, copy.pop()]
      }
    }
    case "SHUFFLE": {
      const copy = [...state.deck]
      //shuffle the deck by Fisher-Yates algorithm
      //swap every index of an array with a randomly-chosen index
      // math.random() gives 0<=num<1
      for (let index in copy) {
        // pick a random index
        let swapIndex = Math.floor(Math.random() * copy.length)
        // swap two carda between current index and random index
        let temp = copy[swapIndex]
        copy[swapIndex] = copy[index]
        copy[index] = temp
      }
      return {
        deck: copy,
        dealer: state.dealer,
        player: state.player
      }
    }
    case "FINISH_HAND": {
      return {
        deck: [...state.deck, ...state.dealer, ...state.player],
        dealer: [],
        player: []
      }
    }
    default: {
      return state
    }
  }
}

function cardValue(card) {
  if (card.face === "A") {
    return 11
  } else if ("JQK".indexOf(card.face) >= 0) {
    return 10
  } else {
    return card.face
  }
}

function handvalue(hand) {
  return hand.map(cardValue).reduce((a, b) => a + b, 0)
}

const store = redux.createStore(reducer)
store.subscribe(() => {
  const state = store.getState()
  const dealerScore = handvalue(state.dealer)
  const playerScore = handvalue(state.player)

  console.log("deck: " + state.deck.length)
  console.log(dealerScore, " dealer: ", state.dealer)
  console.log(playerScore, " player: ", state.player)
})

// store.dispatch({ type: "SHUFFLE" })
// store.dispatch({ type: "DEAL" })
// store.dispatch({ type: "HIT" })
// store.dispatch({ type: "HIT" })
// store.dispatch({ type: "FINISH_HAND" })
// store.dispatch({ type: "SHUFFLE" })
// store.dispatch({ type: "DEAL" })
// store.dispatch({ type: "HIT" })
// store.dispatch({ type: "HIT" })

const keypress = require("keypress")
keypress(process.stdin)

const menu = "s - shuffle, d - deal, h - hit, f - finish_hand, x - stop"
console.log(menu)
process.stdin.on("keypress", (char, key) => {
  console.log("key: " + key.name)
  if (key.name === "x") {
    process.stdin.pause()
  } else if (key.name === "s") {
    store.dispatch({ type: "SHUFFLE" })
  } else if (key.name === "d") {
    store.dispatch({ type: "DEAL" })
  } else if (key.name === "h") {
    store.dispatch({ type: "HIT" })
  } else if (key.name === "f") {
    store.dispatch({ type: "FINISH_HAND" })
  }
})

process.stdin.setRawMode(true)
process.stdin.resume()
