(() => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const title = document.getElementById('scene-title');
  const chapter = document.getElementById('chapter-label');
  const chapterCount = document.getElementById('chapter-count');
  const objectiveText = document.getElementById('objective-text');
  const statusText = document.getElementById('status-text');
  const statusPill = document.getElementById('status-pill');
  const progressLabel = document.getElementById('progress-label');
  const toast = document.getElementById('game-toast');
  const startOverlay = document.getElementById('start-overlay');
  const endOverlay = document.getElementById('end-overlay');
  const retryOverlay = document.getElementById('retry-overlay');
  const storyOverlay = document.getElementById('story-overlay');
  const storyEyebrow = document.getElementById('story-eyebrow');
  const storyTitle = document.getElementById('story-title');
  const storyCopy = document.getElementById('story-copy');
  const storyContinue = document.getElementById('story-continue');
  const endingCopy = document.getElementById('ending-copy');
  const W = canvas.width;
  const H = canvas.height;
  const ground = 366;
  const scenes = [
    {
      name: 'Zwischen den Stunden',
      title: 'Der Flur ist heute ziemlich laut.',
      storyIntro: 'Zwischen zwei Stunden rufen dir ein paar Mitschüler verletzende Sprüche nach. Du gehst weiter – am Ende des Flurs wartet Frau Boris, die dir zuhört.',
      objective: 'Geh zu der Lehrkraft am Ende des Flurs.',
      teacherTitle: 'Du wirst ernst genommen',
      teacherMessage: 'Du erzählst Frau Boris, was passiert ist. Sie glaubt dir und nimmt dich ernst. Gemeinsam verabredet ihr, dass du in der Pause zur Aufsicht gehst, falls du dich unsicher fühlst.',
      nextLabel: 'Weiter zur Pause',
      target: 2760,
      worldWidth: 3000,
      background: 'hall',
      obstacles: [
        { x: 450, width: 42, height: 28, kind: 'bag' }, { x: 1100, width: 44, height: 32, kind: 'books' },
        { x: 1750, width: 38, height: 31, kind: 'cone' }, { x: 2400, width: 48, height: 35, kind: 'bag' }
      ],
      characters: [{ x: 800, kind: 'peer' }, { x: 1450, kind: 'peer' }, { x: 2100, kind: 'peer' }],
    },
    {
      name: 'Mittagspause',
      title: 'Ein Mitschüler versucht, dich zu schlagen.',
      storyIntro: 'Auf dem Pausenhof versucht ein Mitschüler, dich zu schlagen. Duck dich unter dem Schlag weg und renn zu Frau Boris. Auf dem Weg musst du auch Hindernissen ausweichen.',
      objective: 'Duck dich vor dem Schlag und lauf zu Frau Boris.',
      teacherTitle: 'Frau Boris bringt dich in Sicherheit',
      teacherMessage: 'Du erreichst Frau Boris und erzählst ihr, dass ein Mitschüler versucht hat, dich zu schlagen. Sie bleibt bei dir, bringt dich an einen sicheren Ort und holt Unterstützung. Du musst das nicht allein klären. Am Nachmittag bekommst du außerdem verletzende Nachrichten.',
      nextLabel: 'Weiter zum Nachmittag',
      target: 2760,
      worldWidth: 3000,
      background: 'yard',
      obstacles: [
        { x: 450, width: 38, height: 32, kind: 'cone' }, { x: 1100, width: 50, height: 36, kind: 'bag' },
        { x: 1750, width: 45, height: 34, kind: 'books' }, { x: 2400, width: 40, height: 31, kind: 'cone' }
      ],
      characters: [{ x: 800, kind: 'peer' }, { x: 1450, kind: 'peer' }, { x: 2100, kind: 'peer' }],
    },
    {
      name: 'Nach der Schule',
      title: 'Die verletzenden Nachrichten hören nicht auf.',
      storyIntro: 'Zu Hause taucht eine verletzende Nachricht im Klassenchat auf. Du antwortest nicht und leitest nichts weiter. Du machst einen Screenshot und zeigst ihn einer erwachsenen Vertrauensperson.',
      objective: 'Geh zu deiner Lehrkraft und erzähl ihr von den Nachrichten.',
      teacherTitle: 'Auch online bekommst du Hilfe',
      teacherMessage: 'Eine erwachsene Person hilft dir, die Nachrichten zu melden und den Kontakt zu stoppen. Am nächsten Morgen wollt ihr mit Frau Boris einen Plan machen, damit du dich sicherer fühlst.',
      nextLabel: 'Weiter zum nächsten Morgen',
      target: 2760,
      worldWidth: 3000,
      background: 'room',
      obstacles: [
        { x: 450, width: 44, height: 29, kind: 'books' }, { x: 1100, width: 40, height: 31, kind: 'bag' },
        { x: 1750, width: 38, height: 30, kind: 'cone' }, { x: 2400, width: 48, height: 36, kind: 'bag' }
      ],
      characters: [{ x: 800, kind: 'peer' }, { x: 1450, kind: 'peer' }, { x: 2100, kind: 'peer' }],
    },
    {
      name: 'Ein Plan für morgen',
      title: 'Du hast jemanden an deiner Seite.',
      storyIntro: 'Frau Boris und du besprecht den Tag. Ihr legt fest, wo du hingehen kannst und welche Erwachsenen für dich da sind, falls es wieder passiert.',
      objective: 'Geh zu deiner Lehrkraft und plant gemeinsam den morgigen Tag.',
      teacherTitle: 'Gemeinsam wird ein Plan daraus',
      teacherMessage: 'Ihr erstellt einen klaren Sicherheitsplan: Du kannst zu Frau Boris oder zur Aufsicht gehen. Die Erwachsenen kümmern sich darum – du bist nicht schuld und musst das nicht allein lösen.',
      nextLabel: 'Zum Abschluss',
      target: 2760,
      worldWidth: 3000,
      background: 'office',
      obstacles: [
        { x: 450, width: 40, height: 27, kind: 'bag' }, { x: 1100, width: 42, height: 32, kind: 'books' },
        { x: 1750, width: 38, height: 30, kind: 'cone' }, { x: 2400, width: 46, height: 34, kind: 'bag' }
      ],
      characters: [{ x: 1550, kind: 'helper' }],
    }
  ];

  const state = {
    sceneIndex: 0,
    playerX: 90,
    cameraX: 0,
    keys: new Set(),
    touch: new Set(),
    started: false,
    talking: false,
    canInteract: false,
    pendingSceneIndex: null,
    pendingEnding: false,
    walk: 0,
    direction: 1,
    alertUntil: 0,
    lives: 3,
    jumpHeight: 0,
    jumpVelocity: 0,
    jumpRequested: false,
    landUntil: 0,
    jumpedObstacles: new Set(),
    warnedObstacles: new Set(),
    attack: null,
    attackCooldown: 0,
    invulnerableUntil: 0,
    hitUntil: 0,
    toastTimeout: null,
    lastFrame: 0
  };

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(state.toastTimeout);
    state.toastTimeout = setTimeout(() => toast.classList.remove('visible'), 1800);
  }

  function setStatus(message, active = true) {
    statusText.textContent = message;
    statusPill.classList.toggle('inactive', !active);
  }

  function showStoryBeat(eyebrow, heading, message, buttonLabel) {
    storyEyebrow.textContent = eyebrow;
    storyTitle.textContent = heading;
    storyCopy.textContent = message;
    storyContinue.textContent = buttonLabel;
    storyOverlay.classList.remove('hidden');
    storyContinue.focus();
  }

  function beginScene(index) {
    state.sceneIndex = index;
    state.playerX = 90;
    state.cameraX = 0;
    state.talking = state.started;
    state.canInteract = false;
    state.pendingSceneIndex = null;
    state.pendingEnding = false;
    state.lives = 3;
    state.jumpHeight = 0;
    state.jumpVelocity = 0;
    state.jumpRequested = false;
    state.landUntil = 0;
    state.jumpedObstacles.clear();
    state.warnedObstacles.clear();
    state.attack = null;
    state.attackCooldown = 0;
    state.invulnerableUntil = 0;
    state.hitUntil = 0;
    const scene = scenes[index];
    title.textContent = scene.title;
    chapter.textContent = `MOMENT ${index + 1} · ${scene.name.toUpperCase()}`;
    chapterCount.textContent = `0${index + 1} / 04`;
    objectiveText.textContent = scene.objective;
    progressLabel.textContent = `Abschnitt ${index + 1} von ${scenes.length}`;
    setStatus('Finde einen sicheren Ort');
    if (state.started) {
      showStoryBeat(`MOMENT ${index + 1} · ${scene.name.toUpperCase()}`, scene.title,
        scene.storyIntro, index === 0 ? 'Los geht’s' : 'Weitergehen');
    }
  }

  function startGame() {
    state.started = true;
    startOverlay.classList.add('hidden');
    beginScene(0);
  }

  function continueStory() {
    if (storyOverlay.classList.contains('hidden')) return;
    storyOverlay.classList.add('hidden');
    if (state.pendingEnding) {
      state.pendingEnding = false;
      endOverlay.classList.remove('hidden');
      setStatus('Geschichte abgeschlossen', false);
      objectiveText.textContent = 'Du hast dir Unterstützung geholt und mit den Erwachsenen einen Sicherheitsplan gemacht.';
    } else if (state.pendingSceneIndex !== null) {
      const next = state.pendingSceneIndex;
      state.pendingSceneIndex = null;
      beginScene(next);
    } else {
      state.talking = false;
      setStatus('Finde einen sicheren Ort');
    }
  }

  function tellTeacher() {
    if (state.talking || !state.canInteract || !retryOverlay.classList.contains('hidden')) return;
    state.talking = true;
    const scene = scenes[state.sceneIndex];
    objectiveText.textContent = scene.teacherMessage;
    setStatus('Die Lehrkraft hilft dir', false);
    if (state.sceneIndex < scenes.length - 1) {
      state.pendingSceneIndex = state.sceneIndex + 1;
      showStoryBeat('EIN WICHTIGER SCHRITT', scene.teacherTitle, scene.teacherMessage, scene.nextLabel);
    } else {
      endingCopy.textContent = `${scene.teacherMessage} Du hast es verdient, dich sicher zu fühlen. Du musst Mobbing nicht allein bewältigen.`;
      state.pendingEnding = true;
      showStoryBeat('DAS WAR MUTIG', scene.teacherTitle, scene.teacherMessage, scene.nextLabel);
    }
  }

  function roundedRect(x, y, w, h, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
  }

  function gradientRect(x, y, w, h, top, bottom) {
    const gradient = ctx.createLinearGradient(0, y, 0, y + h);
    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, w, h);
  }

  function line(x1, y1, x2, y2, color, width = 4) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  function drawPerson(x, base, color, pose, scale = 1, helper = false, direction = 1, role = 'student') {
    ctx.save();
    ctx.translate(x, base);
    ctx.scale(scale * direction, scale);

    const ink = '#263849';
    const gait = pose === 'walk' ? state.walk : 0;
    const bob = pose === 'walk' ? Math.abs(Math.sin(gait * 2)) * -2 : 0;
    const stride = pose === 'walk' ? Math.sin(gait) * 9 : 0;
    const armSwing = pose === 'walk' ? Math.sin(gait + Math.PI) * 7 : 0;
    const headY = pose === 'duck' ? -34 : -56 + bob;
    const shoulderY = pose === 'duck' ? -25 : -42 + bob;
    const hipY = pose === 'duck' ? -17 : -16 + bob;

    ctx.fillStyle = 'rgba(25, 38, 45, .2)';
    ctx.beginPath();
    ctx.ellipse(0, -1, 13, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = ink;
    ctx.fillStyle = '#f5f1e8';
    ctx.beginPath();
    ctx.arc(0, headY, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    line(0, headY + 9, 0, hipY, color, 5);

    if (pose === 'windup') {
      line(0, shoulderY, -12, shoulderY - 12, ink, 3.5);
      line(-12, shoulderY - 12, -5, shoulderY - 21, ink, 3.5);
      line(0, shoulderY, 12, shoulderY - 12, ink, 3.5);
      line(12, shoulderY - 12, 19, shoulderY - 22, ink, 3.5);
    } else if (pose === 'punch') {
      line(0, shoulderY, -12, shoulderY + 11, ink, 3.5);
      line(-12, shoulderY + 11, -18, hipY - 2, ink, 3.5);
      line(0, shoulderY, 13, shoulderY + 8, ink, 3.5);
      line(13, shoulderY + 8, 29, shoulderY - 2, ink, 3.5);
    } else if (pose === 'block') {
      line(0, shoulderY, -14, shoulderY - 14, ink, 3.5);
      line(-14, shoulderY - 14, -5, shoulderY - 20, ink, 3.5);
      line(0, shoulderY, 14, shoulderY - 14, ink, 3.5);
      line(14, shoulderY - 14, 5, shoulderY - 20, ink, 3.5);
    } else if (pose === 'duck') {
      line(0, shoulderY, -13, shoulderY + 7, ink, 3.5);
      line(-13, shoulderY + 7, -19, shoulderY + 15, ink, 3.5);
      line(0, shoulderY, 13, shoulderY + 7, ink, 3.5);
      line(13, shoulderY + 7, 19, shoulderY + 15, ink, 3.5);
    } else if (pose === 'walk') {
      line(0, shoulderY, -11 + armSwing, shoulderY + 12, ink, 3.5);
      line(-11 + armSwing, shoulderY + 12, -14 + armSwing, shoulderY + 19, ink, 3.5);
      line(0, shoulderY, 11 - armSwing, shoulderY + 12, ink, 3.5);
      line(11 - armSwing, shoulderY + 12, 14 - armSwing, shoulderY + 19, ink, 3.5);
    } else {
      line(0, shoulderY, -12, shoulderY + 12, ink, 3.5);
      line(-12, shoulderY + 12, -15, shoulderY + 20, ink, 3.5);
      line(0, shoulderY, 12, shoulderY + 12, ink, 3.5);
      line(12, shoulderY + 12, 15, shoulderY + 20, ink, 3.5);
    }

    if (pose === 'duck') {
      line(-3, hipY, -10, -5, ink, 3.5);
      line(-10, -5, -15, -3, ink, 3.5);
      line(3, hipY, 10, -5, ink, 3.5);
      line(10, -5, 15, -3, ink, 3.5);
    } else if (pose === 'walk') {
      line(0, hipY, -5 + stride * .35, -8, ink, 3.5);
      line(-5 + stride * .35, -8, -stride, -1, ink, 3.5);
      line(-stride, -1, -stride - 5, 0, ink, 3.5);
      line(0, hipY, 5 - stride * .35, -8, ink, 3.5);
      line(5 - stride * .35, -8, stride, -1, ink, 3.5);
      line(stride, -1, stride + 5, 0, ink, 3.5);
    } else {
      line(0, hipY, -7, -7, ink, 3.5);
      line(-7, -7, -11, 0, ink, 3.5);
      line(0, hipY, 7, -7, ink, 3.5);
      line(7, -7, 11, 0, ink, 3.5);
    }
    ctx.restore();
  }
  function drawHall(worldWidth) {
    gradientRect(0, 0, worldWidth, 280, '#d6e0df', '#aebfbe');
    gradientRect(0, 280, worldWidth, 160, '#e6ded0', '#c4b8a7');
    gradientRect(0, 270, worldWidth, 12, '#aebdb6', '#81938d');
    for (let x = 0; x < worldWidth; x += 96) {
      ctx.strokeStyle = 'rgba(102, 112, 103, .14)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, 282); ctx.lineTo(x - 30, H); ctx.stroke();
    }
    for (let x = 0; x < worldWidth; x += 120) {
      ctx.strokeStyle = 'rgba(102, 112, 103, .12)';
      ctx.beginPath(); ctx.moveTo(x, 284); ctx.lineTo(x + 25, 440); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,.2)';
    for (let i = 0; i < worldWidth / 190; i++) {
      ctx.beginPath(); ctx.moveTo(80 + i * 190, 280); ctx.lineTo(190 + i * 190, 440); ctx.lineTo(225 + i * 190, 440); ctx.lineTo(225 + i * 190, 280); ctx.fill();
    }
    let panelIndex = 0;
    for (let x = 26; x < worldWidth - 200; x += 155) {
      ctx.fillStyle = 'rgba(40, 55, 60, .12)';
      ctx.fillRect(x + 5, 194, 112, 3);
      roundedRect(x, 58, 112, 132, 8, panelIndex % 2 ? '#f1f0e5' : '#f5f2e7');
      gradientRect(x + 9, 67, 94, 89, '#b8d2d3', '#809e9d');
      ctx.fillStyle = 'rgba(244, 249, 239, .38)';
      ctx.beginPath(); ctx.moveTo(x + 14, 72); ctx.lineTo(x + 39, 72); ctx.lineTo(x + 20, 148); ctx.lineTo(x + 14, 148); ctx.fill();
      ctx.fillStyle = '#9aaca7'; ctx.fillRect(x + 9, 164, 94, 5);
      ctx.fillStyle = '#99a69e'; ctx.fillRect(x + 30, 211, 52, 25);
      ctx.fillStyle = '#768b82'; ctx.fillRect(x + 26, 235, 60, 6);
      panelIndex += 1;
    }
    for (let x = 75; x < worldWidth - 200; x += 310) {
      roundedRect(x, 14, 165, 12, 4, '#e8e7d8');
      ctx.fillStyle = 'rgba(255, 247, 215, .45)';
      ctx.fillRect(x + 8, 24, 149, 2);
    }
    for (let x = 110; x < worldWidth - 220; x += 465) {
      roundedRect(x, 203, 98, 44, 5, '#d6c6ab');
      roundedRect(x + 8, 210, 82, 30, 3, '#90a9a0');
    ctx.fillStyle = '#476258'; ctx.font = 'bold 9px sans-serif'; ctx.fillText(Math.floor(x / 465) % 2 ? 'SEI NETT' : 'DU ZÄHLST', x + 17, 229);
    }
    const doorX = worldWidth - 185;
    roundedRect(doorX, 123, 112, 151, 8, '#d4ae83');
    roundedRect(doorX + 16, 149, 80, 125, 4, '#53766c');
    ctx.fillStyle = '#dce4d9'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('LEHRERZIMMER', doorX + 14, 141);
    drawSafetyZone(worldWidth - 240, 'LEHRKRAFT');
  }

  function drawYard(worldWidth) {
    gradientRect(0, 0, worldWidth, 250, '#b8d1d6', '#dce4df');
    gradientRect(0, 250, worldWidth, 190, '#8eaa86', '#b9b08e');
    ctx.fillStyle = '#82968b'; ctx.fillRect(0, 236, worldWidth, 18);
    for (let x = 50; x < worldWidth; x += 260) {
      ctx.fillStyle = 'rgba(255,255,255,.2)';
      ctx.beginPath(); ctx.ellipse(x, 73, 32, 13, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + 22, 72, 23, 16, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + 43, 75, 29, 11, 0, 0, Math.PI * 2); ctx.fill();
    }
    for (let x = 40, i = 0; x < worldWidth - 150; x += 210, i++) {
      ctx.fillStyle = '#8a6e57'; ctx.fillRect(x - 6, 190, 12, 58);
      ctx.fillStyle = i % 2 ? '#76947b' : '#64856e';
      ctx.beginPath(); ctx.arc(x - 14, 206, 26, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 12, 201, 31, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x, 185, 29, 0, Math.PI * 2); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(108, 139, 119, .55)';
    ctx.lineWidth = 3;
    for (let x = 0; x < worldWidth; x += 170) {
      ctx.beginPath(); ctx.moveTo(x, 302); ctx.quadraticCurveTo(x + 50, 287, x + 100, 302); ctx.stroke();
    }
    for (let x = 150; x < worldWidth - 300; x += 540) {
      roundedRect(x, 278, 166, 12, 4, '#a97e61');
      ctx.fillStyle = '#8f684f'; ctx.fillRect(x + 11, 290, 8, 24); ctx.fillRect(x + 139, 290, 8, 24);
      roundedRect(x + 205, 250, 13, 60, 4, '#75917e');
      ctx.fillStyle = '#f2ead8'; ctx.beginPath(); ctx.arc(x + 211, 242, 25, Math.PI, 0); ctx.fill();
    }
    const shelterX = worldWidth - 330;
    roundedRect(shelterX, 248, 240, 115, 10, '#eadfca');
    ctx.fillStyle = '#97b5a7'; ctx.fillRect(shelterX + 10, 256, 220, 76);
    ctx.fillStyle = '#53766c'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('PAUSENBEREICH', shelterX + 65, 350);
    drawSafetyZone(shelterX + 120, 'SUPERVISOR');
  }

  function drawRoom(worldWidth) {
    gradientRect(0, 0, worldWidth, 274, '#d4dedb', '#aebfbc');
    gradientRect(0, 274, worldWidth, 166, '#d2bda5', '#b39b82');
    for (let x = 0; x < worldWidth; x += 125) {
      ctx.strokeStyle = 'rgba(90, 73, 59, .13)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, 278); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let x = 100; x < worldWidth - 250; x += 430) {
      ctx.fillStyle = 'rgba(40, 55, 60, .16)';
      ctx.fillRect(x + 6, 204, 190, 4);
      roundedRect(x, 50, 190, 150, 10, '#f2eee0');
      gradientRect(x + 10, 60, 170, 128, '#c3dcda', '#829e9d');
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      ctx.beginPath(); ctx.moveTo(x + 18, 68); ctx.lineTo(x + 61, 68); ctx.lineTo(x + 34, 179); ctx.lineTo(x + 18, 179); ctx.fill();
      line(x + 95, 60, x + 95, 188, '#f2eee0', 5);
      line(x + 10, 124, x + 180, 124, '#f2eee0', 5);
      ctx.fillStyle = '#58785f';
      ctx.beginPath(); ctx.arc(x + 34, 193, 13, Math.PI, 0); ctx.fill();
      roundedRect(x + 220, 278, 130, 10, 4, '#8e745d');
      ctx.fillStyle = '#48665e'; ctx.font = 'bold 10px sans-serif'; ctx.fillText('ATME TIEF DURCH', x + 234, 264);
    }
    for (let x = 310; x < worldWidth - 300; x += 610) {
      roundedRect(x, 90, 92, 75, 6, '#f1eadb');
      ctx.fillStyle = '#54766a'; ctx.font = 'bold 9px sans-serif'; ctx.fillText('DU BIST', x + 15, 113); ctx.fillText('NICHT ALLEIN', x + 9, 129);
    }
    const officeX = worldWidth - 330;
    roundedRect(officeX, 190, 250, 116, 10, '#6d8390');
    roundedRect(officeX - 14, 177, 280, 28, 12, '#849aa1');
    roundedRect(officeX + 50, 304, 24, 32, 5, '#ab8366');
    roundedRect(officeX + 190, 304, 24, 32, 5, '#ab8366');
    ctx.fillStyle = '#48665e'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('EIN RUHIGER ORT', officeX + 70, 264);
    drawSafetyZone(officeX + 125, 'LEHRKRAFT');
  }

  function drawOffice(worldWidth) {
    gradientRect(0, 0, worldWidth, 270, '#dce5da', '#b7c8b9');
    gradientRect(0, 270, worldWidth, 170, '#e1d2bd', '#c4ae92');
    for (let x = 0; x < worldWidth; x += 180) {
      ctx.strokeStyle = 'rgba(98, 88, 70, .12)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, 272); ctx.lineTo(x, H); ctx.stroke();
    }
    roundedRect(70, 44, 148, 172, 8, '#f1eee0');
    roundedRect(80, 54, 128, 150, 6, '#bbd6ca');
    ctx.fillStyle = '#728e78';
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(120 + i * 13, 118 + (i % 2) * 20, 12, 0, Math.PI * 2); ctx.fill(); }
    for (let x = 360; x < worldWidth - 430; x += 620) {
      ctx.fillStyle = 'rgba(42, 48, 42, .17)';
      ctx.fillRect(x + 4, 243, 250, 5);
      roundedRect(x, 220, 250, 20, 8, '#9d8064');
      ctx.fillStyle = '#886a52'; ctx.fillRect(x + 20, 240, 14, 95); ctx.fillRect(x + 216, 240, 14, 95);
      roundedRect(x + 76, 190, 110, 28, 8, '#b8c5c6');
      ctx.fillStyle = '#496c63'; ctx.font = 'bold 11px sans-serif'; ctx.fillText('BERATUNG', x + 95, 181);
    }
    const supportX = worldWidth - 360;
    roundedRect(supportX, 62, 166, 122, 8, '#f1eee0');
    ctx.fillStyle = '#668b76'; ctx.fillRect(supportX + 12, 74, 142, 98);
    ctx.fillStyle = '#edf2dd'; ctx.font = 'bold 11px sans-serif'; ctx.fillText('FREUNDLICHKEIT', supportX + 53, 111); ctx.fillText('FÄNGT HIER AN', supportX + 38, 131);
    for (let x = 250; x < worldWidth - 100; x += 360) {
      roundedRect(x, 108, 78, 70, 5, '#8e7359');
      roundedRect(x + 7, 116, 64, 56, 3, '#d6c6ab');
      ctx.fillStyle = '#71927e';
      ctx.beginPath(); ctx.arc(x + 39, 145, 19, Math.PI, 0); ctx.fill();
      ctx.fillRect(x + 35, 145, 8, 20);
    }
    drawSafetyZone(worldWidth - 240, 'LEHRKRAFT');
  }

  function drawSafetyZone(x, label) {
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(55, 119, 96, .65)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(x, ground - 3, 55, 12, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#53766c';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, ground + 25);
    ctx.textAlign = 'start';
  }

  function drawObstacle(obstacle) {
    const x = obstacle.x;
    const y = ground - obstacle.height;
    if (obstacle.kind === 'bag') {
      roundedRect(x, y + 7, obstacle.width, obstacle.height - 7, 7, '#c98773');
      roundedRect(x + 7, y, obstacle.width - 14, 14, 5, '#d99c80');
      ctx.strokeStyle = '#715c50';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + obstacle.width / 2, y + 9, 6, Math.PI, 0);
      ctx.stroke();
      line(x + 8, ground - 3, x + 12, ground + 1, '#715c50', 2);
      line(x + obstacle.width - 8, ground - 3, x + obstacle.width - 12, ground + 1, '#715c50', 2);
    } else if (obstacle.kind === 'books') {
      roundedRect(x, y + 18, obstacle.width, 13, 3, '#668b76');
      roundedRect(x + 5, y + 6, obstacle.width - 8, 13, 3, '#d8a85f');
      roundedRect(x + 1, y - 2, obstacle.width - 7, 10, 3, '#7b91a1');
      line(x + 8, y + 8, x + 8, y + 17, '#f2ead8', 2);
    } else {
      ctx.fillStyle = '#d59a55';
      ctx.beginPath();
      ctx.moveTo(x + obstacle.width / 2, y);
      ctx.lineTo(x + obstacle.width, ground);
      ctx.lineTo(x, ground);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#f2ead8';
      ctx.fillRect(x + obstacle.width * .22, y + obstacle.height * .55, obstacle.width * .56, 5);
      ctx.fillStyle = '#849e8a';
      ctx.fillRect(x - 3, ground - 3, obstacle.width + 6, 4);
    }
    ctx.fillStyle = 'rgba(38, 56, 73, .65)';
    ctx.beginPath();
    ctx.ellipse(x + obstacle.width / 2, ground + 2, obstacle.width * .65, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawFirstPersonBackground(scene, horizon, jumpHeight) {
    const nearGround = H + jumpHeight * .85;
    if (scene.background === 'yard') {
      gradientRect(0, 0, W, horizon + 45, '#91bdcf', '#dce7df');
      const sunWash = ctx.createRadialGradient(W * .72, horizon * .08, 3, W * .72, horizon * .08, W * .72);
      sunWash.addColorStop(0, 'rgba(255,249,218,.65)');
      sunWash.addColorStop(1, 'rgba(255,249,218,0)');
      ctx.fillStyle = sunWash;
      ctx.fillRect(0, 0, W, horizon + 30);
      ctx.fillStyle = '#d9ded0';
      ctx.beginPath();
      ctx.moveTo(0, horizon - 24);
      ctx.lineTo(0, horizon - 68);
      ctx.lineTo(72, horizon - 92);
      ctx.lineTo(174, horizon - 92);
      ctx.lineTo(222, horizon - 62);
      ctx.lineTo(222, horizon - 17);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#97b5b7';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(26 + i * 58, horizon - 76, 35, 40);
        ctx.strokeStyle = 'rgba(249,245,224,.8)';
        ctx.lineWidth = 3;
        ctx.strokeRect(26 + i * 58, horizon - 76, 35, 40);
      }
      ctx.fillStyle = '#c4d2b2';
      for (let i = 0; i < 7; i++) {
        const x = i * 165 - 24;
        const scale = .45 + (i % 3) * .17;
        ctx.fillStyle = i % 2 ? '#829d78' : '#728e70';
        ctx.fillRect(x + 24 * scale, horizon - 28 * scale, 9 * scale, 84 * scale);
        for (let leaf = 0; leaf < 5; leaf++) {
          const foliage = ctx.createRadialGradient(
            x + (leaf % 3) * 24 * scale - 8 * scale,
            horizon - 62 * scale + Math.floor(leaf / 3) * 20 * scale - 5 * scale,
            2 * scale,
            x + (leaf % 3) * 24 * scale,
            horizon - 55 * scale + Math.floor(leaf / 3) * 20 * scale,
            36 * scale
          );
          foliage.addColorStop(0, '#9bb487');
          foliage.addColorStop(1, i % 2 ? '#68876a' : '#607f63');
          ctx.fillStyle = foliage;
          ctx.beginPath();
          ctx.ellipse(x + (leaf % 3) * 24 * scale, horizon - 55 * scale + Math.floor(leaf / 3) * 20 * scale,
            32 * scale, 22 * scale, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      gradientRect(0, horizon + 20, W, H - horizon, '#82976c', '#9caa78');
      ctx.fillStyle = '#b8b49a';
    } else {
      const wallTop = scene.background === 'room' ? '#c7d0cf' : '#c8d2cf';
      const wallBottom = scene.background === 'office' ? '#b5c5b9' : '#b3c2bd';
      gradientRect(0, 0, W, H, wallTop, wallBottom);

      const ceiling = ctx.createLinearGradient(0, 0, 0, horizon);
      ceiling.addColorStop(0, '#f0eee6');
      ceiling.addColorStop(1, '#d7d5cb');
      ctx.fillStyle = ceiling;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(W, 0);
      ctx.lineTo(W * .61, horizon); ctx.lineTo(W * .39, horizon);
      ctx.closePath(); ctx.fill();

      ctx.fillStyle = scene.background === 'office' ? '#9a8068' : '#ad9c84';
      ctx.beginPath();
      ctx.moveTo(0, horizon); ctx.lineTo(W * .39, horizon);
      ctx.lineTo(W * .12, nearGround); ctx.lineTo(0, nearGround);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(W, horizon); ctx.lineTo(W * .61, horizon);
      ctx.lineTo(W * .88, nearGround); ctx.lineTo(W, nearGround);
      ctx.closePath(); ctx.fill();

      const wallPanel = (side, depth, kind) => {
        const t = depth;
        const wallX = side === 0
          ? W * (.39 - .30 * t)
          : W * (.61 + .30 * t);
        const width = 25 + t * 155;
        const height = 28 + t * 125;
        const top = horizon - height * .78 - t * 10;
        const x = side === 0 ? wallX - width : wallX;
        ctx.fillStyle = 'rgba(32,48,50,.18)';
        ctx.fillRect(x - 3, top - 3, width + 6, height + 6);
        if (kind === 'window') {
          const frame = ctx.createLinearGradient(x, top, x + width, top + height);
          frame.addColorStop(0, '#f4f0e2');
          frame.addColorStop(1, '#c5c0b1');
          ctx.fillStyle = frame;
          ctx.fillRect(x, top, width, height);
          const inset = Math.max(3, width * .07);
          const glass = ctx.createLinearGradient(x, top, x + width, top + height);
          glass.addColorStop(0, '#a8c6c8');
          glass.addColorStop(1, '#708d91');
          ctx.fillStyle = glass;
          ctx.fillRect(x + inset, top + inset, width - inset * 2, height - inset * 2);
          ctx.strokeStyle = 'rgba(245,242,224,.8)';
          ctx.lineWidth = Math.max(1, t * 5);
          ctx.beginPath();
          ctx.moveTo(x + width * .5, top + inset); ctx.lineTo(x + width * .5, top + height - inset);
          ctx.moveTo(x + inset, top + height * .52); ctx.lineTo(x + width - inset, top + height * .52);
          ctx.stroke();
        } else if (kind === 'door') {
          ctx.fillStyle = '#806b59';
          ctx.fillRect(x, top, width, height);
          ctx.fillStyle = '#a88665';
          ctx.fillRect(x + width * .07, top + height * .035, width * .86, height * .965);
          ctx.fillStyle = '#4d655f';
          ctx.fillRect(x + width * .16, top + height * .13, width * .68, height * .72);
          ctx.fillStyle = '#e6c982';
          ctx.beginPath();
          ctx.arc(side === 0 ? x + width * .78 : x + width * .22, top + height * .55,
            Math.max(1.5, t * 4), 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#e8e1d1';
          ctx.fillRect(x - 4, top + height - 4, width + 8, Math.max(3, t * 8));
        } else if (kind === 'board') {
          ctx.fillStyle = '#8a7560';
          ctx.fillRect(x - 3, top - 3, width + 6, height + 6);
          ctx.fillStyle = '#e8e5d8';
          ctx.fillRect(x, top, width, height);
          ctx.fillStyle = '#6f8d82';
          ctx.fillRect(x + width * .06, top + height * .08, width * .88, height * .78);
          ctx.strokeStyle = 'rgba(255,255,255,.55)';
          ctx.lineWidth = Math.max(1, t * 3);
          ctx.beginPath();
          ctx.moveTo(x + width * .18, top + height * .3);
          ctx.lineTo(x + width * .45, top + height * .3);
          ctx.moveTo(x + width * .18, top + height * .5);
          ctx.lineTo(x + width * .7, top + height * .5);
          ctx.stroke();
          ctx.fillStyle = '#b5a68e';
          ctx.fillRect(x + width * .35, top + height * .9, width * .3, Math.max(2, t * 5));
        } else {
          ctx.fillStyle = '#765c48';
          ctx.fillRect(x, top, width, height);
          for (let shelf = 1; shelf <= 3; shelf++) {
            const shelfY = top + height * shelf / 4;
            ctx.fillStyle = '#d1b695';
            ctx.fillRect(x, shelfY, width, Math.max(2, t * 6));
            const bookColors = ['#9b6155', '#637d78', '#d2ab67', '#71839a'];
            for (let book = 0; book < 4; book++) {
              const bookX = x + width * (.08 + book * .21);
              const bookH = height * (.1 + ((book + shelf) % 2) * .05);
              ctx.fillStyle = bookColors[(book + shelf) % bookColors.length];
              ctx.fillRect(bookX, shelfY - bookH, width * .14, bookH);
            }
          }
        }
      };

      for (let i = 0; i < 4; i++) {
        const depth = .22 + i * .2;
        let panelKind = i % 2 ? 'door' : 'window';
        if (scene.background === 'room') panelKind = i % 2 ? 'board' : 'window';
        if (scene.background === 'office') panelKind = i % 2 ? 'shelf' : 'window';
        wallPanel(i % 2, depth, panelKind);
      }

      const wallTint = scene.background === 'office'
        ? 'rgba(255,244,218,.045)'
        : 'rgba(255,255,255,.055)';
      ctx.fillStyle = wallTint;
      for (let i = 0; i < 150; i++) {
        const seed = Math.sin(i * 127.1 + (scene.background === 'room' ? 23 : 5)) * 43758.5453;
        const rx = (seed - Math.floor(seed)) * W;
        const rySeed = Math.sin(i * 311.7 + 11) * 24634.6345;
        const ry = (rySeed - Math.floor(rySeed)) * Math.max(1, horizon - 8);
        const size = 1 + (i % 3);
        ctx.fillRect(rx, ry, size, size);
      }

      ctx.strokeStyle = 'rgba(76,67,56,.15)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 5; i++) {
        const depth = i / 6;
        const y = horizon * (.34 + depth * .49);
        const x = W * (.39 - depth * .3);
        ctx.beginPath();
        ctx.moveTo(x, y); ctx.lineTo(x + 13 + depth * 25, y + 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(W - x, y); ctx.lineTo(W - x - 13 - depth * 25, y + 2);
        ctx.stroke();
      }

      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(59,50,42,.35)';
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(W * .12, nearGround);
      ctx.moveTo(W, horizon);
      ctx.lineTo(W * .88, nearGround);
      ctx.stroke();
      ctx.lineWidth = 3;
      ctx.strokeStyle = scene.background === 'office'
        ? 'rgba(237,222,194,.72)'
        : 'rgba(238,232,215,.68)';
      ctx.beginPath();
      ctx.moveTo(0, horizon - 5);
      ctx.lineTo(W * .12, nearGround - 10);
      ctx.moveTo(W, horizon - 5);
      ctx.lineTo(W * .88, nearGround - 10);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(94,103,99,.13)';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 5; i++) {
        const x = W / 2 + i * 18;
        const y = horizon * .76;
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(W / 2 + i * 5, y);
        ctx.moveTo(W - x, 0); ctx.lineTo(W / 2 - i * 5, y);
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(248,246,225,.85)';
      ctx.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        const t = .16 + i * .2;
        const y = horizon * (.12 + t * .45);
        const width = 18 + t * 92;
        ctx.strokeStyle = 'rgba(60,65,58,.17)';
        ctx.lineWidth = 7 + t * 7;
        ctx.beginPath();
        ctx.moveTo(W / 2 - width / 2 - 2, y + 2);
        ctx.lineTo(W / 2 + width / 2 + 2, y + 2);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,251,226,.9)';
        ctx.lineWidth = 2 + t * 5;
        ctx.beginPath();
        ctx.moveTo(W / 2 - width / 2, y);
        ctx.lineTo(W / 2 + width / 2, y);
        ctx.stroke();
      }
    }

    ctx.fillStyle = scene.background === 'yard' ? '#81966b'
      : (scene.background === 'office' ? '#9c866e'
        : (scene.background === 'room' ? '#a98161' : '#c8bda9'));
    ctx.beginPath();
    ctx.moveTo(0, horizon); ctx.lineTo(W, horizon);
    ctx.lineTo(W, nearGround); ctx.lineTo(0, nearGround);
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,.14)';
    ctx.beginPath();
    ctx.moveTo(W * .43, horizon); ctx.lineTo(W * .57, horizon);
    ctx.lineTo(W * .92, nearGround); ctx.lineTo(W * .08, nearGround);
    ctx.closePath(); ctx.fill();

    const floorShade = ctx.createLinearGradient(0, horizon, 0, nearGround);
    floorShade.addColorStop(0, 'rgba(236,231,213,.25)');
    floorShade.addColorStop(1, scene.background === 'yard'
      ? 'rgba(53,91,54,.22)' : 'rgba(94,85,66,.24)');
    ctx.fillStyle = floorShade;
    ctx.fillRect(0, horizon, W, nearGround - horizon);

    const tileBand = (t, side) => {
      const y = horizon + (nearGround - horizon) * t * t;
      const next = horizon + (nearGround - horizon) * (t + .1) * (t + .1);
      const left = W / 2 - (W / 2) * t;
      const right = W / 2 + (W / 2) * t;
      const center = W / 2;
      const tint = scene.background === 'yard'
        ? (side % 2 ? 'rgba(239,231,207,.055)' : 'rgba(51,78,50,.045)')
        : (side % 2 ? 'rgba(255,255,255,.075)' : 'rgba(75,58,43,.035)');
      ctx.fillStyle = tint;
      ctx.fillRect(left, y, (right - left) * .5, next - y);
      ctx.fillRect(center, y, (right - left) * .5, next - y);
    };
    for (let i = 1; i < 10; i++) tileBand(i / 10, i);

    ctx.strokeStyle = 'rgba(78, 70, 56, .28)';
    ctx.lineWidth = 1.5;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(W / 2 + i * 5, horizon);
      ctx.lineTo(W / 2 + i * 130, nearGround);
      ctx.stroke();
    }
    for (let i = 1; i <= 7; i++) {
      const t = i / 8;
      const y = horizon + (nearGround - horizon) * t * t;
      ctx.strokeStyle = i % 2 ? 'rgba(78,70,56,.20)' : 'rgba(255,255,255,.14)';
      ctx.lineWidth = 1 + t * 1.5;
      ctx.beginPath();
      ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.stroke();
    }

    if (scene.background === 'yard') {
      ctx.fillStyle = 'rgba(40,71,44,.12)';
      for (let i = 0; i < 100; i++) {
        const seed = Math.sin(i * 91.7 + 4) * 32871.12;
        const x = (seed - Math.floor(seed)) * W;
        const depth = .2 + (i % 8) * .09;
        const y = horizon + (nearGround - horizon) * depth * depth;
        const length = 2 + depth * 10;
        ctx.fillRect(x, y, 1 + depth, length);
      }
      ctx.strokeStyle = 'rgba(239,236,215,.85)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, horizon + 18); ctx.lineTo(W, horizon + 18);
      ctx.moveTo(W / 2, horizon); ctx.lineTo(W / 2, nearGround);
      ctx.moveTo(W * .2, horizon + 14); ctx.lineTo(W * .05, nearGround);
      ctx.moveTo(W * .8, horizon + 14); ctx.lineTo(W * .95, nearGround);
      ctx.stroke();
    } else if (scene.background === 'room') {
      ctx.strokeStyle = 'rgba(75,48,31,.27)';
      ctx.lineWidth = 2;
      for (let i = 1; i <= 9; i++) {
        const t = i / 10;
        const y = horizon + (nearGround - horizon) * t * t;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      for (const side of [-1, 1]) {
        for (let i = 1; i <= 3; i++) {
          const depth = .28 + i * .17;
          const scale = 500 / (depth * 500 + 500);
          const x = W / 2 + side * (190 + i * 55);
          const y = horizon + (nearGround - horizon) * depth * depth;
          const deskW = 40 + (1 - depth) * 55;
          const deskH = 8 + (1 - depth) * 15;
          ctx.fillStyle = 'rgba(62,48,38,.22)';
          ctx.beginPath(); ctx.ellipse(x, y + deskH, deskW * .72, deskH * .25, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = i % 2 ? '#9a7152' : '#b1845e';
          ctx.beginPath();
          ctx.moveTo(x - deskW, y); ctx.lineTo(x + deskW, y);
          ctx.lineTo(x + deskW * .76, y + deskH); ctx.lineTo(x - deskW * .76, y + deskH);
          ctx.closePath(); ctx.fill();
          ctx.strokeStyle = 'rgba(63,49,38,.5)';
          ctx.lineWidth = Math.max(1, 4 / scale);
          ctx.beginPath();
          ctx.moveTo(x - deskW * .65, y + deskH); ctx.lineTo(x - deskW * .7, y + deskH * 2);
          ctx.moveTo(x + deskW * .65, y + deskH); ctx.lineTo(x + deskW * .7, y + deskH * 2);
          ctx.stroke();
        }
      }
    } else if (scene.background === 'office') {
      ctx.strokeStyle = 'rgba(82,60,43,.18)';
      ctx.lineWidth = 2;
      for (let i = 1; i <= 5; i++) {
        const y = horizon + (nearGround - horizon) * (i / 6) ** 2;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      ctx.fillStyle = '#647d68';
      ctx.beginPath();
      ctx.moveTo(70, horizon + 20); ctx.lineTo(120, horizon + 20);
      ctx.lineTo(142, horizon - 30); ctx.lineTo(94, horizon - 25);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#8b684d';
      ctx.fillRect(96, horizon + 15, 8, 40);
    }
  }

  function drawFirstPersonWorld(scene, horizon) {
    const objects = [];
    scene.obstacles.forEach((obstacle) => {
      objects.push({ distance: obstacle.x - state.playerX, type: 'obstacle', value: obstacle });
    });
    scene.characters.forEach((character, index) => {
      objects.push({ distance: character.x - state.playerX, type: 'character', value: character, index });
    });
    objects.push({ distance: scene.target + 25 - state.playerX, type: 'teacher', value: null });
    objects.sort((a, b) => b.distance - a.distance);

    for (const object of objects) {
      const distance = object.distance;
      if (distance < -40 || distance > 3000) continue;
      const depth = 500 / (Math.max(0, distance) + 500);
      const scale = depth * 4.95;
      const footY = horizon + (H - horizon) * depth + state.jumpHeight * .85 * depth;
      const laneOffset = object.type === 'character' && object.value.kind === 'peer'
        ? (object.index % 2 === 0 ? -92 : 92) * scale
        : 0;
      const x = W / 2 + laneOffset;

      if (object.type === 'obstacle') {
        const obstacle = object.value;
        ctx.save();
        ctx.translate(W / 2, footY - scale * ground);
        ctx.scale(scale, scale);
        drawObstacle({ ...obstacle, x: -obstacle.width / 2 });
        ctx.restore();
      } else {
        let pose = 'idle';
        if (object.type === 'character' && state.attack &&
            object.value.x === state.attack.attackerX) {
          pose = state.attack.phase === 'warning' ? 'windup' : 'punch';
        }
        const isTeacher = object.type === 'teacher' || object.value.kind === 'helper';
        const color = isTeacher ? '#6fa98f' : (object.value.color || '#a94f4a');
        drawPerson(x, footY, color, pose, scale * (object.type === 'teacher' ? .9 : .98),
          isTeacher, 1, isTeacher ? 'teacher' : 'bully');
      }
    }

    const edgeShade = ctx.createLinearGradient(0, 0, W, 0);
    edgeShade.addColorStop(0, 'rgba(24,35,38,.16)');
    edgeShade.addColorStop(.14, 'rgba(24,35,38,0)');
    edgeShade.addColorStop(.86, 'rgba(24,35,38,0)');
    edgeShade.addColorStop(1, 'rgba(24,35,38,.16)');
    ctx.fillStyle = edgeShade;
    ctx.fillRect(0, 0, W, H);
  }

  function drawFirstPersonArms(ducking, jumping, now) {
    const bob = state.walk ? Math.sin(state.walk * 2) * 5 : 0;
    const jumpAmount = Math.min(1, state.jumpHeight / 150);
    const rising = jumping && state.jumpVelocity > 90;
    const landing = jumping && state.jumpVelocity < -170;
    const landingBounce = !jumping && state.landUntil > now
      ? Math.sin((1 - (state.landUntil - now) / 260) * Math.PI) * 9
      : 0;
    const lift = ducking ? 8 : (jumping
      ? -jumpAmount * 72 + (landing ? 12 : 0)
      : landingBounce);
    const reach = jumping ? jumpAmount * 12 : 0;
    const tuck = rising ? 5 : (landing ? -4 : 0);
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineWidth = 24;
    ctx.strokeStyle = '#397eaa';
    ctx.beginPath();
    ctx.moveTo(48, H + 34);
    ctx.lineTo(112 + bob, H - 36 + lift + tuck);
    ctx.lineTo(150 + bob + reach, H - 3 + lift);
    ctx.moveTo(W - 48, H + 34);
    ctx.lineTo(W - 112 - bob, H - 36 + lift + tuck);
    ctx.lineTo(W - 150 - bob - reach, H - 3 + lift);
    ctx.stroke();
    ctx.lineWidth = 9;
    ctx.strokeStyle = '#263849';
    ctx.beginPath();
    ctx.moveTo(150 + bob + reach, H - 3 + lift); ctx.lineTo(163 + bob + reach, H + 1 + lift);
    ctx.moveTo(W - 150 - bob - reach, H - 3 + lift); ctx.lineTo(W - 163 - bob - reach, H + 1 + lift);
    ctx.stroke();
    ctx.restore();
  }

  function drawFirstPersonLegs(jumping) {
    if (!jumping) return;
    const jumpAmount = Math.min(1, state.jumpHeight / 150);
    const rising = state.jumpVelocity > 90;
    const tuck = rising ? 8 : 0;
    const hipY = H + 54;
    const kneeY = H + 9 - jumpAmount * 55 + tuck;
    const shoeY = H + 32 - jumpAmount * 85 + tuck;
    const sway = Math.sin(state.walk * 2) * 4;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 34;
    ctx.strokeStyle = '#397eaa';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 12, hipY);
    ctx.lineTo(W / 2 - 48 + sway, kneeY);
    ctx.lineTo(W / 2 - 75 + sway, shoeY);
    ctx.moveTo(W / 2 + 12, hipY);
    ctx.lineTo(W / 2 + 48 + sway, kneeY);
    ctx.lineTo(W / 2 + 75 + sway, shoeY);
    ctx.stroke();
    ctx.lineWidth = 16;
    ctx.strokeStyle = '#263849';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 75 + sway, shoeY);
    ctx.lineTo(W / 2 - 48 + sway, shoeY + 2);
    ctx.moveTo(W / 2 + 75 + sway, shoeY);
    ctx.lineTo(W / 2 + 48 + sway, shoeY + 2);
    ctx.stroke();
    ctx.restore();
  }

  function updateObstacles(scene, dt, now) {
    if (!state.started || state.talking || !retryOverlay.classList.contains('hidden') ||
        !endOverlay.classList.contains('hidden')) return;
    if (state.jumpRequested) {
      if (state.jumpHeight === 0) {
        state.jumpVelocity = 500;
        state.landUntil = 0;
      }
      state.jumpRequested = false;
    }
    if (state.jumpHeight > 0 || state.jumpVelocity > 0) {
      state.jumpHeight += state.jumpVelocity * dt;
      state.jumpVelocity -= 850 * dt;
      if (state.jumpHeight <= 0) {
        state.jumpHeight = 0;
        state.jumpVelocity = 0;
        state.landUntil = now + 220;
      }
    }
    for (let i = 0; i < scene.obstacles.length; i++) {
      const obstacle = scene.obstacles[i];
      if (state.direction > 0 && state.playerX < obstacle.x - 220 && state.playerX > obstacle.x - 260 &&
          !state.warnedObstacles.has(i)) {
        state.warnedObstacles.add(i);
        showToast('Hindernis voraus! Mach dich bereit zum Springen.');
      }
      const overlaps = state.playerX + 13 >= obstacle.x && state.playerX - 13 <= obstacle.x + obstacle.width;
      if (overlaps) {
        if (state.jumpHeight >= obstacle.height + 8) {
          if (!state.jumpedObstacles.has(i)) {
            state.jumpedObstacles.add(i);
            showToast('Gut gesprungen! Du hast das Hindernis überwunden.');
          }
        } else {
          state.playerX = state.direction > 0 ? obstacle.x - 14 : obstacle.x + obstacle.width + 14;
          if (now >= state.invulnerableUntil) {
            state.lives -= 1;
            state.invulnerableUntil = now + 1050;
            if (state.lives <= 0) {
              retryOverlay.classList.remove('hidden');
              setStatus('Abschnitt wiederholen', false);
            } else {
              setStatus('Hindernis getroffen – versuch es weiter');
              showToast('Du bist gegen ein Hindernis gestoßen. Spring über das nächste.');
            }
          }
        }
      }
    }
  }

  function drawHitPoints() {
    roundedRect(16, 14, 80, 38, 9, 'rgba(24, 42, 52, .78)');
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i < state.lives ? '#e87972' : 'rgba(255,255,255,.25)';
      ctx.beginPath();
      const x = 33 + i * 22;
      ctx.moveTo(x, 43);
      ctx.bezierCurveTo(x - 9, 37, x - 6, 31, x, 36);
      ctx.bezierCurveTo(x + 6, 31, x + 9, 37, x, 43);
      ctx.fill();
    }
  }

  function updateThreat(now) {
    if (!state.started || state.talking || !retryOverlay.classList.contains('hidden') ||
        !endOverlay.classList.contains('hidden') || now < state.invulnerableUntil) return;
    const scene = scenes[state.sceneIndex];
    if (state.attack) {
      if (state.attack.phase === 'warning' && now - state.attack.startedAt >= 650) {
        state.attack.phase = 'strike';
        state.attack.startedAt = now;
        if (state.touch.has('duck') || state.keys.has('Shift')) {
          state.attack = null;
          state.attackCooldown = now + 1100;
          showToast('Gut ausgewichen! Geh weiter zur Lehrkraft.');
        } else if (Math.abs(state.attack.attackerX - state.playerX) > 160) {
          state.attack = null;
          state.attackCooldown = now + 800;
          showToast('Du bist dem Schlag ausgewichen. Lauf weiter zu Frau Boris.');
        } else {
          state.lives -= 1;
          state.playerX = Math.max(34, state.playerX - 58);
          state.invulnerableUntil = now + 1300;
          state.hitUntil = now + 320;
          state.attack = null;
          state.attackCooldown = now + 1500;
          if (state.lives <= 0) {
            retryOverlay.classList.remove('hidden');
            setStatus('Abschnitt wiederholen', false);
          } else {
            setStatus('Weiter geht’s – duck dich nächstes Mal');
            showToast('Du wurdest zurückgestoßen. Achte auf die Warnung und halte Umschalt zum Ducken gedrückt.');
          }
        }
      }
      return;
    }
    if (now < state.attackCooldown) return;
    const attacker = scene.characters.find((character) =>
      character.kind === 'peer' && character.x >= state.playerX &&
      character.x - state.playerX < 180
    );
    if (attacker) {
      state.attack = { attackerX: attacker.x, startedAt: now, phase: 'warning' };
      showToast('Achtung, ein Schlag kommt! Halte Umschalt zum Ducken gedrückt.');
    }
  }

  function render(now) {
    const dt = Math.min((now - state.lastFrame) / 1000 || 0, 0.05);
    state.lastFrame = now;
    ctx.clearRect(0, 0, W, H);
    const scene = scenes[state.sceneIndex] || scenes[0];
    const ducking = state.keys.has('Shift') || state.touch.has('duck');
    const stepBob = state.walk ? Math.sin(state.walk * 2) * 2 : 0;
    const jumpView = Math.min(state.jumpHeight * .1, 16);
    const landingBounce = state.landUntil > now
      ? Math.sin((1 - (state.landUntil - now) / 220) * Math.PI) * 6
      : 0;
    const horizon = (ducking ? 325 : 300) + jumpView + landingBounce + stepBob;
    const hitShake = state.hitUntil > now
      ? Math.sin(now / 18) * 4 * ((state.hitUntil - now) / 320)
      : 0;
    ctx.save();
    ctx.translate(hitShake, 0);
    drawFirstPersonBackground(scene, horizon, state.jumpHeight);

    if (state.started && !state.talking && endOverlay.classList.contains('hidden') && retryOverlay.classList.contains('hidden')) {
      const forward = state.keys.has('ArrowUp') || state.keys.has('w') || state.touch.has('forward');
      const backward = state.keys.has('ArrowDown') || state.keys.has('s') || state.touch.has('backward');
      const speed = 190;
      if (forward !== backward) {
        state.direction = forward ? 1 : -1;
        state.playerX += state.direction * speed * dt;
        state.walk += dt * 10;
      }
      state.playerX = Math.max(34, Math.min(scene.target - 28, state.playerX));
      if (state.playerX >= scene.target - 28) {
        if (!state.canInteract) {
          state.canInteract = true;
          tellTeacher();
        }
      } else {
        state.canInteract = false;
      }
    }

    updateObstacles(scene, dt, now);
    updateThreat(now);
    drawFirstPersonWorld(scene, horizon);
    const jumping = state.jumpHeight > 0;
    drawFirstPersonArms(ducking, jumping, now);
    drawFirstPersonLegs(jumping);
    const nextObstacleDistance = Math.min(...scene.obstacles
      .map((obstacle) => obstacle.x - state.playerX)
      .filter((distance) => distance > 0));
    if (Number.isFinite(nextObstacleDistance) && nextObstacleDistance < 255 &&
        state.jumpHeight === 0 && !ducking) {
      const urgent = nextObstacleDistance < 205;
      const pulse = .82 + Math.sin(now / 90) * .18;
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.textAlign = 'center';
      ctx.fillStyle = urgent ? '#9b453f' : '#263849';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(urgent ? 'JETZT SPRINGEN!' : 'HINDERNIS VORAUS', W / 2, 148);
      ctx.font = 'bold 38px sans-serif';
      ctx.fillText('↓', W / 2, 190);
      ctx.restore();
    } else if (jumping) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.fillStyle = '#263849';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(state.jumpVelocity > 0 ? 'IN DER LUFT' : 'LANDUNG', W / 2, 148);
      ctx.restore();
    }
    if (state.attack && state.attack.phase === 'warning') {
      ctx.fillStyle = '#9b453f';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!  ACHTUNG — MIT UMSCHALT DUCKEN  !', W / 2, 102);
      ctx.textAlign = 'start';
    }
    ctx.restore();
    if (state.hitUntil > now) {
      const hitFlash = ctx.createRadialGradient(W / 2, H / 2, H * .2, W / 2, H / 2, W * .75);
      hitFlash.addColorStop(0, 'rgba(190, 45, 38, 0)');
      hitFlash.addColorStop(1, 'rgba(190, 45, 38, .32)');
      ctx.fillStyle = hitFlash;
      ctx.fillRect(0, 0, W, H);
    }
    drawHitPoints();
    roundedRect(16, 58, 190, 8, 4, 'rgba(24, 42, 52, .68)');
    roundedRect(16, 58, 190 * Math.min(1, state.playerX / scene.target), 8, 4, '#9be0c5');
    requestAnimationFrame(render);
  }

  document.getElementById('start-button').addEventListener('click', startGame);
  storyContinue.addEventListener('click', continueStory);
  document.getElementById('restart-button').addEventListener('click', () => {
    endOverlay.classList.add('hidden');
    state.sceneIndex = 0;
    startGame();
  });
  document.getElementById('retry-button').addEventListener('click', () => {
    retryOverlay.classList.add('hidden');
    beginScene(state.sceneIndex);
    showToast('Du bekommst einen neuen Versuch. Achte auf die Warnung und duck dich mit Umschalt.');
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (['ArrowUp', 'ArrowDown'].includes(key) || event.code === 'Space') event.preventDefault();
    if ((event.code === 'Space' || key === ' ' || key === 'Spacebar') && !event.repeat) {
      if (state.started && storyOverlay.classList.contains('hidden') &&
          retryOverlay.classList.contains('hidden') && endOverlay.classList.contains('hidden')) {
        state.jumpRequested = true;
      }
      return;
    }
    state.keys.add(key);
  });
  document.addEventListener('keyup', (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    state.keys.delete(key);
  });
  window.addEventListener('blur', () => { state.keys.clear(); state.touch.clear(); });
  document.querySelectorAll('.touch-button').forEach((button) => {
    const key = button.dataset.key;
    const begin = (event) => {
      event.preventDefault();
      if (key === 'jump') state.jumpRequested = true;
      else state.touch.add(key);
    };
    const end = () => state.touch.delete(key);
    button.addEventListener('pointerdown', begin);
    button.addEventListener('pointerup', end);
    button.addEventListener('pointercancel', end);
    button.addEventListener('pointerleave', end);
  });

  beginScene(0);
  requestAnimationFrame(render);
})();
