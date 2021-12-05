// Variables
document.getElementById("button").onclick = resetGame;
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
window.onresize = resize;
window.onload = resize;
// player properties
let squareSize,turn = 0,selectedPiece = [],validSpaces = [];
let numOfWhite = 12, numOfBlack = 12;
updateScore();
//Board 
let map = [
    [0,1,0,0,0,2,0,2],
    [1,0,1,0,0,0,2,0],
    [0,1,0,0,0,2,0,2],
    [1,0,1,0,0,0,2,0],
    [0,1,0,0,0,2,0,2],
    [1,0,1,0,0,0,2,0],
    [0,1,0,0,0,2,0,2],
    [1,0,1,0,0,0,2,0]
];
// Board outline and checkers design and properties of it 
function resize(){
    canvas.height = window.innerHeight*0.6;
    canvas.width =  window.innerHeight*0.6;
    squareSize = canvas.width/8;
    drawCanvas();
}
function drawCanvas(){
    let black = false;
    for(let i = 0; i < 8; i++){
        for(let j = 0; j < 8; j++){
            ctx.beginPath();
            if(black == false){
                ctx.fillStyle = "#ffdab3";
                if(j != 7) black = true;
            }
            else{
                ctx.fillStyle = "#4d2800";
                if(j != 7) black = false;
            }
            if(selectedPiece[0] == i && selectedPiece[1] == j){
                ctx.fillStyle = "blue";
            }
            for(let k = 0; k < validSpaces.length; k++){
                if(validSpaces[k][0] == i && validSpaces[k][1] == j){
                    ctx.fillStyle = "#0066ff";
                }
            }
            ctx.fillRect(i*squareSize,j*squareSize,squareSize,squareSize);
            ctx.closePath();
            
            if(map[i][j] != 0){
                ctx.beginPath();
                if(map[i][j] == 1 || map[i][j] == 3){
                    ctx.strokeStyle = "black";
                    ctx.fillStyle = "#1a1a1a";
                }
                else{
                    ctx.strokeStyle = "#999999"
                    ctx.fillStyle = "white";
                }
                ctx.arc(
                    i*squareSize+squareSize/2,
                    j*squareSize+squareSize/2,
                    squareSize*0.4,0,2*Math.PI
                );
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                
                ctx.beginPath();
                if(map[i][j] == 1 || map[i][j] == 3){
                    ctx.strokeStyle = "black";
                }
                else{
                    ctx.strokeStyle = "#999999";
                }
                ctx.arc(
                    i*squareSize+squareSize/2,
                    j*squareSize+squareSize/2,
                    squareSize*0.3,0,2*Math.PI
                );
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                if(map[i][j] == 3 || map[i][j] == 4){
                    if(map[i][j] == 3) ctx.fillStyle = "black";
                    else ctx.fillStyle = "#999999";
                    ctx.font = squareSize/2+"px Arial";
                    ctx.fillText("K",i*squareSize+squareSize*0.33,j*squareSize+squareSize*0.68);
                }
                ctx.closePath();
            }
        }
    }
}
// How checkers delete each other
canvas.onclick = (e)=>{
    let x = Math.floor(e.offsetX/squareSize);
    let y = Math.floor(e.offsetY/squareSize);

    if(turn == 0){
        if(map[x][y] == 2){
            validSpaces = [];
            selectedPiece = [x,y,0];
            selectValidSpaces(turn,true,x,y);
        }
        else if(map[x][y] == 4){
            validSpaces = [];
            selectedPiece = [x,y,1];
            selectValidSpaces(turn,true,x,y);
        }
        else if(map[x][y] == 0){
            if(selectedPiece.length > 0){
                for(let i = 0; i < validSpaces.length; i++){
                    if(validSpaces[i][0] == x && validSpaces[i][1] == y){
                        if(selectedPiece[2] == 0){
                            map[x][y] = 2;
                        }
                        else{
                            map[x][y] = 4;
                        }
                        if(y == 0){
                            map[x][y] = 4;
                        }
                        map[selectedPiece[0]][selectedPiece[1]] = 0;

                        let killablePieces = [];
                        let prevSpace = validSpaces[i];
                        if((prevSpace[2]+prevSpace[0])%2 == 0 && (prevSpace[3]+prevSpace[1])%2 == 0){
                            let killX = (prevSpace[2]+prevSpace[0])/2;
                            let killY = (prevSpace[3]+prevSpace[1])/2;
                            killablePieces.push([killX,killY]);
                        }
        
                        while(prevSpace != null){
                            let found = false;
                            for(let k = 0; k < validSpaces.length; k++){
                                if(prevSpace[2] == validSpaces[k][0] && prevSpace[3] == validSpaces[k][1]){
                                    prevSpace = validSpaces[k];
                                    found = true;
                                    break;
                                }
                            }
                            if(found == false){
                                prevSpace = null;
                            }
                            if(prevSpace != null){
                                let killX = (prevSpace[2]+prevSpace[0])/2;
                                let killY = (prevSpace[3]+prevSpace[1])/2;
                                killablePieces.push([killX,killY]);
                            }
                            
                        }
                        for(let k = 0; k < killablePieces.length; k++){
                            let kx = killablePieces[k][0];
                            let ky = killablePieces[k][1];
                            map[kx][ky] = 0;
                            numOfBlack--;
                        }
                        if(numOfBlack == 0){
                            gameOver(0);
                        }
                        killablePieces = [];
                        selectedPiece = [];
                        validSpaces = [];
                        break;
                    }
                }
                if(turn == 0) turn = 1;
                else turn = 0;
            }
        }
    }
    else{
        if(map[x][y] == 1){
            validSpaces = [];
            selectedPiece = [x,y,0];
            selectValidSpaces(turn,true,x,y);
        }
        else if(map[x][y] == 3){
            validSpaces = [];
            selectedPiece = [x,y,1];
            selectValidSpaces(turn,true,x,y);
        }
        else if(map[x][y] == 0){
            if(selectedPiece.length > 0){
                for(let i = 0; i < validSpaces.length; i++){
                    if(validSpaces[i][0] == x && validSpaces[i][1] == y){
                        if(selectedPiece[2] == 0){
                            map[x][y] = 1;
                        }
                        else{
                            map[x][y] = 3;
                        }
                        if(y == 7){
                            map[x][y] = 3;
                        }
                        map[selectedPiece[0]][selectedPiece[1]] = 0;

                        let killablePieces = [];
                        let prevSpace = validSpaces[i];
                        if((prevSpace[2]+prevSpace[0])%2 == 0 && (prevSpace[3]+prevSpace[1])%2 == 0){
                            let killX = (prevSpace[2]+prevSpace[0])/2;
                            let killY = (prevSpace[3]+prevSpace[1])/2;
                            killablePieces.push([killX,killY]);
                        }
        
                        while(prevSpace != null){
                            let found = false;
                            for(let k = 0; k < validSpaces.length; k++){
                                if(prevSpace[2] == validSpaces[k][0] && prevSpace[3] == validSpaces[k][1]){
                                    prevSpace = validSpaces[k];
                                    found = true;
                                    break;
                                }
                            }
                            if(found == false){
                                prevSpace = null;
                            }
                            if(prevSpace != null){
                                let killX = (prevSpace[2]+prevSpace[0])/2;
                                let killY = (prevSpace[3]+prevSpace[1])/2;
                                killablePieces.push([killX,killY]);
                            }
                            
                        }
                        for(let k = 0; k < killablePieces.length; k++){
                            let kx = killablePieces[k][0];
                            let ky = killablePieces[k][1];
                            map[kx][ky] = 0;
                            numOfWhite--;
                        }
                        if(numOfWhite == 0){
                            gameOver(1);
                        }
                        killablePieces = [];
                        selectedPiece = [];
                        validSpaces = [];
                        break;
                    }
                }
                if(turn == 0) turn = 1;
                else turn = 0;
            }
        }
    }
    drawCanvas();
    updateScore();
    validMovesAvailable();
}
// being able to highlight only valid spaces to move 
function selectValidSpaces(turn,blank,x,y){
    let enemy,enemyK;
    if(turn == 0){
        enemy = 1;
        enemyK = 3;
    }
    else{
        enemy = 2;
        enemyK = 4;
    }

    if(turn == 0){
        if(y-1 >= 0){
            if(x-1 >= 0){
                if(map[x-1][y-1] == 0){
                    if(blank){
                        if(alreadyChecked(x-1,y-1) == false){
                            validSpaces.push([x-1,y-1,x,y]);
                        }
                    }
                }
                else if(map[x-1][y-1] == enemy || map[x-1][y-1] == enemyK){
                    if(y-2 >= 0 && x-2 >= 0){
                        if(alreadyChecked(x-2,y-2) == false && map[x-2][y-2] == 0){
                            validSpaces.push([x-2,y-2,x,y]);
                            selectValidSpaces(turn,false,x-2,y-2);
                        }
                    }
                }
            }
            if(x+1 <= 7){
                if(map[x+1][y-1] == 0){
                    if(blank){
                        if(alreadyChecked(x+1,y-1) == false){
                            validSpaces.push([x+1,y-1,x,y]);
                        }
                    }
                }
                else if(map[x+1][y-1] == enemy || map[x+1][y-1] == enemyK){
                    if(y-2 >= 0 && x+2 <= 7){
                        if(alreadyChecked(x+2,y-2) == false && map[x+2][y-2] == 0){
                            validSpaces.push([x+2,y-2,x,y]);
                            selectValidSpaces(turn,false,x+2,y-2);
                        }
                    }
                }
            }
        }
        if(selectedPiece[2] == 1){
            if(y+1 <= 7){
                if(x-1 >= 0){
                    if(map[x-1][y+1] == 0){
                        if(blank){
                            if(alreadyChecked(x-1,y+1) == false){
                                validSpaces.push([x-1,y+1,x,y]);
                            }
                        }
                    }
                    else if(map[x-1][y+1] == enemy || map[x-1][y+1] == enemyK){
                        if(y+2 <= 7 && x-2 >= 0){
                            if(alreadyChecked(x-2,y+2) == false && map[x-2][y+2] == 0){
                                validSpaces.push([x-2,y+2,x,y]);
                                selectValidSpaces(turn,false,x-2,y+2)
                            }
                        }
                    }
                }
                if(x+1 <= 7){
                    if(map[x+1][y+1] == 0){
                        if(blank){
                            if(alreadyChecked(x+1,y+1) == false){
                                validSpaces.push([x+1,y+1,x,y]);
                            }
                        }
                    }
                    else if(map[x+1][y+1] == enemy || map[x+1][y+1] == enemyK){
                        if(y+2 <= 7 && x+2 <= 7){
                            if(alreadyChecked(x+2,y+2) == false && map[x+2][y+2] == 0){
                                validSpaces.push([x+2,y+2,x,y]);
                                selectValidSpaces(turn,false,x+2,y+2)
                            }
                        }
                    }
                }
            }
        }
    }    
    else{
        if(y+1 <= 7){
            if(x-1 >= 0){
                if(map[x-1][y+1] == 0){
                    if(blank){
                        if(alreadyChecked(x-1,y+1) == false){
                            validSpaces.push([x-1,y+1,x,y]);
                        }
                    }
                }
                else if(map[x-1][y+1] == enemy || map[x-1][y+1] == enemyK){
                    if(y+2 <= 7 && x-2 >= 0){
                        if(alreadyChecked(x-2,y+2) == false && map[x-2][y+2] == 0){
                            validSpaces.push([x-2,y+2,x,y]);
                            selectValidSpaces(turn,false,x-2,y+2);
                        }
                    }
                }
            }
            if(x+1 <= 7){
                if(map[x+1][y+1] == 0){
                    if(blank){
                        if(alreadyChecked(x+1,y+1) == false){
                            validSpaces.push([x+1,y+1,x,y]);
                        }
                    }
                }
                else if(map[x+1][y+1] == enemy || map[x+1][y+1] == enemyK){
                    if(y+2 <= 7 && x+2 <= 7){
                        if(alreadyChecked(x+2,y+2) == false && map[x+2][y+2] == 0){
                            validSpaces.push([x+2,y+2,x,y]);
                            selectValidSpaces(turn,false,x+2,y+2);
                        }
                    }
                }
            }
        }
        if(selectedPiece[2] == 1){
            if(y-1 >= 0){
                if(x-1 >= 0){
                    if(map[x-1][y-1] == 0){
                        if(blank){
                            if(alreadyChecked(x-1,y-1) == false){
                                validSpaces.push([x-1,y-1,x,y]);
                            }
                        }
                    }
                    else if(map[x-1][y-1] == enemy || map[x-1][y-1] == enemyK){
                        if(y-2 >= 0 && x-2 >= 0){
                            if(alreadyChecked(x-2,y-2) == false && map[x-2][y-2] == 0){
                                validSpaces.push([x-2,y-2,x,y]);
                                selectValidSpaces(turn,false,x-2,y-2)
                            }
                        }
                    }
                }
                if(x+1 <= 7){
                    if(map[x+1][y-1] == 0){
                        if(blank){
                            if(alreadyChecked(x+1,y-1) == false){
                                validSpaces.push([x+1,y-1,x,y]);
                            }
                        }
                    }
                    else if(map[x+1][y-1] == enemy || map[x+1][y-1] == enemyK){
                        if(y-2 >= 0 && x+2 <= 7){
                            if(alreadyChecked(x+2,y-2) == false && map[x+2][y-2] == 0){
                                validSpaces.push([x+2,y-2,x,y]);
                                selectValidSpaces(turn,false,x+2,y-2)
                            }
                        }
                    }
                }
            }
        }
    }
    for(let k = 0; k < validSpaces.length; k++){
        if(validSpaces[k][0] == selectedPiece[0] && validSpaces[k][1] == selectedPiece[1]){
            validSpaces.splice(k,1);
        }
    }
}
// If no available spots to move then other team is winner 
function alreadyChecked(x,y){
    let match = false;
    for(let i = 0; i < validSpaces.length; i++){
        if(validSpaces[i][0] == x && validSpaces[i][1] == y){
            match = true;
        }
    }
    return match;
}
// Game Over-Restart screen
function gameOver(winner){
    let gameOverText = document.getElementById("gameOverText");
    if(winner === 0) gameOverText.innerText = "White won!";
    else gameOverText.innerText = "Black won!";
    document.getElementById("gameOver").style.display = "block";
}
function resetGame(){
    document.getElementById("gameOver").style.display = "none";
    map = [
        [0,1,0,0,0,2,0,2],
        [1,0,1,0,0,0,2,0],
        [0,1,0,0,0,2,0,2],
        [1,0,1,0,0,0,2,0],
        [0,1,0,0,0,2,0,2],
        [1,0,1,0,0,0,2,0],
        [0,1,0,0,0,2,0,2],
        [1,0,1,0,0,0,2,0]
    ];
    killablePieces = [];
    selectedPiece = [];
    validSpaces = [];
    numOfWhite = 12;
    numOfBlack = 12;
    turn = 0;
    updateScore();
    drawCanvas();
}
// Score Updates 
function updateScore(){
    let data = document.getElementById("data");
    let turnText;
    if(turn == 0) turnText = "white";
    else turnText = "black";
    data.innerText = "";
    data.innerText += "Turn: "+turnText+"\n";
    data.innerText += "White: "+numOfWhite+"\n";
    data.innerText += "Black: "+numOfBlack+"\n";
}
// Only being able to move in available Spots on the Board 
function validMovesAvailable(){
    if(selectedPiece.length == 0){
        let myPiece1,myPiece2;
        if(turn == 0){
            myPiece1 = 0;
            myPiece2 = 2;
        }
        else{
            myPiece1 = 1;
            myPiece2 = 3;
        }
        for(let i = 0; i < 8; i++){
            for(let j = 0; j < 8; j++){
                if(map[i][j] == myPiece1 || map[i][j] == myPiece2){
                    selectValidSpaces(turn,true,i,j);
                    if(validSpaces.length > 0){
                        validSpaces = [];
                        return;
                    }
                }
            }
        }
        if(validSpaces.length == 0){
            if(turn == 0){
                gameOver(1);
            }
            else{
                gameOver(0);
            }
        }
    }
}