; (function (window) {
	// Game
	var Game = function (element, option) {  				//this function is called in the index.html file
		this.element = document.getElementById(element);  	//element is what we drop our came into
		this.option = option;								//option tells which game we want to play. also contains the data
		//?? took out getElementbyID when refactoring. Why? 

		// 	Info section (What is the Info section for?)??
		this.info_div = document.createElement("div"); 		//dynamically creating a div in the doc
		this.info_div.id = "info_div"; 						//assigning an id to it to be used later

		// 	Deck
		this.deck_div = document.createElement("div"); 		//dynamically creating a div in the doc
		this.deck_div.id = "deck_div"; 						//assigning an id to it to be used later
		this.gameDeck = new Deck(option); 					//constructor function that passes in variables frm Deck below
		this.gameDeck.buildDeck.call(this); 				//Calls the buildDeck function defined below. "this" refers to Game passed in from index.html


		var shuffleBtn = document.createElement("button");		//creates a button called "shuffleBtn"
		shuffleBtn.innerHTML = "Shuffle";						//put the word "Shuffle" inside the button
		shuffleBtn.onclick = this.gameDeck.shuffle.bind(this);	//??a little confusing, but I think when you click the button, the shuffle function is executed on the gameDeck (which was created by the contructor function). But what is the second "this" binding?
		this.info_div.appendChild(shuffleBtn);					//displaying the shuffleBtn in the info_div



		// // 	Rules
		// this.rules = {
		// 	discardRow: [
		// 		{
		// 			name: "Got it!",
		// 			droppable: true,
		// 			maxcards: this.deck_div.children.length,
		// 			piles: 1,
		// 		}
		// 	],
		// 	gameComplete: function (event) {
		// 		if (event.currentTarget.childNodes.length === this.discardRow[0].maxcards) {
		// 			console.log("You win!");
		// 		}
		// 	}
		// }
		// // 	Discard Pile
		// this.buildDiscard = function () {
		// 	for (let i = this.rules.discardRow.length - 1; i >= 0; i--) {
		// 		var zone = document.createElement("div");
		// 		zone.className = "zone row";
		// 		var discardRule = this.rules.discardRow[i];
		// 		var c = 0;
		// 		while (c < discardRule.piles) {
		// 			var discardObject = new DiscardPile();
		// 			discardObject.name = discardRule.name;
		// 			discardObject.droppable = discardRule.droppable;
		// 			discardObject.id = "pile-" + c;
		// 			var buildObject = discardObject.init();
		// 			zone.appendChild(buildObject);
		// 			c++;
		// 		}
		// 		this.element.appendChild(zone);

		// 	}
		// }
		this.element.appendChild(this.info_div); 			// line adds the info_div to the "element" that's passed in
		this.element.appendChild(this.deck_div);			// line adds the deck_div to the "element"
		// this.buildDiscard();
	}





	// Deck
	var Deck = function (option) {							//deck_div is a div container for html(taken out). "option" holds the deck data
		this.deckData = option.data; 						// Different data for different decks. comes from the "option" passed in
		this.buildDeck = function () {							//deck is built when we start the game but also when we shuffle
			var parentFrag = document.createDocumentFragment(); //creates an "imaginary object" to be tinkered with which will then be added to the node 
			this.deck_div.innerHTML = ""; 							//makes the html of the inside of this div blank
			for (var i = this.option.data.length - 1; i >= 0; i--) { 		//looping through the deck data
				var card = new Card; 							//creates a card
				card.id = "card-" + i; 							//assigns a unique id to the card
				card.data = this.option.data[i]; 					//populates the card with the data at the [i] index
				card.buildCard(parentFrag) 						//calls the buildCard function (below) and passes in the parentFrag variable
			}
			this.deck_div.appendChild(parentFrag); 					//the loop above keeps adding the the parentFrag. Once it's done, add it to the deck_div
			this.gameDeck.stack.call(this);						//passes everything into the deck_div and stacks it nicely. "this" is the Game object
		}
	}
	// 	Cards
	// 	----
	// 	shuffle
	Deck.prototype.shuffle = function () {					//definese the shuffle function. The "prototype" makes it available everywhere. 
		var cardsToShuffle = this.gameDeck.deckData;		//"this" refers to the Game
		var m = cardsToShuffle.length, temp, i;				//declaring 3 vars at once. the m is the length. temp is a temporary variable and i is the iterator
		while (m) {											//an algorithm to shuffle 
			i = Math.floor(Math.random() * m--);
			temp = cardsToShuffle[m];
			cardsToShuffle[m] = cardsToShuffle[i];
			cardsToShuffle[i] = temp;
		}
		this.gameDeck.deckData = cardsToShuffle;			//??assigning the deck back to the cards we just shuffled
		this.gameDeck.buildDeck.call(this);					//Rebuilding the deck. "this" refers to the Game object


	}

	// 	stack
	Deck.prototype.stack = function () {					//defines the stack function to put all the cards in one part of the screen. The "prototype" makes it available everywhere. 
		var cards = this.deck_div.children;					//gets all the divs inside deckz-div
		for (let i = cards.length - 1; i >= 0; i--) {		//looping through the cards
			cards[i].style.top = i + "px";					//for each one, move it over a px
			cards[i].style.left = i + "px";					//each one to the side a px
			cards[i].classList.add("stacked_card");			//giving each one a class
		}
	}

	// Card
	var Card = function () {
		this.id = ""; 										//setting id as blank
		this.data = ""; 									//setting data as blank
		this.cardContainer = document.createElement("div"); //creating a div for the container
		this.cardContainer.className = "card_container"; 	//giving it a name to be used later
		this.cardFront = document.createElement("div"); 	//creating a div
		this.cardFront.className = "card_front";			//giving it a name
		this.cardBack = document.createElement("div");		//creating a div
		this.cardBack.className = "card_back";				//giving it a name
		this.buildCard = function (parentFrag) {			//pass in  parentFrag from buildDeck
			var flipDiv = document.createElement("div"),		//creating divs
				frontValDiv = document.createElement("div"),
				backValDiv = document.createElement("div"),
				categoryDiv = document.createElement("div");
			flipDiv.className = "flip"; 						//naming the divs
			frontValDiv.className = "front_val";
			backValDiv.className = "back_val";
			categoryDiv.className = "category_val";

			frontValDiv.innerHTML = this.data.q;				//giving the frontValDiv question data
			backValDiv.innerHTML = this.data.a;					//giving the otner side answer data
			//adding a "Learn More" part to the back of the card
			var learnMore = document.createElement("a");			//create an anchor tag
			learnMore.text = "Learn More";							//putting text on the tag
			learnMore.href = this.data.link;						//pulling in a link from the data for the anchor tag
			learnMore.target = "_blank";							//forcing to open clicks in new tab
			learnMore.addEventListener("click", function (event) {			//stopping propgaation. Meaning that a click here will NOT turn the card back over
				event.stopPropagation();
			})

			var infoImage = document.createElement("img");			//adding an image element
			infoImage.src = "images/info.svg";						//assigning an image in our files to the element
			learnMore.appendChild(infoImage);						//adding the image to the Learn More anchor tag
			backValDiv.appendChild(learnMore);						//adding the learn more anchor tag to the backValDiv (back of the card)

			categoryDiv.innerHTML = this.data.category;			//giving it category data

			this.cardFront.appendChild(frontValDiv);			//adding the data to the front
			this.cardFront.appendChild(categoryDiv);			//same	
			this.cardBack.appendChild(backValDiv);				//adding data to the back

			flipDiv.appendChild(this.cardFront);				//everytime you flip the card, it will switch data
			flipDiv.appendChild(this.cardBack);

			this.cardContainer.id = this.id;					//assigning an id to the cardContainer. With "this," using the same id as for the card 
			this.cardContainer.appendChild(flipDiv);			//putting the flipDiv inside the container

			// 	----
			// 	flip
			this.cardContainer.onclick = cardClick;
			this.cardContainer.draggable = true;
			// this.cardContainer.onDragStart = cardDrag;

			parentFrag.appendChild(this.cardContainer);			//taking the parentFrag from building the deck and putting the card container in it too
		}
	}
	// 	val
	// 	suit

	var cardClick = (function (clickEvent) {					//immediately invoked function. Doing this to protect "counter" var from corruption... closure
		var counter = 0;
		return function (clickEvent) {
			clickEvent.currentTarget.classList.toggle("slide_over");
			clickEvent.currentTarget.classList.toggle("flip_card");
			clickEvent.currentTarget.style.zIndex = counter;		//to make the stack look better
			counter++;												//incrementing the counter each time a click occurs
		}
	})();															//don't forget the () to activate the function


	// function cardDrag(event) {
	// 	event.dataTransfer.setData("text/plain", event.currentTarget.id);

	// }



	// Discard Pile
	var DiscardPile = function () { }
	//  {
	// 	this.name = "";
	// 	this.droppable;
	// 	this.id = "";
	// 	this.init = function () {
	// 		// 	Holders
	// 		var holderContainer = document.createElement("div");
	// 		var holderLabel = document.createElement("div");
	// 		var holderTarget = document.createElement("div");
	// 		holderTarget.ondragover = function (event) { event.preventDefault() }  //prevents the computer's default behavior to open an app when drug over.
	// 		holderTarget.ondrop = this.cardDrop;
	// 		holderContainer.className = "holder_container";
	// 		holderLabel.className = "holder_label";
	// 		holderTarget.className = "holder_target";

	// 		holderLabel.innerText = this.name;
	// 		holderContainer.appendChild(holderLabel);
	// 		holderContainer.appendChild(holderTarget);

	// 		return holderContainer;

	// 	}
	// }
	// DiscardPile.prototype.cardDrop = function (event) {
	// 	var cardID = event.dataTransfer.getData("text/plain"); 					//gives us the string for the id we passed
	// 	var cardDragging = document.getElementById(cardID); 					//now, passed on that id we can get the actual element
	// 	cardDragging.style.top = "0px";											//reseting the style so it looks better
	// 	cardDragging.style.left = "0px";
	// 	event.currentTarget.appendChild(cardDragging);							//appending it to the target to pass it out of the function
	// }
	// 	----
	// 	accept or reject
	window.Game = Game;
})(window);

console.log("Hello Blag");