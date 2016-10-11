/*
	Author: Carlos Rafael Catalan

	This file contains all the functions necessary
	to run index.html

*/
//---------------GLOBAL VARIABLES---------
var p1_selected = false;
var p2_selected = false;
//----------------------------------------

	function initMainMenu() {

		var interactive = true;
		stage = new PIXI.Container(); //represents a collection of display objects as well as the stage (display object)
		renderer = PIXI.autoDetectRenderer( //uses WebGLRenderer by default, if fail, uses canvasRenderer
			document.getElementById("menu-canvas").width,
			document.getElementById("menu-canvas").height,
			{view:document.getElementById("menu-canvas")}
		);

		//sprite for the space invader logo
		var logoTexture = PIXI.Texture.fromImage("images/Space Invader.jpg"); 
		logo = new PIXI.Sprite(logoTexture);
		logo.scale.set(0.7);
		logo.position.x = 530;
		logo.position.y = 0;
		stage.addChild(logo);

		//sprite for the moving buildings at the bottom of the page
		var bldgTexture = PIXI.Texture.fromImage("images/Building.png");
		bldg = new PIXI.extras.TilingSprite(
				bldgTexture, 
				1270,
	  			650
			);
		bldg.position.x = 0;
		bldg.position.y = 100;
		bldg.tilePosition.x = 0;
		bldg.tilePosition.y = 0;
		stage.addChild(bldg);

		//font style for the "Select Ship" label
		var style = {
			fontFamily : 'Arial',
			fontSize : '25px',
			fontWeight : 'bold',
			fill : 'yellow',
			stroke : '#4a1850',
			strokeThickness : 5,
			wordWrap : true,
			wordWrapWidth : 440
		};
		// "Select Ship" Label
		var selectLabel = new PIXI.Text('Select Ship',style);
		selectLabel.x = 570;
		selectLabel.y = 180;

		stage.addChild(selectLabel);

		//sprite for player type 1 (blue ship)
		var p1Texture = PIXI.Texture.fromImage('images/player.png');
		p1 = new PIXI.Sprite(p1Texture);
		p1.interactive = true;
		p1.alpha = 0.6;
		p1.on('mouseover', onPlayerOver).on('mouseout', onPlayerOut).on('click', p1Clicked); ///listeners
		p1.position.x = 500;
		p1.position.y = 200; 
		stage.addChild(p1);

		//sprite for player type 2 (orange ship)
		var p2Texture = PIXI.Texture.fromImage('images/player2.png');
		p2 = new PIXI.Sprite(p2Texture);
		p2.alpha = 0.6;
		p2.interactive = true;
		p2.on('mouseover', onPlayerOver).on('mouseout', onPlayerOut).on('click', p2Clicked); //listeners
		p2.position.x = 700;
		p2.position.y = 195; 
		stage.addChild(p2);

		//start game button
		
		var startTexture = PIXI.Texture.fromImage('images/start-game.png');
		start = new PIXI.Sprite(startTexture);
		start.anchor.set(0.5);
		start.scale.set(0.3);		
		start.interactive = true;
		start.on('mouseover', buttonMouseOver).on('mouseout', buttonMouseOut).on('click', startGame); //listeners		
		start.position.x = 640;
		start.position.y = 350; 
		stage.addChild(start);
		


		//how to play button
		var htpTexture = PIXI.Texture.fromImage('images/how-to-play.png');
		htp = new PIXI.Sprite(htpTexture);
		htp.anchor.set(0.5);
		htp.scale.set(0.3);
		htp.interactive = true;
		htp.on('mouseover', buttonMouseOver).on('mouseout', buttonMouseOut).on('click', loadInstructions); //listeners
		htp.position.x = 640;
		htp.position.y = 400; 
		stage.addChild(htp);


		requestAnimationFrame(update);
	}

	
	function onPlayerOver(event){ //when user hovers over a ship
		
		if(p1_selected==false && p2_selected == false){
			this.data = event.data;
			this.alpha = 0.8; //reduce opacity to "highlight" a ship
		}
	}

	function onPlayerOut(event){ //when user hovers out of a ship
		
		if(p1_selected==false && p2_selected == false){
			this.data = event.data;
			this.alpha = 0.6; //increase opacity to indicate ship is no longer "highlighted"
		}
	}

	function p1Clicked(event){ //when player type 1 is selected
		if(p2_selected== false){
			this.data = event.data;
			this.alpha = 1.0;

			p1_selected = p1_selected == false ? true : false;
			p2_selected = false;
			localStorage.setItem("playerType",'images/player.png'); //set the url for the image for retrieval in game.html
		}	    	    
	}

	function p2Clicked(event){ //when player 2 is clicked
		if(p1_selected == false){ 
			this.data = event.data;
			this.alpha = 1.0;

			p2_selected = p2_selected == false ? true : false;	    
			p1_selected = false;
			localStorage.setItem("playerType",'images/player2.png'); //set the url for the image for retrieval in game.html
		}
	}
	

	function buttonMouseOver(event){ //function when you hover over "Start" and "How to Play" buttons
		this.data = event.data;
		this.scale.set(0.31); //increase size to indicate "highlighted"
	}

	function buttonMouseOut(event){ //function when you hover out of "Start" and "How to Play" buttons
		this.data = event.data;
		this.scale.set(0.3); //revert to original size when you over out
	}

	function startGame(){ 	
		if(p1_selected == true || p2_selected == true){
			document.location.href = "game.html";
		}
	}

	function loadInstructions(){ 
		//load instruction image
		var insTexture = PIXI.Texture.fromImage('images/instructions.png');
		ins = new PIXI.Sprite(insTexture);
		ins.scale.set(1.2);			
		ins.interactive = true;
		ins.on('click', function (){ //click anywhere on the image to close the instructions
			stage.removeChild(this);
		});
		ins.position.x = 280;
		ins.position.y = 180; 
		stage.addChild(ins);
							
	}


	function update() {	
		bldg.tilePosition.x += 0.64;
		renderer.render(stage);
		requestAnimationFrame(update);		
	}