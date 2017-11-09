"use strict"

// recode colorpicker using D3

// get elements from page
var challenge = d3.select('#challenge');
var guess = d3.select('#guess');
var rowcontainer = d3.select('#rowcontainer');
var message = d3.select('h2');

// get level and margin for calculating tile width 
var level = d3.select("input[name='level']").attr('value'); // number of color tiles for each channel
var margin = 2;  // percent of containerWidth // use percents so game will resize on window change

// create data
var createData = function(level, margin) {
      var data = [];
      var channelArray = ['red', 'green', 'blue'];
      var getColor = function(channel, percent) {
            switch(channel) {
                  case 'red':
                        return 'rgb(' + percent + '%, 0%, 0%)';
                        break;
                  case 'green':
                        return 'rgb(0%, ' + percent + '%, 0%)';
                        break;
                  case 'blue':
                        return 'rgb(0%, 0%, ' + percent + '%)';
                        break;
            }
      }
      channelArray.forEach(function(v,i,a) {
            var num = level-1;
            for (var i = 0; i<=num; i++) {
                  var obj = new Object();
                  obj.channel = v;
                  obj.divwidth = 100/level - 2*margin + '%'; // tile width
                  var percent = 100*i/num;
                  obj.backgroundcolor = getColor(v, percent);
                  data.push(obj);
            }
      })
      return data;
}

// takes array of three rgb colors, returns rgb with red from first, green from second, blue from third.
var combineThreeColors = function(array) {
      var color = '';
      array.forEach(function(e, i) {
            e = e.split(',');
            color += e[i];
      })
      color = color.replace(/ /g, ', ')
      return color;
}

// randomly select a tile from each channel to create challenge color
var createChallenge = function(data, level) {
      // get random integer between 0 and the number of color tiles
      // use the random number as index of color for each channel
      var randomNumber = function(num) {
            return Math.floor(Math.random()*num)
      }

      var r = data.filter(d => d.channel === 'red')[randomNumber(level)].backgroundcolor;
      var g = data.filter(d => d.channel === 'green')[randomNumber(level)].backgroundcolor;
      var b = data.filter(d => d.channel === 'blue')[randomNumber(level)].backgroundcolor;
      var challengeColor = combineThreeColors([r,g,b]);

      // update the challenge with the new color 
      challenge.transition().duration(300).style('background-color', challengeColor);

      //toggle picked off and recreate guess
      d3.selectAll('.picked').classed('picked', false)
      guess.style('background-color', 'rgb(0, 0, 1)'); // this color is never a challenge color
}

// called anytime a color is picked. Get picked color for each channel. If none picked, add rgb(0, 0, 0) to array instead.
var checkGuess = function() {
      try{ var r= d3.selectAll('.red').filter('.picked').style('background-color') } catch (e) { r = 'rgb(0, 0, 0)'}
      try{ var g= d3.selectAll('.green').filter('.picked').style('background-color') } catch (e) { g = 'rgb(0, 0, 0)'}
      try{ var b= d3.selectAll('.blue').filter('.picked').style('background-color') } catch (e) { b = 'rgb(0, 0, 0)'}
      var guessColor = combineThreeColors([r,g,b]);

      // update background color of guess with new guess color
      guess.style('background-color', guessColor);

      // compare new guessColor with challengeColor and update success message.
      challenge.style('background-color') === guessColor?
            function(){
                  message.text('Success!'); 
                  message.classed('success', true);
                  guess.classed('success', true);
            }()
            
            : function(){
                  message.text('Match the Color!');
                  message.classed('success', false);
                  guess.classed('success', false);
            }()   
}
var drawTiles = function(level) { // each tile is a div 

      // create data with current level and margin
      var data = createData(level, margin);

      // bind data to existing divs
      var game = rowcontainer.selectAll('.color').data(data)

      // transition existing divs to new width
      game.transition().duration(400)
                  .style('width', d => d.divwidth)
                  .style('padding-top', d => d.divwidth)

      // transition existing divs to new color
      game.transition().delay(400).duration(400)
                        .style('background-color', d=> d.backgroundcolor)
                        .attr('channel', d => d.channel)
                        .attr('class', d => 'color ' + d.channel)

      // enter new divs
      game.enter()
                  .append('div')
                        .attr('channel', d => d.channel)
                        .attr('class', d => 'color ' + d.channel)
                        .style('width', d => d.divwidth)
                        .style('padding-top', d => d.divwidth)
                        .style('background-color', d => d.backgroundcolor)
                        .on('click', function(datum) {
                              var isAlreadyPicked = d3.select(this).classed('picked');
                              if (!isAlreadyPicked) { 
                                    var oldPick = d3.selectAll('.'+datum.channel).filter('.picked');
                                    oldPick.classed('picked', false)
                              }
                              d3.select(this).classed('picked', !isAlreadyPicked)
                              
                              checkGuess();
                        })
                        .style('opacity', '0')
                        .transition()
                        .delay(400)
                        .duration(400)
                        .style('opacity', '1')

      // remove extra divs
      game.exit()
                  .transition()
                  .duration(400)
                  .style('opacity', 0)       
                  .remove()

      createChallenge(data, level); 
      checkGuess(); 
}

var reset = function() {
      drawTiles(level);
}

var init = function() {
      drawTiles(level);
      // add click events to radiobuttons
      d3.selectAll('input').on('click', function() {
            // update level
            level = this.value;
            // drawTiles
            drawTiles(level);
      }) 
}

init();