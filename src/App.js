import { useEffect, useState } from "react";
import ScoreBoard from './components/score';
import blueCandy from './Images/blue-candy.png';
import orangeCandy from './Images/orange-candy.png';
import greenCandy from './Images/green-candy.png';
import yellowCandy from './Images/yellow-candy.png';
import redCandy from './Images/red-candy.png';
import purpleCandy from './Images/purple-candy.png';
import blank from './Images/blank.png';



const width = 8;
const candyColors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy
];

const App = () => {

  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);

  const [squareBeingDragged, setSquareBeingDragged] = useState(null);

  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);

  const [scoreDisplay, setScoreDisplay] = useState(0);


  const checkForColoumnOfFour = () => {
    for (let i = 0; i <= 39; i++) {
      const coloumnOfFour = [i, i + width, i + width*2, i + width*3];
      const decidedColor = currentColorArrangement[i];
      const isblank = currentColorArrangement[i] === blank;

      if ( coloumnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isblank)) {
        
        setScoreDisplay((score) => score + 4);

        coloumnOfFour.forEach(square => currentColorArrangement[square] = blank);
      
        return true;
      }
    }

  }


  const checkForColoumnOfThree = () => {
    for (let i = 0; i <= 47; i++) {
      const coloumnOfThree = [i, i + width, i + width*2];
      const decidedColor = currentColorArrangement[i];
      const isblank = currentColorArrangement[i] === blank;

      if ( coloumnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isblank)) {
        
        setScoreDisplay((score) => score + 3);

        coloumnOfThree.forEach(square => currentColorArrangement[square] = blank);
      
        return true;
      }
    }

  }


  const checkForRowOfFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const isblank = currentColorArrangement[i] === blank;

      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63];

      if(notValid.includes(i)) continue;

      if ( rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isblank)) {
        
        setScoreDisplay((score) => score + 4);

        rowOfFour.forEach(square => currentColorArrangement[square] = blank);
      
        return true;
      }
    }

  }


  const checkForRowOfThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

      const isblank = currentColorArrangement[i] === blank;

      if(notValid.includes(i)) continue;

      if ( rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isblank)) {
        
        setScoreDisplay((score) => score + 3);
        
        rowOfThree.forEach(square => currentColorArrangement[square] = blank);
      
        return true;
      }
    }

  }


  const moveIntoSquareBelow = () => {
    for(let i = 0; i <= 55/* || 64 - width*/ ; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if(isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomNumber];
      }

      if ((currentColorArrangement[i + width]) === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  } 


  console.log(scoreDisplay);

  const dragStart = (e) => {
    //console.log(e.target);
    //console.log('drag Start');
    setSquareBeingDragged(e.target);
  } 

  const dragDrop = (e) => {
    //console.log('drag Drop');
    setSquareBeingReplaced(e.target);
  } 

  const dragEnd = () => {
    //console.log('drag End');

    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
    
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));
  

    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src');
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src');
    


    //console.log('squareBeingDraggedId', squareBeingDraggedId);
    //console.log('squareBeingReplacedId', squareBeingReplacedId);
    

    const validMovesArr = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
    ];


    const validMove = validMovesArr.includes(squareBeingReplacedId);

    const isAColoumnOfFour = checkForColoumnOfFour();
    const isAColoumnOfThree = checkForColoumnOfThree();
    const isARowOfFour = checkForRowOfFour();
    const isARowOfThree = checkForRowOfThree();

    if (squareBeingReplacedId && validMove && (isAColoumnOfFour || isAColoumnOfThree || isARowOfFour || isARowOfThree)) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src');
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src');
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  } 


  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }

    //console.log(randomColorArrangement);
    setCurrentColorArrangement(randomColorArrangement);
  }



  useEffect(() => {
    createBoard();
  }, []);



  useEffect(() => {
    
    const timer = setInterval(() => {
      checkForColoumnOfFour();
      checkForColoumnOfThree();
      checkForRowOfFour();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);   // passing new currentColorArrangement wont work,
    }, 100);                                                      // (you) must use spread operator. 
    return () => clearInterval(timer);

  }, [checkForColoumnOfFour, checkForColoumnOfThree, checkForRowOfFour, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangement]);



  //console.log(currentColorArrangement);



  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColors, index) => (
          <img 
            key = {index}
            //style = {{backgroundColor : candyColors}}
            src = {candyColors}
            alt = {candyColors}
            data-id = {index}
            draggable = {true}
            onDragStart = {dragStart}
            onDragOver = {(e) => e.preventDefault()}
            onDragEnter = {(e) => e.preventDefault()}
            onDragLeave = {(e) => e.preventDefault()}
            onDrop = {dragDrop}
            onDragEnd={dragEnd}
          />
             
        ))}
      </div>
      <ScoreBoard score={scoreDisplay}/>
    </div>
  );
}

export default App;