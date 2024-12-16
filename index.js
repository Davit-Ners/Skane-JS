const zoneDeJeu = document.querySelector('.zoneDeJeu');
const emplacementSnake = [10, 5];
const emplacementGold = [10, 11];
const score = document.querySelector('#score');
let taille = 0;
score.textContent = taille;
const deplacement = [];
const oldLoc = [];
const tailleCorps = [];
let left, right, up, down;
let vitesse = 100;
let gameOver = false;
const passages = [];

// Fonction pour creer un element HTML
function creerElement(type, cclass = undefined, id = undefined, src = undefined, text = undefined) {
    const element = document.createElement(type);
    if (cclass) { element.setAttribute('class', cclass) };
    if (id) { element.setAttribute('id', id) };
    if (src) { element.setAttribute('src', src) };
    if (text) { element.textContent = text };
    return element;
}

// Fonction pour creer tableau de jeu
function creerTableJeu() {
    const table = [];
    for (let i = 0; i < 20; i++) {
        table.push([]);
        for (let j = 0; j < 20; j++) {
            const block = {
                couleur: 'block',
                hasSnakeHead: false,
                hasSnakeBody: false,
                hasPoint: false,
                lastLoc: [],
                passage: null,
                passageTemp: null
            };
            table[i].push(block);
        }
    }
    table[10][5].hasSnakeHead = true;
    table[10][11].hasPoint = true;
    return table;
}

const tt = creerTableJeu();

// Fonction pour creer zone de jeu
function creerZoneDeJeu() {
    zoneDeJeu.innerHTML = '';
    comptId0 = 0;
    comptId1 = 0;
    for (range of tt) {
        const ligne = creerElement('div', 'ligne');
        for (block of range) {
            const carre = creerElement('div', block.couleur, `${comptId0}-${comptId1}`);
            comptId1++;
            if (block.hasSnakeHead) {
                carre.classList = 'snakeTete';
            }
            else if (block.hasSnakeBody) {
                carre.classList = 'snakeCorps';
            }
            else if (block.hasPoint) {
                const point = creerElement('div', 'point');
                carre.append(point);
            }
            ligne.append(carre);
        }
        comptId0++;
        comptId1 = 0;
        zoneDeJeu.append(ligne);
    }
}

// Fonction pour placer la piece au hasard
function placerPiece() {
    let cond = false;
    while (!cond) {
        let emplacement0 = Math.floor(Math.random() * 20);
        let emplacement1 = Math.floor(Math.random() * 20);

        if (!tt[emplacement0][emplacement1].hasPoint && !tt[emplacement0][emplacement1].hasSnakeHead && !tt[emplacement0][emplacement1].hasSnakeBody) {
            tt[emplacement0][emplacement1].hasPoint = true;
            tt[emplacementGold[0]][emplacementGold[1]].hasPoint = false;
            tt[emplacement0][emplacement1].hasPoint = true;
            emplacementGold[0] = emplacement0;
            emplacementGold[1] = emplacement1;
            cond = true;
        }
    }
}

// Fonction pour pas que snake sorte du jeu
function checkIfOut(emplacement0, emplacement1) {
    return (emplacement0 >= 0 && emplacement0 < 20 && emplacement1 >= 0 && emplacement1 < 20 && !(tt[emplacement0][emplacement1].hasSnakeBody));
}

function resetPassage(x, transformation) {
    for (const ligne of tt) {
        for (const block of ligne) {
            if (block.passage == x) {
                block.passage = transformation;
                block.hasSnakeBody = false;
            }
        }
    }
}

function resetPassageTemp(x, transformation) {
    for (const ligne of tt) {
        for (const block of ligne) {
            if (block.passageTemp == x) {
                (console.log("OK"));
                block.passageTemp = transformation;
                block.hasSnakeBody = false;
            }
        }
    }
}

function trouverPassage(x) {
    for (let i = 0; i < tt.length; i++) {
        for (let j = 0; j < tt.length; j++) {
            if (tt[i][j].passage == x) {
                let coord = [i, j];
                return coord;
            }
        }
    }
}

