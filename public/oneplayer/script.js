var AIMove = new XMLHttpRequest();

var boardSizeClicked = 0;
var themeClicked = 0;



function checkOnePlyrBoard() {
    if (boardSizeClicked == 0) {
        alert("Please choose a board size.");
    }
    if (themeClicked == 0) {
        alert("Please choose a theme.");  
    }else if(boardSizeClicked == 1) {
        window.location.href="login/login.html";
    }
}

//working on this for board size from dropdown
function setBoard(size) {
    boardSizeClicked = 1;
    state.size = size;
    sendBoard();
}


//on mouse over for clicking
function changeColor(x){
	x.setAttribute("fill-opacity", "1");
}

function changeColorBack(x){
	x.setAttribute("fill-opacity", "0");
}

function makeMove(x){
   //decrypt coordinate of placed token
    var numOfPix = ((500)/(state.size-1));
    var yCoord = Math.round(((x.cx.baseVal.value) / numOfPix) - 0.8);
    var xCoord = Math.round(((x.cy.baseVal.value) / numOfPix) - 0.8);
    console.log(xCoord);
    console.log(yCoord);

    //check for illegal move on players part
    if(check_illegal_move(xCoord, yCoord, 2) == 0){
            alert("Illegal move!");
    }else{  
        console.log("what is x: ",x) 
        x.setAttribute("fill", "black");
        //update board
        state.board[xCoord][yCoord] = 2;
        checkMove = 1;
        x.removeAttribute("fill-opacity");
        x.removeAttribute("onmouseover");
        x.removeAttribute("onmouseout");
        x.removeAttribute("onclick");
    }

    //update board state
    state.board[xCoord][yCoord] = 2;
    console.log(state.board);
    state.last.x = xCoord;
    state.last.y = yCoord;
    console.log(state.last);

    //send updated state to server
    sendBoard();

    //call AI
    AIMove.open("GET", "/move", true);
    AIMove.send();

}


//pass
function getMove(){
	if (state.last.pass == true){//two passes in a row = game over
		gameOver();
	}else{
		state.last.pass = true;
	}
	state.last.x = 0;
    state.last.y = 0;
    //send updated state to server
    sendBoard();
    //call AI
    AIMove.open("GET", "/move", true);
    AIMove.send();
}

function gameOver(){
	//need to count points and display them somewhere
    colorBoard ="red";
}

//Upon AI request return
AIMove.onreadystatechange = function() {
        if(AIMove.readyState == 4 && AIMove.status == 200) {
            //update board
            var move = JSON.parse(AIMove.responseText);
            //update last
            if (!move["pass"]){//if AI did not pass
            	state.board[move["x"]][move["y"]] = move["c"];
    			state.last.x = move["x"];
    			state.last.y = move["y"];
    			state.last.pass = false;
    		}else{//if AI did pass
    			console.log("AI did pass");
    			if (state.last.pass == true){//two passes in a row = gameOver
    				gameOver();
    			}
    			state.last.x = 0;
    			state.last.y = 0;
				state.last.pass = true;
			}
            sendBoard();

            drawBoard(state);
        }
}




