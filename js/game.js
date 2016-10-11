/*
	Author: Carlos Rafael Catalan

	This file contains all the functions necessary
	to run game.html

*/

//--------------GLOBAL VARIABLES--------
var dragBool = false;
var gameOver = false;
var newPosition;
var player;
var enemyType = 0;

var missilesShot = [];
var enemiesSpawned = [];
			
var missileCount = 0; //idx = count--;
var enemyCount = 0; //idx = count--;

var score = 0;
var style;
var scoreDisplay;
var countDown = 4;

var playerClicked = false;
var delayOver = false;


var	style = { //style for the score label and the score itself
			fontFamily : 'Arial',
			fontSize : '30px',
			fontStyle : 'italic',
			fontWeight : 'bold',
			fill : '#F7EDCA',
			stroke : '#4a1850',
			strokeThickness : 3,
			dropShadow : true,
			dropShadowColor : '#000000',
			dropShadowAngle : Math.PI / 6,
			dropShadowDistance : 6,
			wordWrap : true,
			wordWrapWidth : 440
		};
//---------------------------------------
	
	function init() {

	stage = new PIXI.Container(); //represents a collection of display objects as well as the stage (display object)
	renderer = PIXI.autoDetectRenderer( //uses WebGLRenderer by default, if fail, uses canvasRenderer
		document.getElementById("game-canvas").width,
		document.getElementById("game-canvas").height,
		{view:document.getElementById("game-canvas")}		
	);

	//create sprite for far background image (night sky)
	var farTexture = PIXI.Texture.fromImage("images/bg-far.jpg");
	far = new PIXI.extras.TilingSprite(
			farTexture, 
			1200,
  			650
		);
	far.position.x = 0;
	far.position.y = 0;
	far.tilePosition.x = 0;
    far.tilePosition.y = 0;
	stage.addChild(far);

	//creat sprite for mid background image (buildings)
	var midTexture = PIXI.Texture.fromImage("images/Building.png");
	mid = new PIXI.extras.TilingSprite(
			midTexture, 
			1200,
  			650
		);
	mid.position.x = 0;
	mid.position.y = 0;
	mid.tilePosition.x = 0;
	mid.tilePosition.y = 0;
	stage.addChild(mid);

	//create sprite for player ship
	var playerType = localStorage.getItem("playerType"); //initialized in index_js file accdg to chosen ship
	var playerTexture = PIXI.Texture.fromImage(playerType); //ship image for sprite accdg to chosen ship in index.html
	player = new PIXI.Sprite(playerTexture);
	player.interactive = true;
			
    player.anchor.set(0.5);
	player.scale.set(0.8);
	player.on('mousedown', onDragStart).on('mousemove', onDragMove); //listener for when user clicks on player sprite and drags it around

	player.position.x = 600;
	player.position.y = 540; 
	stage.addChild(player);
	

				
	requestAnimationFrame(update);  
		   	 	
	}



	function displayScore(val){ //displays the score on the upper left hand corner

		
		var scoreLabel = new PIXI.Text('Score: ',style); //score label (Score: )
		scoreLabel.x = 30;
		scoreLabel.y = 0;

		stage.addChild(scoreLabel);

		score += val; //add value to score everytime missile hits enemy ship
				
		if(score > 50){ //makes sure that the previous score will be invisible when updating the new score
			scoreDisplay.alpha = 0.0;
		}

		var newScoreDisplay = new PIXI.Text(score,style);
		newScoreDisplay.x = 150;
		newScoreDisplay.y = 0;
		stage.addChild(newScoreDisplay);
		scoreDisplay = newScoreDisplay;
				


	}

	function onDragStart(event){ //function when sprite is clicked

			this.data = event.data;			    
			newPosition = this.data.getLocalPosition(this.parent);
			
			if(dragBool==true && delayOver==true){ //sprite can only shoot missile once its draggable
				shootMissile();
			}
			else{ //make the sprite draggable first
				
				console.log("dragging enabled");
				dragBool = true;
				this.dragging = dragBool;
				    	
				if (this.dragging){
					newPosition = this.data.getLocalPosition(this.parent);
					this.position.x = newPosition.x;
					this.position.y = newPosition.y;
				}
				
				//start the game once sprite is clicked and becomes draggable
				if(playerClicked==false){
					playerClicked = true;
					delayStartGame();
				}
				
			}
		
	}

	function delayStartGame(){ //delays for 3 seconds then starts spawning enemies
		
		countDown --;
		var style = { //style for numbers in the countdown
			fontFamily : 'Arial',
			fontSize : '150px',
			fontWeight : 'bold',			
			fill : 'yellow',
			stroke : '#4a1850',
			strokeThickness : 5,
			wordWrap : true,
			wordWrapWidth : 440
		};

		var countDownLabel = new PIXI.Text(countDown,style); //the actual numbers during countdown
		countDownLabel.x = 550;
		countDownLabel.y = 200;
		
		stage.addChild(countDownLabel);
		renderer.render(stage);
		setTimeout(function(){ countDownLabel.alpha = 0; }, 1000); //ensures that the previous count will be invisible before starting the next count
		
				
		if(countDown == 0){ 
			//once countdown reaches its end, start spawning enemies
			delayOver = true;
			spawnEnemies();
		}
		else{
			//continue countdown after delay
			setTimeout(delayStartGame, 1000);			
			
		}
		

	}



	function shootMissile(){
		
		//sprite for missile shot
		var missileTexture = PIXI.Texture.fromImage("images/torpedo.png");
		var missile = new PIXI.Sprite(missileTexture);
		missile.position.x = newPosition.x - 25;
		missile.position.y = newPosition.y - 90;
		stage.addChild(missile);
		missilesShot.push(missile); 
		missileCount++;
		var missileIdx = missileCount - 1;

		requestAnimationFrame(function updateMissiles() {
		            
		    missile.position.y -= 10.0;
		    missilesShot[missileIdx].position.y = missile.position.y; //update coordinates in the array
					
			if(missile.position.y < 0){ //remove missile sprite
						
				stage.removeChild(missile);
				missile = null;
			}
					
			
			var eIdx = enemyCount - 1;
			//if missile collides with enemy ship
			if(missilesShot[missileIdx].position.y >= (enemiesSpawned[eIdx].position.y - 100) && missilesShot[missileIdx].position.y <= (enemiesSpawned[eIdx].position.y + 100) && missilesShot[missileIdx].position.x >= (enemiesSpawned[eIdx].position.x - 30) && missilesShot[missileIdx].position.x <= (enemiesSpawned[eIdx].position.x + 30)){
							
				stage.removeChild(missilesShot[missileIdx]); //remove missile sprite
				/* 

				I did the following two lines because even though I would remove the enemy sprite,
				The enemy continues to render and will collide with the player. So in essence, the ship 
				is still there, but the texture is gone. So my solution was to place them outside the canvas.
				*/
				enemiesSpawned[eIdx].position.x = 1300; 
				enemiesSpawned[eIdx].position.y = 0;
				stage.removeChild(enemiesSpawned[eIdx]); //remove enemy sprite
				explosion(missilesShot[missileIdx].position.x, missilesShot[missileIdx].position.y); //animate explosion in the location of the collision b/w missile and enemy ship

				
				displayScore(50); //update score (score += 50)

			}
					
			renderer.render(stage);
			return requestAnimationFrame(updateMissiles);					
		});							
	}

	function spawnEnemies(){

		//sprite for enemy ship
		enemyType = Math.floor(Math.random() * (3 - 1 + 1)) + 1; //randomize an enemy type
		var enemyImage, speed;
		switch(enemyType) {  //assign stats accordingly
		    case 1:
		        enemyImage = "images/enemy.png"; //the image for the sprite
		        speed = 6.0; //the speed of descent in the canvas
		        damage = 50; //how much damage it incurs in the city_hp
		        break;
		    case 2:
		        enemyImage = "images/enemy2.png";
		        speed = 8.0;
		        damage = 100;
		        break;
		    case 3:
		    	enemyImage = "images/enemy3.png";
		    	speed = 7.0;
		    	damage = 70;
		        break;
		}
		
		var enemyTexture = PIXI.Texture.fromImage(enemyImage);
		var enemy = new PIXI.Sprite(enemyTexture);
		enemy.scale.set(0.8);
		enemy.position.x = Math.floor((Math.random() * 1000) + 50);
		enemy.position.y = 0;
		stage.addChild(enemy);
		enemiesSpawned.push(enemy);
		enemyCount++;
		var enemyIdx = enemyCount - 1;
		
		requestAnimationFrame(function updateEnemies() {
			            
			
			enemy.position.y += speed; //update position
			
			if(enemy.position.y >= 600){ //when enemy reaches bottom
			   			    
			   
			    explosion(enemy.position.x, 600);
			    stage.removeChild(enemy);
			    enemy = null;

			}			            
			else if(newPosition.y-5 <= enemy.position.y && enemy.position.y <= newPosition.y+5 && newPosition.x-50 <= enemy.position.x && enemy.position.x <= newPosition.x+50){ //when enemy collides with player
			    
			    stage.removeChild(player); //remove player sprite
			    stage.removeChild(enemy); //remove enemy sprite
			    explosion(enemy.position.x, enemy.position.y); //animate explosion in the location where enemy and player collided
			    gameOver = true;	
			    enemy = null;		            				            	
			}

			if(gameOver == false){ //as long as enemy and player does not collide, keep spawning enemies
				renderer.render(stage);
				return requestAnimationFrame(updateEnemies);
			}
			else{ //if enemy and player collides, show game over screen
				showGameOverScreen();
			}
		});
			
		if(gameOver==false){    
			setTimeout(spawnEnemies, 2000); //spawn enemies every 2 seconds
		}
	}

	function explosion(x, y){
		//sprite for explosion
		var explosionTexture = PIXI.Texture.fromImage("images/explosion.png");
		var explosion = new PIXI.Sprite(explosionTexture);
		explosion.position.x = x;
		explosion.position.y = y;
		stage.addChild(explosion);

		requestAnimationFrame(function updateExplosion(){
			explosion.alpha -= 0.05; //explosion image fades away

			if(explosion.alpha > 0.0){ //explosion image fades as long as it is still visible
				return requestAnimationFrame(updateExplosion);
			}
			else{
				stage.removeChild(explosion); //once the explosion sprite is invisible, remove sprite
			}
		});
	}

	function showGameOverScreen(){

		//game over label
		var gameOverTexture = PIXI.Texture.fromImage("images/game-over.png");
		var gameOver = new PIXI.Sprite(gameOverTexture);
		gameOver.position.x = 260;
		gameOver.position.y = 100;
		stage.addChild(gameOver);
				
		//try again button sprite
		var tryAgainTexture = PIXI.Texture.fromImage("images/try-again.png");
		var tryAgain = new PIXI.Sprite(tryAgainTexture);
		tryAgain.anchor.set(0.5);
		tryAgain.scale.set(0.5);
		tryAgain.interactive = true;
		tryAgain.on('mouseover', buttonsMouseOver).on('mouseout', buttonsMouseOut).on('click',restartGame); //listeners for try again button
		tryAgain.position.x = 570;
		tryAgain.position.y = 300;
		stage.addChild(tryAgain);

		//exit button sprite
		var exitTexture = PIXI.Texture.fromImage("images/exit-game.png");
		var exit = new PIXI.Sprite(exitTexture);
		exit.anchor.set(0.5);
		exit.scale.set(0.5);
		exit.interactive = true;
		exit.on('mouseover', buttonsMouseOver).on('mouseout', buttonsMouseOut).on('click',exitGame);
		exit.position.x = 570;
		exit.position.y = 400;
		stage.addChild(exit);

		requestAnimationFrame(updateButtons);				

	}

	function buttonsMouseOver(event){ //function when you hover over "Try Again" and "Exit" buttons
		this.data = event.data;
		this.scale.set(0.52); //make it bigger to show that it is highlighted
	}

	function buttonsMouseOut(event){ //function when you hover out of "Try Again" and "Exit" buttons
		this.data = event.data;
		this.scale.set(0.5); //return to normal size when you hover out
	}

	function restartGame(){
		document.location.href = "game.html"; //loads the page again
	}

	function exitGame(){
		document.location.href = "index.html"; //return to main menu
	}


	function onDragMove(){	//function while moving the sprite around		    
		if (this.dragging){			    	
			newPosition = this.data.getLocalPosition(this.parent);
			this.position.x = newPosition.x;
			this.position.y = newPosition.y;
		}
	}

	function update() { //parallax scrolling
		far.tilePosition.x -= 0.208;
		mid.tilePosition.x -= 0.64;
		
		renderer.render(stage);
		
		if(gameOver==false){
			requestAnimationFrame(update);
		}
				
	}

	function updateButtons(){ //makes sure that "Try Again" and "Exit" buttons are functioning properly when hovered over, etc
		renderer.render(stage);
		requestAnimationFrame(updateButtons);
	}