function trouverPassageTemp(x) {
    for (let i = 0; i < tt.length; i++) {
        for (let j = 0; j < tt.length; j++) {
            if (tt[i][j].passageTemp == x) {
                let coord = [i, j];
                return coord;
            }
        }
    }
}

// Fonction pour gerer les depacements

function mouvDeplacement(i0, i1) {
    let id0 = emplacementSnake[0];
    let id1 = emplacementSnake[1];

    if (!checkIfOut(id0 + i0, id1 + i1)) {
        gameOver = true;
        ClearAllIntervals();
        document.removeEventListener('keyup', whichKey);
        document.querySelector('.over').style.display = 'block';
        document.querySelector('.over').style.animation = 'app 1s';
        return;
    }
    tt[id0][id1].hasSnakeHead = false;
    resetPassage(-1, null);
    tt[id0][id1].passage = -1;
    tt[id0 + i0][id1 + i1].hasSnakeHead = true;

    tt[id0 + i0][id1 + i1].lastLoc[0] = id0;
    tt[id0 + i0][id1 + i1].lastLoc[1] = id1;

    emplacementSnake[0] += i0;
    emplacementSnake[1] += i1;


    if (taille > 0) {
        resetPassage(1, null)
        const snakePos = trouverPassage(-1);
        tt[snakePos[0]][snakePos[1]].hasSnakeBody = true;
        tt[snakePos[0]][snakePos[1]].passage = 1;
        tt[snakePos[0]][snakePos[1]].passageTemp = 1;
    }

    if (taille > 1) {
        for (let i = 2; i <= taille; i++) {
            if (!trouverPassageTemp(i)) {
                const pos = trouverPassage(i-1);
                tt[pos[0]][pos[1]].passageTemp = i;
            }
            else {
                resetPassage(i, null);
                const pos = trouverPassageTemp(i);
                const nextPos = trouverPassage(i-1);
                resetPassageTemp(i, null);
                tt[pos[0]][pos[1]].hasSnakeBody = true;
                tt[pos[0]][pos[1]].passage = i;
                tt[nextPos[0]][nextPos[1]].passageTemp = i;
                console.log(tt[nextPos[0]][nextPos[1]].passageTemp);
                console.log(pos[0], pos[1]);
                console.log("NEXT", nextPos[0], nextPos[1]);
            }
        }
    }

    if (id0 == emplacementGold[0] && id1 == emplacementGold[1]) {
        placerPiece();
        taille++;
        score.textContent = taille;
    }

    creerZoneDeJeu()
}

function whichKey(event) {
    document.querySelector('#lancer').style.display = 'none';
    if (event.keyCode === 37 && deplacement[0] != 'right' && deplacement[0] != 'left') {
        deplacement[0] = 'left';
        ClearAllIntervals();
        mouvDeplacement(0, -1);
        left = setInterval(function () { mouvDeplacement(0, -1) }, vitesse);
    }
    else if (event.keyCode === 39 && deplacement[0] != 'right' && deplacement[0] != 'left') {
        deplacement[0] = 'right';
        ClearAllIntervals();
        mouvDeplacement(0, 1);
        right = setInterval(function () { mouvDeplacement(0, 1) }, vitesse);
    }
    else if (event.keyCode === 38 && deplacement[0] != 'up' && deplacement[0] != 'down') {
        deplacement[0] = 'up';
        ClearAllIntervals();
        mouvDeplacement(-1, 0);
        up = setInterval(function () { mouvDeplacement(-1, 0) }, vitesse);
    }
    else if (event.keyCode === 40 && deplacement[0] != 'up' && deplacement[0] != 'down') {
        deplacement[0] = 'down';
        ClearAllIntervals();
        mouvDeplacement(1, 0);
        down = setInterval(function () { mouvDeplacement(1, 0) }, vitesse);
    }
    return 0;
}

// Fonction pour effacer les SetIntervals
function ClearAllIntervals() {
    if (left) clearInterval(left);
    if (right) clearInterval(right);
    if (up) clearInterval(up);
    if (down) clearInterval(down);
}

document.addEventListener("keyup", whichKey);
creerZoneDeJeu();