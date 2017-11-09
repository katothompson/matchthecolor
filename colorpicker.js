// create color picker using vanilla javascript

// get all of the elements on the page
var rows = document.querySelectorAll('.row');
var resetButton = document.querySelector('button');
var levelInput = document.querySelectorAll('.level');
var challenge = document.querySelector('#challenge');
var guess = document.querySelector('#guess');
var message = document.querySelector('#message');
var h2 = document.querySelector('h2');

// data
var channels = ['red', 'green', 'blue'];
var margin = 2;

// get level, this is the number of color selections for each channel
var level = document.querySelector('input[name="level"]').value;

var createColorArrays = function() {

      // for each channel, get the given number of colors
      var array = []
      channels.forEach(function(channel) {
            array.push(getColors(channel));
      })
      return array;
}

var getColors = function(channel) {
      
      var array = [];
      var num = level;
      num--;
      for(var i = 0; i <= num; i++) {
            var percent = 100/num * i;

            switch(channel) {
                  case 'red':
                        array.push('rgb(' + percent + '%, 0%, 0%)');
                        break;
                  case 'green':
                        array.push('rgb(0%, ' + percent + '%, 0%)');
                        break;
                  case 'blue':
                        array.push('rgb(0%, 0%, ' + percent + '%)');
                        break;
            }
      }
      return array;
}

var createGuess = function() {

      var guessColor = '';

      // get the picked divs. If less than three divs picked, add the default color 0, 0, 0
      var picked = []
      channels.forEach(function(channel, index) {
            var x = document.querySelector('#' + channel + ' .picked');
            if(x) {
                  picked.push(x.style.backgroundColor)
            } else { picked.push('rgb(0, 0 , 0)')}
      })

      // combine the channels from the three picked colors into one color.
      picked.forEach(function(color,index,array) {
            var x = color;
            x = x.split(',');
            guessColor += x[index];
            guessColor = guessColor.replace(' ', ',');  
      })

      // update the guess with the new color and check to see if it matches the challenge.
      guess.style.backgroundColor = guessColor;
      checkGuess();

}

var checkGuess = function() {
      // If challenge and guess match, set h2 to 'success',
      // otherwise set h2 to 'match the color'.
      // When message changes, toggle success on and off so that guess and message will rotate.

      var success = function() {
            h2.innerText = "Success!";
      }
      var failure = function() {
            h2.innerText = "Match the Color!";
      }
      var oldMessage = h2.innerText;
      guess.style['background-color'] === challenge.style['background-color']?
            success() : failure();
      
      // trigger transitions when status of success changes
      if(oldMessage !== h2.innerText) {
            guess.classList.toggle('success');
            h2.classList.toggle('success');
      }
}

var createChallenge = function(colorArray) {

      var challengeColor = '';

      // get random integer between 0 and the number of color tiles
      // use the random number as index of color from each channel

      var num = level;
      var randomNumber = function(num) {
            return Math.floor(Math.random()*num)
      }


      channels.forEach(function(e, i) {
            var x = colorArray[i];
            x = x[randomNumber(num)];
            x = x.split(',');
            challengeColor += x[i];
            challengeColor = challengeColor.replace(' ', ',')
      })

      // update the challenge with the new color 
      challenge.style.backgroundColor = challengeColor;

      //toggle picked off and recreate guess
      var picked = document.querySelectorAll('.picked');
      picked.forEach(function(e) {
            e.classList.toggle('picked');
      })

      createGuess();
}

var createRows = function() {

      // get width of color divs
      var width = 100/level - 2*margin + '%';

      // get color arrays
      var colorArray = createColorArrays(level);

      // for each row, clear the inner html and append new color tiles.
      rows.forEach(function(row, index, array) {

            // clear row
            row.innerHTML = '';

            // create tiles and append to row. the tiles are divs.
            for(var i = 0; i < level; i++) {
                  var div = document.createElement('div');
                  var color = colorArray[index][i];
                  div.setAttribute('class', 'color')
                  div.style.width = width;
                  div.style['padding-top'] = width;
                  div.style.backgroundColor = color;

                  // onclick, toggle picked class
                  div.addEventListener("click", function() {
                        this.classList.toggle('picked');

                        // did user pick a new color or toggle off the currently selected color?
                        // if user selected a new color, toggle both selections off and then retoggle the current selection on.
                        var picked = document.querySelectorAll('#'+channels[index]+' .picked');
                        if(picked.length > 0) {
                              picked.forEach(function(e) {
                                    e.classList.toggle('picked');
                              })
                              this.classList.toggle('picked');
                        }
                        // update guess with new color selection
                        createGuess();  
                  }) 
                  // append the div to the row
                  row.appendChild(div);
            }
      })
      createChallenge(colorArray);
}

var init = function() {
      createRows();

      // add the onclick methods to the radio inputs
      levelInput.forEach(function(e) {
            e.onclick = function() {
                  level = e.value;
                  createRows();
            }
      });
}

init();