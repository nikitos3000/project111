const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'green';
ctx.fillRect(0, 0, canvas.width, canvas.height); 
ctx.fillStyle = 'black';
const squareSize = 50;
const squareX = canvas.width - squareSize;
const squareY = canvas.height - squareSize;
ctx.fillRect(squareX, squareY, squareSize, squareSize);

canvas.addEventListener('click', function(event) {
    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;
    
    // Проверяем, находится ли клик внутри квадрата
    if (mouseX >= squareX && mouseX <= squareX + squareSize && mouseY >= squareY && mouseY <= squareY + squareSize) {
      console.log('Кликнули на квадрат!');
      console.log(`Координаты клика: (${mouseX}, ${mouseY})`);
    }
  });