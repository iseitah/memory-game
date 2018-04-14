/*
 * Create a list that holds all of your cards
 */
const cardList = ['diamond','paper-plane-o','anchor','bolt','cube','leaf','bicycle','bomb','diamond','paper-plane-o','anchor','bolt','cube','leaf','bicycle','bomb']

let cards = []; //array to compare cards
let matching = 0;//Cards matching track
let moveCount = 0;//Movement track
let countDown; // Game timer
let stars = 3; //Stars, starting with 3 stars

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* Create a li in DOM under deck list after shuffling */
let sort = function(list) {
    let shuf = shuffle(list);
    for (let i = 0; i < shuf.length; i++) {
        $(".deck").append($('<li class="card"><i class="fa fa-' + shuf[i] + '"></i></li>'));
    }
}

function start() {
   sort(cardList);
   /*Hide the modal at the beginning*/
    $("#popup").hide();
    open();
    timer();
    //Repeat Button
    $('.restart').on('click', function() {
        restart();
    });

}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 // Timer function to cound down, it starts from 60 
let timer = function() {
    let time = 60;
    countDown = setInterval(function() {
        time--;
        $(".countDown").text(time);
        if (time <= 0) {
            clearInterval(countDown);
            //gameOver Msg
            let gameOver = "<div class=\"modalMsg\"><div class=\"playAgain\"><p><strong>GAME OVER!!!</strong> <br> Do you want play again?</p><button id=\"restart\">Play Again</button></div></div>";
            modalDisplay(gameOver); //for viwing modal
        }
    }, 1000);
}

/*
 counter of movment & display it on the page
 2 clicks = 1 move 
 */

let move = function() {
    moveCount++;
    $('.moves').text(moveCount);
    if (moveCount === 16) {
        $('.stars').children()[0].remove();
        $('.stars').append('<li><i class="fa fa-star-o"></i></li>');
        stars--; //take off 1 start
    } else if (moveCount === 24) {
        $('.stars').children()[1].remove();
        $('.stars').append('<li><i class="fa fa-star-o"></i></li>');
        stars--; //take off 1 start
    }
}

/*lock the cards in the open position, animate cards & change color of cards*/
let match = function(first, second) {
    first.addClass('match');
    second.addClass('match');
    //shake up if they are matching
    $(first).shake({
        direction: "up",
        distance: 50
    });
    $(second).shake({
        direction: "up",
        distance: 50
    });
    matching++;
    cards = []; //empty the array
    //if cards are matched
    if (matching === 8) {
        //set tiem = 0
        clearInterval(countDown);
        //Check how many starts are there
        let starList = '<ul class="list">';
        for (let i = 0; i < stars; i++) {
            starList +='<li><i class=\"fa fa-star\"></i></li>';
        }
        starList += '</ul>'
        //timer check
        let winningTime = $('.countDown').text();
        //show the win Msg
        let winMsg = "<div class=\"modalMsg\"><div class=\"playAgain\"><p><strong>CONGRATULATIONS !!!</strong> <br /> You took <strong>" + winningTime + "</strong> seconds to win.<br> You Have the following stars: <br />" + starList + "<br> Do you want to play again?</p><button id=\"restart\">Play Again</button></div></div>";
        modalDisplay(winMsg); //for viwing modal
    }
}
let remove = function(first, second) {
    first.removeClass("show open");
    second.removeClass("show open");
    cards = [];
}

let open = function() {
    $('.deck .card').on('click', function() {
        let isDisplayed = display($(this)); //Try to open the card
        //If the card has not been opened before or mtached, it will open, otherwise no!
        if (!isDisplayed) {
            let opened = openedCard($(this));
            if (opened.length == 2) {
                //Increase the move counter
                move();
                //Return [object object]
                if (opened[0][0].firstChild.className == opened[1][0].firstChild.className) {
                    //Check the matching
                    match(opened[0], opened[1]);
                } else {
                    //shake right if they are not matching
                    $(opened[0]).shake({
						direction: "right",
						distance: 50
					});
                    $(opened[1]).shake({
						direction: "right",
						distance: 50
					});
                    //then remove the elements by calling remove() function
                    setTimeout(function() {
                        remove(opened[0], opened[1]);
                    }, 300); //Wait sometime before removing
                }
            }
        }
    });
}

let display = function(e) {
    //ignore if card is opened or matched
    if ($(e).hasClass('show') || $(e).hasClass('match')) {
        return true;
    } else {
        $(e).addClass("show open");
        return false;
    }

}

 // add list of open cards, to track the open cards 
let openedCard = function(e) {
    cards.push(e);
    return cards;
}
 
  // Restart the game, shaffled the board 
  // and reset the timer and counter of Movement
let restart = function() {
    //Empty the card array
    $('.deck').empty();
    cards = [];
    //Re Shuffle cards
    sort(cardList);
    //Reset move numbers and stars
    $('.moves').text(0);
    moveCount = 0; 
    //Return the stars
    let j = 2;
    while (j >= 0) {
        $('.stars').children()[j].remove();
        $('.stars').append('<li><i class="fa fa-star"></i></li>');
        j--;
    }
    //re-set matching, timer & call open() 
    matching = 0;
    //set tiem = 0
    clearInterval(countDown);
    timer();
    open();
}

//msg for winer and losser 
let modalDisplay = function(elements) {
    //show the info daialog
    $("#popup").append(elements);
    $("#popup").show();
    //if the user click on play again button, game reset
    $("#restart").on('click', function() {
        $("#popup").hide();
        $("#popup").empty();
        restart();
    });
}



