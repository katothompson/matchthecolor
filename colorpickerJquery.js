// refactor colorpicker code using Jquery

var channels = ['red', 'green', 'blue'];
var level = $('input[name="level"]').val();

var getColorArrays = function() {

      // Create array of colorArrays
      var array = []
      channels.forEach(function(channel) {
            array.push(getColors(channel));
      })
      return array;
}

var getColors = function(channel) {

      // Create array of colors, length determined by level
      var array = [];
      var num = level;
      num--;
      for(var i = 0; i<= num; i++) {
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

      // for each row, get selected color or get rgb(0, 0, 0) and then combine channels
      $('.row').each(function(i,v) {
            var p = $(this).children().filter($('.picked'));
            var x = p.length? p[0].style.backgroundColor : 'rgb(0, 0, 0)';
            x = x.split(',');
            guessColor += x[i]
            guessColor = guessColor.replace(' ', ',');
      })

      // set guess background color to the guess color.
      $('#guess').css('backgroundColor', guessColor);

      // check if guess is correct 
      checkGuess();
}

var checkGuess = function() {
      var guess = $('#challenge').css('backgroundColor')
      var challenge = $('#guess').css('backgroundColor')
      guess === challenge? 
            function() {
                  $('#message h2').text('Success!');
                  $('#message h2').removeClass('success');
                  $('#guess').removeClass('success');
            }()
            :
            function() {
                  $('#message h2').text('Match the Color!');
                  $('#message h2').addClass('success');
                  $('#guess').addClass('success');
            }()
}

var createChallenge = function(colorArray) {

      // get random integer between 0 and the number of color divs
      // use the random number as index of color for each channel
      var challengeColor = '';
      var randomNumber = function(num) {
            return Math.floor(Math.random()*num)
      }

      channels.forEach(function(e, i) {
            var x = colorArray[i];
            x = x[randomNumber(level)];
            x = x.split(',');
            challengeColor += x[i];
            challengeColor = challengeColor.replace(' ', ',')
      })

      // update the challenge with the new color 
      $('#challenge').css('backgroundColor', challengeColor);

      // update the guess tile;
      createGuess();

      //toggle picked off and recreate guess
      $('.picked').toggleClass('picked');
}

var drawTiles = function() {
      // get width of tiles
      var width = (100/level - 4 + '%')

      // get colorArray
      var colorArray = getColorArrays();

      // select rows and for each, clear html and append color tiles
      $('.row').html('');
      $('.row').each(function(index, row) {
            colorArray[index].forEach(function(color) {
                  var $div = $('<div>', {'class' : 'color'});
                  $div.css({'backgroundColor': color, 'width': width, 'padding-top': width})
                  $div.on('click', function(i, v) {
                        $(this).toggleClass('picked'); // toggle clicked tile on or off
                        var newClass = "#" + channels[index] + ' .picked'; // select all picked tiles
                        if($(newClass).length) { // if there are picked tiles, toggle them all off, then toggle only the selected tile back on.
                              $(newClass).toggleClass('picked')
                              $(this).toggleClass('picked')
                        }
                        // now call createGuess to update the guess with new picked tiles
                        createGuess()
                  })
                  // append to row
                  $div.appendTo(row)
            })
      })
      createChallenge(colorArray);
}

var init = function() {
      drawTiles();

      // add event listeners to radiobuttons
      $('input').on('click', function(e) {
            level = e.target.value;
            drawTiles();
      })

      // turn off success class on message to trigger transition
      $('h2').toggleClass('success');
}

init();