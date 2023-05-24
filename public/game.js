const socket = io();

document.addEventListener('DOMContentLoaded', function () {
  const map = document.getElementById('map');
  const troops = [];
  let selectedTroop = null;
  let isPointCaptured = false;
  const capturePoint = {
    x: map.offsetWidth / 2,
    y: map.offsetHeight / 2,
    radius: 20
  };

  const capturePointElement = document.getElementById('capture-point');

  // Создание отряда
  function createTroop(player, position, isMoving) {
    const troop = document.createElement('div');
    troop.className = 'troop';
    troop.style.backgroundColor = (player === 1) ? 'green' : 'yellow';
    map.appendChild(troop);

    const troopObject = {
      element: troop,
      player: player,
      isMoving: isMoving,
      currentPosition: { x: position.x, y: position.y }
    };

    troops.push(troopObject);

    troop.addEventListener('click', function (event) {
      if (troopObject.isMoving) return;
      selectTroop(troopObject);
    });
  }

  // Выбор отряда
  function selectTroop(troop) {
    if (selectedTroop) {
      selectedTroop.element.classList.remove('selected');
    }

    selectedTroop = troop;
    selectedTroop.element.classList.add('selected');
  }

  // Движение отряда к указанной точке с заданной скоростью
  function moveTroop(troop, x, y, speed) {
    if (troop.isMoving) return;

    const startX = troop.currentPosition.x;
    const startY = troop.currentPosition.y;
    const dx = x - startX;
    const dy = y - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = distance / speed;

    troop.isMoving = true;

    const startTime = performance.now();

    function updatePosition(timestamp) {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentX = startX + dx * progress;
      const currentY = startY + dy * progress;

      troop.element.style.transform = `translate(${currentX}px, ${currentY}px)`;

      if (progress < 1) {
        requestAnimationFrame(updatePosition);
      } else {
        troop.isMoving = false;
        troop.currentPosition = { x, y };
        troop.element.style.transform = `translate(${x}px, ${y}px)`;

        checkCapture();
      }
    }

    requestAnimationFrame(updatePosition);
  }

  // Проверка захвата точки
  function checkCapture() {
    if (!isPointCaptured) {
      for (const troop of troops) {
        const dx = capturePoint.x - troop.currentPosition.x;
        const dy = capturePoint.y - troop.currentPosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= capturePoint.radius) {
          isPointCaptured = true;
          capturePointElement.classList.add('captured');
          break;
        }
      }
    }
  }

  map.addEventListener('click', function (event) {
    if (!selectedTroop) return;

    const rect = map.getBoundingClientRect();
    const mapX = event.clientX - rect.left;
    const mapY = event.clientY - rect.top;
    moveTroop(selectedTroop, mapX, mapY, 0.1);
  });

  const createTroop1Button = document.getElementById('create-troop-1');
  createTroop1Button.addEventListener('click', function () {
    createTroop(1, { x: 0, y: 0 }, false);
    socket.emit('createTroop', { player: 1, position: { x: 0, y: 0 }, isMoving: false });
  });

  const createTroop2Button = document.getElementById('create-troop-2');
  createTroop2Button.addEventListener('click', function () {
    createTroop(2, { x: 0, y: 0 }, false);
    socket.emit('createTroop', { player: 2, position: { x: 0, y: 0 }, isMoving: false });
  });

  socket.on('createTroop', (data) => {
    createTroop(data.player, data.position, data.isMoving);
  });

  socket.on('moveTroop', (data) => {
    const troop = troops[data.troopId];
    moveTroop(troop, data.x, data.y, data.speed);
  });
});




