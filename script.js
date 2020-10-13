(() => {
  
   var firebaseConfig = {
    apiKey: "AIzaSyCfaTn_repN5X2HaEa9Frlck9nduy-CF4U",
    authDomain: "cisc472proj1.firebaseapp.com",
    databaseURL:"https://cisc472proj1.firebaseio.com",
    projectId: "cisc472proj1",
    storageBucket: "cisc472proj1.appspot.com",
    messagingSenderId: "680899853408",
    appId: "1:680899853408:web:872c469335a48f49755705",
    measurementId: "G-3K16J02P4Y"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  let db = firebase.database();
  
  const settings = {
    speed: 25,
    size: 50,
  };

  const game = {
    score: 0,
  };

  const snake = {
    size: 10,
    arr: [],
    direction: 'r',
  };

  let interval = null;
  let field = [];
  let food = {};

  document.addEventListener('keydown', (e) => { onKey(e); }, false);

  const snakeGround = document.querySelector('.snakeGround');
  const score = document.querySelector('.score');

  window.onload = () => {
    snakeGround.style.width = `${settings.size * 5}px`;
    snakeGround.style.height = `${settings.size * 5}px`;
    startGame();
  };

  const onKey = (e) => {
    if (e.which === 40 && snake.direction !== 'd') {
      snake.direction = 'u';
    }
    if (e.which === 38 && snake.direction !== 'u') {
      snake.direction = 'd';
    }
    if (e.which === 37 && snake.direction !== 'r') {
      snake.direction = 'l';
    }
    if (e.which === 39 && snake.direction !== 'l') {
      snake.direction = 'r';
    }
  };

  const startGame = () => {
    snake.arr = [];
    snake.size = 15;
    game.score = 0;
    snake.direction = 'r';
    field = [];
    score.textContent = '0';
    
      db.ref("topscore").once('value', ss =>{
    var top = document.querySelector('.topscore');
     top.textContent = 'Top Score: ' + ss.val();
      })
    db.ref("topname").once('value', ss =>{
    var topname = document.querySelector('.topname');
     topname.textContent = 'By: ' + ss.val();
      })

    let randomXPos = Math.floor(Math.random() * settings.size);
    let randomYpos = Math.floor(Math.random() * settings.size);
    for (var i = snake.size - 1; i >= 0; i--) {
      snake.arr.push({x: i + randomXPos, y: randomYpos});
    }
    fill();

    clearInterval(interval);
    interval = setInterval(() => {
        moveSnake();
    }, 1000 / settings.speed);
  };

  const fill = () => {
    snakeGround.innerHTML = '';
    for (let i = 0; i < settings.size; i++) {
      field[i] = [];
      snakeGround.appendChild(document.createElement('div'));
      snakeGround.lastChild.classList.add('row');

      for (let j = 0; j < settings.size; j++) {
        field[i][j] = snakeGround.lastChild.appendChild(document.createElement('div'));
        snakeGround.lastChild.lastChild.classList.add('pixel');
      }
    }
    placeFood();
  };

  const drawSnake = () => {
    const pixels = document.querySelectorAll('.pixel');
    pixels.forEach(pixel => pixel.classList.remove('snake'));
    snake.arr.forEach(item => field[item.y][item.x].classList.add('snake'));
  };

  const moveSnake = () => {
    let sx = snake.arr[0].x;
    let sy = snake.arr[0].y;

    switch(snake.direction) {
      case 'r':
        sx += 1;
        break;
      case 'd':
        sy -= 1;
        break;
      case 'l':
        sx -= 1;
        break;
      case 'u':
        sy += 1;
        break;
    }

    let tail = snake.arr.pop();

    // go thought the walls
    if (sx >= field.length) { sx = 0; }
    if (sx < 0) { sx = field.length - 1; }
    if (sy >= field.length) { sy = 0; }
    if (sy < 0) { sy = field.length - 1; }

    // eat food
    if (sx == food.x && sy == food.y) {
      snake.size += 1;
      snake.arr.push({ x: tail.x, y: tail.y });
      const pixels = document.querySelectorAll('.pixel');
      pixels.forEach(pixel => pixel.classList.remove('food'));
      game.score += 1;
      score.textContent = 'Score: ' + game.score;
      placeFood();
    }

    tail.x = sx;
    tail.y = sy;

    if (checkGameOver(tail)) {
      db.ref("topscore").once('value', ss =>{
        if(game.score > ss.val()){
     var newhigh = prompt("You got a new high score!", "Enter your name");  
 db.ref("topname").set(newhigh);         db.ref("topscore").set(game.score);
      snake.arr = [];
      startGame();
        }
        else{
      snake.arr = [];
      startGame();
        }
      });
      
    } else {
      snake.arr.unshift(tail);
      drawSnake();
    }
  };

  const placeFood = () => {
    do {
      food = getRandomFoodPlace();
    } while (checkGameOver(food));
    field[food.y][food.x].classList.add('food');
  }

  const getRandomFoodPlace = () => ({
    x: Math.floor(Math.random() * settings.size),
    y: Math.floor(Math.random() * settings.size),
  });

  const checkGameOver = head => snake.arr.some(item => item.x === head.x && item.y === head.y);
;
})();
