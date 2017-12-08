// - global -------------------------------------------------------------------
var screenCanvas, info;
var screenCanvas, info_2;
var run = true;
var fps = 100 / 100;
var mouse = new Point();
/**@type{CanvasRenderingContext2D} */
var ctx;
var fire = false;
var counter = 0;
var SHOT_counter = 0;
var /*SHOT_*/ bosscounter = 0;
var chara;
var IsCheating = false;
var Arecheating = false;
var Wascheating = false;
var Key = 0;
var IsSlow = false;
var Kakusan = false;
var Syuugou = false;
var Music = false;
var point = 0;
var invincible = false;
//count-------------------------------------------
var bossSABcounter = 0;

// - const --------------------------------------------------------------------
//Chara
var CHARA_COLOR = 'rgba(0,0,0,1)';
var CHARA_SHOT_COLOR = 'rgba(255,255,255, 1)';
var life = 5;
var CHARA_SHOT_MAX_COUNT = 10000;
//Enemy
var ENEMY_COLOR = 'rgba(10, 100, 230, 0.6)';
var ENEMY_SHOT_COLOR = 'rgba(0, 50, 255, 1)';
var ENEMY_SHOT_MAX_COUNT = 1000;
var ENEMY_MAX_COUNT = 100;
//Boss
var BOSS_COLOR = 'rgba(35, 71, 130,0.8)';
var BOSS_SHOT_COLOR = 'rgba(255,255,0,1)';
var BOSS_HP = 250;
var BOSS_SABHP = 4;
var BOSS_MAX_COUNT = 2;
var BOSS_SHOT_MAX_COUNT = 10000;
var BOSS_COUNTER = "妖狐";
//BossSAB
var BOSSSAB_MAX_COUNT = 100;
var BOSSSAB_COLOR = 'rgba(35, 71, 160,0.8)';
// - main ---------------------------------------------------------------------
window.onload = function () {
  var img = new Image();
  img.src = "back8.bmp";
  var i, j;
  var p = new Point();

  screenCanvas = document.getElementById('screen');
  screenCanvas.width = 1364;
  screenCanvas.height = 630;
  ctx = screenCanvas.getContext('2d');
  screenCanvas.addEventListener('mousemove', mouseMove, true);
  screenCanvas.addEventListener('mousedown', mouseDown, true);
  screenCanvas.addEventListener('mouseup', mouseUp, true);
  document.addEventListener('keydown', keyDown, true);
  document.addEventListener('keyup', keyUp, true);
  info = document.getElementById('info');
  info_2 = document.getElementById('info_2');

  var chara = new Character();
  chara.init(10);
  var charaShot = new Array(CHARA_SHOT_MAX_COUNT);
  for (i = 0; i < charaShot.length; i++)
    charaShot[i] = new CharacterShot();
  var enemyShot = new Array(ENEMY_SHOT_MAX_COUNT);
  for (i = 0; i < enemyShot.length; i++)
    enemyShot[i] = new EnemyShot();
  var bossShot = new Array(BOSS_SHOT_MAX_COUNT);
  for (i = 0; i < bossShot.length; i++)
    bossShot[i] = new BossShot();
  var bossCount = 0;

  // - 敵キャラクター用インスタンスの初期化-------------------------------
  var enemy = new Array(ENEMY_MAX_COUNT);
  for (i = 0; i < ENEMY_MAX_COUNT; i++)
    enemy[i] = new Enemy();
  var boss = new Array(BOSS_MAX_COUNT);
  for (i = 0; i < BOSS_MAX_COUNT; i++)
    boss[i] = new Boss();
  var bossSAB = new Array(BOSS_MAX_COUNT);
  for (i = 0; i < BOSSSAB_MAX_COUNT; i++)
    bossSAB[i] = new BossSAB();

  // -音楽(BGM)---------------------------------------------------------
  /* var audio = new Audio();
    audio.src = "./Dear....mp3";
    audio.loop = true;

    // 再生を開始する
    audio.play();*/


  chara.position.x = 675;
  chara.position.y = 500;
  var slowCount = 0;
  (function () {
    slowCount++;
    // console.log("A");
    if (!IsSlow || slowCount % 5 == 0) {
      ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = .5;
      ctx.drawImage(img, 0, 0, screenCanvas.width, screenCanvas.width);
      ctx.globalAlpha = 1;
      // 自機 + 自機のたま
      {
        // JIKI移動
        if (IsCheating) {
          chara.position.x = mouse.x;
          chara.position.y = mouse.y;
        } else {
          var speed = 5;
          if (IsSlow) speed = 5;
          if (Key === 39) {
            chara.position.x += speed;
          }
          if (Key === 37) {
            chara.position.x -= speed;
          }
          if (Key === 38) {
            chara.position.y -= speed;
          }
          if (Key === 40) {
            chara.position.y += speed;
          }
        }
        // JIKI描画
        if (point < -Infinity) {
          outcharacter = 10;
          chara.size = outcharacter / 10 * 4;
          Sabchara = outcharacter / 2;
          Saboutchara = Sabchara / 2;
        }

        if (point > -Infinity) {
          if (BOSS_SABHP >= 3) {
            outcharacter = 10;
            chara.size = outcharacter / 10 * 4;
            Sabchara = outcharacter / 2;
            Saboutchara = Sabchara - 0.5;
          } else if (BOSS_SABHP <= 2) {
            outcharacter = 10;
            chara.size = outcharacter / 10 * 4;
            Sabchara = outcharacter / 3;
            Saboutchara = Sabchara - 0.5;
            var SAB2 = 15;
          }
        };

        //描写中心自機
        ChangeColor();
        ctx.beginPath();
        ctx.arc(chara.position.x, chara.position.y, outcharacter, 0, Math.PI * 2, false);
        ctx.fillStyle = CHARA_COLOR;
        ctx.fill();
        if (IsSlow) {
          ctx.beginPath();
          ctx.arc(chara.position.x, chara.position.y, outcharacter + 1, 0, Math.PI * 2, false);
          ctx.strokeStyle = 'rgba(0,0,0,1)';
          ctx.stroke();
        }

        //中心自機
        ChangeColor();
        ctx.beginPath();
        ctx.arc(chara.position.x, chara.position.y, chara.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(255,0,0,1)';
        ctx.fill();

        if (BOSS_SABHP >= 3) {
          ctx.beginPath();
          ctx.arc(chara.position.x + 30, chara.position.y + 10, Sabchara, 0, Math.PI * 2, false);
          ctx.moveTo(chara.position.x - 30 + Sabchara, chara.position.y + 10);
          ctx.arc(chara.position.x - 30, chara.position.y + 10, Sabchara, 0, Math.PI * 2, false);
          ctx.strokeStyle = 'rgba(0,0,0,1)'; //外周左右自機 
          ctx.stroke();
          ctx.fillStyle = 'rgba(220,20,60,1)';
          ctx.fill(); //左右自機
        }
        if (BOSS_SABHP <= 2) {
          if (!Syuugou && !Kakusan) {
            ctx.beginPath();
            ctx.arc(chara.position.x + SAB2, chara.position.y + SAB2, Sabchara, 0, Math.PI * 2, false);
            ctx.moveTo(chara.position.x + SAB2, chara.position.y - SAB2);
            ctx.arc(chara.position.x + SAB2, chara.position.y - SAB2, Sabchara, 0, Math.PI * 2, false);
            ctx.moveTo(chara.position.x - SAB2, chara.position.y + SAB2);
            ctx.arc(chara.position.x - SAB2, chara.position.y + SAB2, Sabchara, 0, Math.PI * 2, false);
            ctx.moveTo(chara.position.x - SAB2, chara.position.y - SAB2);
            ctx.arc(chara.position.x - SAB2, chara.position.y - SAB2, Sabchara, 0, Math.PI * 2, false);
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.stroke(); //外周上下左右自機  
            ctx.fillStyle = 'rgba(220,20,60,1)';
            ctx.fill(); //上下左右自機
          } else if (!Syuugou && Kakusan) {
            ctx.beginPath();
            ctx.arc(chara.position.x - SAB2, chara.position.y + SAB2, Sabchara, 0, Math.PI * 2, false);
            ctx.moveTo(chara.position.x - SAB2, chara.position.y - SAB2 * 2.5);
            ctx.arc(chara.position.x - SAB2, chara.position.y - SAB2 * 2.5, Sabchara, 0, Math.PI * 2, false);
            ctx.moveTo(chara.position.x - SAB2, chara.position.y + SAB2 * 2.5);
            ctx.arc(chara.position.x - SAB2, chara.position.y + SAB2 * 2.5, Sabchara, 0, Math.PI * 2, false);
            ctx.moveTo(chara.position.x - SAB2, chara.position.y - SAB2);
            ctx.arc(chara.position.x - SAB2, chara.position.y - SAB2, Sabchara, 0, Math.PI * 2, false);
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.stroke(); //外周上下左右自機    
            ctx.fillStyle = 'rgba(220,20,60,1)';
            ctx.fill(); //上下左右自機
          } else if (!Kakusan && Syuugou) {
            ctx.beginPath();
            ctx.arc(chara.position.x + SAB2, chara.position.y + SAB2, Sabchara, 0, Math.PI * 2, false);
            ctx.moveTo(chara.position.x + SAB2, chara.position.y - SAB2 * 2.5);
            ctx.arc(chara.position.x + SAB2, chara.position.y - SAB2 * 2.5, Sabchara, 0, Math.PI * 2, false);
            ctx.moveTo(chara.position.x + SAB2, chara.position.y + SAB2 * 2.5);
            ctx.arc(chara.position.x + SAB2, chara.position.y + SAB2 * 2.5, Sabchara, 0, Math.PI * 2, false);
            ctx.moveTo(chara.position.x + SAB2, chara.position.y - SAB2);
            ctx.arc(chara.position.x + SAB2, chara.position.y - SAB2, Sabchara, 0, Math.PI * 2, false);
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.stroke(); //外周上下左右自機    
            ctx.fillStyle = 'rgba(220,20,60,1)';
            ctx.fill(); //上下左右自機
          }
        }

        // JIKIのチート玉
        if (BOSS_SABHP >= 3) {
          if (fire) {
            if (SHOT_counter % 10 === 0) {
              // すべての自機ショットを調査する
              var Count = 0;
              for (i = 0; i < charaShot.length; i++) {
                if (!charaShot[i].alive) {
                  switch (Count) {
                    case 0:
                      charaShot[i].set(chara.position, 4, 0, 3);
                      break;
                    case 1:
                      if (!Kakusan && !Syuugou) charaShot[i].set({
                        x: chara.position.x - 30,
                        y: chara.position.y + 10
                      }, Sabchara / 2, 0, 3);
                      break;
                    case 2:
                      if (!Kakusan && !Syuugou) charaShot[i].set({
                        x: chara.position.x + 30,
                        y: chara.position.y + 10
                      }, Sabchara / 2, 0, 3);
                      break;
                    case 3:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 3, 3);
                      break;
                    case 4:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -3, 3);
                      break;
                    case 5:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 5, 3);
                      break;
                    case 6:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -5, 3);
                      break;
                    case 7:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 7, 3);
                      break;
                    case 8:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -7, 3);
                      break;
                    case 9:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 9, 2);
                      break;
                    case 10:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -9, 2);
                      break;
                    case 11:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 9, 0);
                      break;
                    case 12:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -9, 0);
                      break;
                    case 13:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 0, -3);
                      break;
                    case 14:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 1, -3);
                      break;
                    case 15:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -1, -3);
                      break;
                    case 16:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 3, -3);
                      break;
                    case 17:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -3, -3);
                      break;
                    case 18:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 5, -3);
                      break;
                    case 19:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -5, -3);
                      break;
                    case 20:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 7, -3);
                      break;
                    case 21:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -7, -3);
                      break;
                    case 22:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 9, -2);
                      break;
                    case 23:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -9, -2);
                      break;
                    case 24:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 1, 3);
                      break;
                    case 25:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -1, 3);
                      break
                    case 26:
                      if (Syuugou && !Kakusan) charaShot[i].set({
                        x: chara.position.x + 30,
                        y: chara.position.y + 10
                      }, Sabchara / 2, 0.5, 4);
                      break;
                    case 27:
                      if (Syuugou && !Kakusan) charaShot[i].set({
                        x: chara.position.x - 30,
                        y: chara.position.y + 10
                      }, Sabchara / 2, -0.5, 4);
                      break;
                    case 28:
                      if (Kakusan && !Syuugou) charaShot[i].set({
                        x: chara.position.x + 30,
                        y: chara.position.y + 10
                      }, Sabchara / 2, -1, 3);
                      break;
                    case 29:
                      if (Kakusan && !Syuugou) charaShot[i].set({
                        x: chara.position.x - 30,
                        y: chara.position.y + 10
                      }, Sabchara / 2, 1, 3);
                    default:
                      break;
                  }
                  Count++;
                  if (Count > 29) break;
                }
              }

            }
            SHOT_counter++;
            // fire = false;
          }
        }
        if (BOSS_SABHP <= 2) {
          if (fire) {
            if (SHOT_counter % 10 === 0) {
              // すべての自機ショットを調査する
              var Count = 0;
              for (i = 0; i < charaShot.length; i++) {
                if (!charaShot[i].alive) {
                  switch (Count) {
                    case 0:
                      if (!Kakusan && !Syuugou) charaShot[i].set({
                        x: chara.position.x + SAB2,
                        y: chara.position.y + SAB2
                      }, outcharacter / 2 - 1, -2, -2);
                      break;
                    case 1:
                      if (!Kakusan && !Syuugou) charaShot[i].set({
                        x: chara.position.x + SAB2,
                        y: chara.position.y - SAB2
                      }, outcharacter / 2 - 1, -2, 2);
                      break;
                    case 2:
                      if (!Kakusan && !Syuugou) charaShot[i].set({
                        x: chara.position.x - SAB2,
                        y: chara.position.y + SAB2
                      }, outcharacter / 2 - 1, 2, -2);
                      break;
                    case 3:
                      if (!Kakusan && !Syuugou) charaShot[i].set({
                        x: chara.position.x - SAB2,
                        y: chara.position.y - SAB2
                      }, outcharacter / 2 - 1, 2, 2);
                      break;
                    case 4:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 3, 3);
                      break;
                    case 5:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -3, 3);
                      break;
                    case 6:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 5, 3);
                      break;
                    case 7:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -5, 3);
                      break;
                    case 8:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 7, 3);
                      break;
                    case 9:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -7, 3);
                      break;
                    case 10:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 9, 2);
                      break;
                    case 11:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -9, 2);
                      break;
                    case 12:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 9, 0);
                      break;
                    case 13:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -9, 0);
                      break;
                    case 14:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 0, -3);
                      break;
                    case 15:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 1, -3);
                      break;
                    case 16:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -1, -3);
                      break;
                    case 17:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 3, -3);
                      break;
                    case 18:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -3, -3);
                      break;
                    case 19:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 5, -3);
                      break;
                    case 20:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -5, -3);
                      break;
                    case 21:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 7, -3);
                      break;
                    case 22:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -7, -3);
                      break;
                    case 23:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 9, -2);
                      break;
                    case 24:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -9, -2);
                      break;
                    case 25:
                      if (Arecheating) charaShot[i].set(chara.position, 3, 1, 3);
                      break;
                    case 26:
                      if (Arecheating) charaShot[i].set(chara.position, 3, -1, 3);
                      break
                    case 27:
                      if (!Kakusan && Syuugou) charaShot[i].set({
                        x: chara.position.x + SAB2,
                        y: chara.position.y + SAB2
                      }, Sabchara, -SAB2 / 7, -SAB2 / 7);
                      break;
                    case 28:
                      if (!Kakusan && Syuugou) charaShot[i].set({
                        x: chara.position.x + SAB2,
                        y: chara.position.y - SAB2 * 2.5
                      }, Sabchara, -SAB2 / (6 * 2), (SAB2 * 2.5) / (6 * 2));
                      break;
                    case 29:
                      if (!Kakusan && Syuugou) charaShot[i].set({
                        x: chara.position.x + SAB2,
                        y: chara.position.y + SAB2 * 2.5
                      }, Sabchara, -SAB2 / (6 * 2), -(SAB2 * 2.5) / (6 * 2));
                      break;
                    case 30:
                      if (!Kakusan && Syuugou) charaShot[i].set({
                        x: chara.position.x + SAB2,
                        y: chara.position.y - SAB2
                      }, Sabchara, -SAB2 / 7, SAB2 / 7);
                      break;
                    case 31:
                      if (!Kakusan && Syuugou) charaShot[i].set({
                        x: chara.position.x,
                        y: chara.position.y
                      }, Sabchara, -3, 0);
                      break;
                    case 32:
                      if (!Syuugou && Kakusan) charaShot[i].set({
                        x: chara.position.x - SAB2,
                        y: chara.position.y - SAB2
                      }, Sabchara, SAB2 / 7, SAB2 / 7);
                      break;
                    case 33:
                      if (!Syuugou && Kakusan) charaShot[i].set({
                        x: chara.position.x - SAB2,
                        y: chara.position.y + SAB2 * 2.5
                      }, Sabchara, SAB2 / (6 * 2), -(SAB2 * 2.5) / (6 * 2));
                      break;
                    case 34:
                      if (!Syuugou && Kakusan) charaShot[i].set({
                        x: chara.position.x - SAB2,
                        y: chara.position.y - SAB2 * 2.5
                      }, Sabchara, -SAB2 / -(6 * 2), (SAB2 * 2.5) / (6 * 2));
                      break;
                    case 35:
                      if (!Syuugou && Kakusan) charaShot[i].set({
                        x: chara.position.x - SAB2,
                        y: chara.position.y + SAB2
                      }, Sabchara, SAB2 / 7, -SAB2 / 7);
                      break;
                    case 36:
                      if (!Syuugou && Kakusan) charaShot[i].set({
                        x: chara.position.x,
                        y: chara.position.y
                      }, Sabchara, 3, 0);
                    default:
                      break;
                  }
                  Count++;
                  if (Count > 36) break;
                }
              }

            }
            SHOT_counter++;
            // fire = false;
          }
        }
        // JIKI Shot
        ctx.fillStyle = CHARA_SHOT_COLOR;
        ctx.beginPath();
        for (i = 0; i < charaShot.length; i++) {
          if (charaShot[i].alive) {
            charaShot[i].move();
            ctx.arc(
              charaShot[i].position.x,
              charaShot[i].position.y,
              charaShot[i].size,
              0, Math.PI * 2, false
            );
            ctx.closePath();
          }
        }
        ctx.fill();
      }
      //雑魚敵
      if (point < -Infinity) {
        //以下エネミーとのあたり判定 
        if (!Wascheating && !invincible) {
          for (j = 0; j < ENEMY_SHOT_MAX_COUNT; j++) {
            if (!enemyShot[j].alive) continue;
            if (Math.pow(chara.position.x - enemyShot[j].position.x, 2) +
              Math.pow(chara.position.y - enemyShot[j].position.y, 2) <=
              Math.pow(enemyShot[j].size + chara.size, 2)) {
              life -= 1;
              invincible = true;
              /*chara.position.x = 675;
              chara.position.y = 500;*/
            }
            setTimeout(function () {
              invincible = false;
            }, 3000);
            enemyShot[j].alive = false;
            point -= 1000;
          }
        } // enemyShot と　chara の当り判定
        for (j = 0; j < ENEMY_MAX_COUNT; j++) {
          if (!enemy[j].alive) continue;
          if (Math.pow(chara.position.x - enemy[j].position.x, 2) +
            Math.pow(chara.position.y - enemy[j].position.y, 2) <=
            Math.pow(enemy[j].size + chara.size, 2)) {
            life -= 1;
            invincible = true;
            /*chara.position.x = 675;
            chara.position.y = 500;*/
            setTimeout(function () {
              invincible = false;
            }, 3000);
            enemy[j].alive = false;
            point -= 1000;
          }
        } // enemy と　chara の当り判定

        for (i = 0; i < ENEMY_MAX_COUNT; i++) {
          if (!enemy[i].alive) continue;
          for (j = 0; j < CHARA_SHOT_MAX_COUNT; j++) {
            if (!charaShot[j].alive) continue;
            if (Math.pow(enemy[i].position.x - charaShot[j].position.x, 2) +
              Math.pow(enemy[i].position.y - charaShot[j].position.y, 2) <=
              Math.pow(charaShot[j].size + enemy[i].size, 2)) {
              enemy[i].alive = false;
              charaShot[j].alive = false;
              point += 50;
            }
          }
        } //以上 

        counter++;
        if (counter % 40 === 0) {
          // すべてのエネミーを調査する
          for (i = 0; i < ENEMY_MAX_COUNT; i++) {
            // エネミーの生存フラグをチェック
            if (!enemy[i].alive) {
              j = (counter % 80) / 40; // タイプを決定するパラメータを算出
              var enemySize = 15;
              // タイプに応じて初期位置を決める
              p.x = -enemySize + (screenCanvas.width + enemySize * 4) * j
              p.y = screenCanvas.height / 4;
              if (j == 1) p.y = 100;
              enemy[i].set(p, enemySize, j << 0); // エネミーを新規にセット
              break; // 1体出現させたのでループを抜ける
            }
          }
        } // enemy を新しく追加

        {
          ctx.fillStyle = ENEMY_COLOR;
          ctx.beginPath();
          for (i = 0; i < ENEMY_MAX_COUNT; i++) {
            // エネミーの生存フラグをチェック
            if (enemy[i].alive) {
              // エネミーを動かす
              enemy[i].move();
              // エネミーを描くパスを設定
              ctx.arc(
                enemy[i].position.x,
                enemy[i].position.y,
                enemy[i].size,
                0, Math.PI * 2, false
              );
              enemy[i].param++;
              // ショットを打つかどうかパラメータの値からチェック
              if (enemy[i].param % 100 === 0) {
                // エネミーショットを調査する
                for (j = 0; j < ENEMY_SHOT_MAX_COUNT; j++) {
                  if (!enemyShot[j].alive) {
                    if (enemy[i].type == 0) {
                      // エネミーショットを新規にセットする
                      p = enemy[i].position.distance(chara.position);
                      p.normalize();
                      enemyShot[j].set(enemy[i].position, p, 5, 3);
                    } else {
                      enemyShot[j].set(enemy[i].position, {
                        x: 0,
                        y: 1.5
                      }, 5, 3);
                    }
                    break;　 // 1個出現させたのでループを抜ける
                  }
                }
              }
              // パスをいったん閉じる
              ctx.closePath();
            }
          }
          ctx.fill();
        } // 敵の移動,球の発射,敵の表示

        {
          ctx.fillStyle = ENEMY_SHOT_COLOR;
          ctx.beginPath();
          for (i = 0; i < ENEMY_MAX_COUNT; i++) {
            if (!enemyShot[i].alive) continue;
            enemyShot[i].move();
            ctx.arc(
              enemyShot[i].position.x,
              enemyShot[i].position.y,
              enemyShot[i].size,
              0, Math.PI * 2, false
            );
            ctx.closePath();
          }
          ctx.fill();
        } // 敵のたまの移動、表示

      } else if (point > -Infinity) {
        if (!Wascheating && !invincible) {
          for (j = 0; j < BOSS_SHOT_MAX_COUNT; j++) {
            if (!bossShot[j].alive) continue;
            if (Math.pow(chara.position.x - bossShot[j].position.x, 2) +
              Math.pow(chara.position.y - bossShot[j].position.y, 2) <=
              Math.pow(bossShot[j].size + chara.size, 2)) {
              life -= 1;
              invincible = true;
              /*chara.position.x = 675;
              chara.position.y = 500;*/
              setTimeout(function () {
                invincible = false;
              }, 3000);
              bossShot[j].alive = false;
              point -= 1000;
            }
          }
          for (j = 0; j < BOSS_MAX_COUNT; j++) {
            if (!boss[j].alive) continue;
            if (Math.pow(chara.position.x - boss[j].position.x, 2) +
              Math.pow(chara.position.y - boss[j].position.y, 2) <=
              Math.pow(boss[j].size + chara.size, 2)) {
              life -= 1;
              invincible = true;
              /* chara.position.x = 675;
               chara.position.y = 500;*/
              setTimeout(function () {
                invincible = false;
              }, 3000);
              BOSS_HP -= 10;
              point += 1000;
            }
          }
        }
        for (i = 0; i < BOSS_MAX_COUNT; i++) {
          if (!boss[i].alive) continue;
          for (j = 0; j < CHARA_SHOT_MAX_COUNT; j++) {
            if (!charaShot[j].alive) continue;
            if (Math.pow(boss[i].position.x - charaShot[j].position.x, 2) +
              Math.pow(boss[i].position.y - charaShot[j].position.y, 2) <=
              Math.pow(charaShot[j].size + boss[i].size, 2)) {
              BOSS_HP -= 1;
              charaShot[j].alive = false;
            }
          }
        }
        counter++;
        if (BOSS_SABHP >= 3) {
          if (counter % 10 === 0) {
            for (i = 0; i < BOSS_MAX_COUNT; i++) {
              if (!boss[i].alive) {
                j = (counter % 30) / 10;
                var bossSize = 20;
                p.x = (screenCanvas.width - bossSize) / 2;
                p.y = screenCanvas.height / 4;
                if (j == 0 && boss.some((v) => v.type == 0 && v.alive)) break;
                if ((j == 1 || j == 2) && ((counter % 60 != 0) || Math.random() > 1)) break;
                boss[i].set(p, bossSize, j << 0);
                break;
              }
            }
          }
        }
        if (BOSS_SABHP <= 2) {
          if (counter % 10 === 0) {
            // すべてのエネミーを調査する
            for (i = 0; i < BOSS_MAX_COUNT; i++) {
              // エネミーの生存フラグをチェック
              if (!boss[i].alive) {
                j = (counter % 30) / 10; // タイプを決定するパラメータを算出
                var bossSize = 20;
                // p.x = (screenCanvas.width - bossSize) / 2;
                // p.y = (screenCanvas.height - bossSize) / 2;
                if (j == 0 && boss.some((v) => v.type == 0 && v.alive)) break;
                if ((j == 1 || j == 2) && ((counter % 60 != 0) || Math.random() > 1)) break;
                boss[i].set(p, bossSize, j << 0); // エネミーを新規にセット
                break; // 1体出現させたのでループを抜ける
              }
            }
          }
        }
        // BOSSの挙動----------------------------------------------
        if (BOSS_SABHP == 4) {
          ctx.fillStyle = BOSS_COLOR;
          ctx.beginPath();
          for (i = 0; i < BOSS_MAX_COUNT; i++) {
            // エネミーの生存フラグをチェック
            if (boss[i].alive) {
              // エネミーを動かす
              /* boss[i].move();*/
              // エネミーを描くパスを設定
              ctx.arc(
                boss[i].position.x,
                boss[i].position.y,
                boss[i].size,
                0, Math.PI * 2, false
              );
              /*boss[i].param++;*/
              // ショットを打つかどうかパラメータの値からチェック                               
              if ( /*SHOT_*/ bosscounter % 30 == 0) {
                a = boss[i].position.distance(chara.position);
                a.normalize();
                let Vectors = [{
                  x: 1.5, //右
                  y: 0,
                  size: 5,
                  speed: 2.5
                }, {
                  x: -1.5, //左
                  y: 0
                }, {
                  x: -0.8, //下左下
                  y: 1.3
                }, {
                  x: 0.8,
                  　　 //下右下
                  y: 1.3
                }, {
                  x: 0,
                  　　　 //上
                  y: -1.5
                }, {
                  x: 1.3,
                  　 //上右下
                  y: 0.8
                }, {
                  x: 1.08,
                  　 //右上
                  y: -1.08
                }, {
                  x: -1.3,
                  　 //上左下
                  y: 0.8
                }, {
                  x: -1.08,
                  　 //左上
                  y: -1.08
                }, {
                  x: a.x,
                  y: a.y,
                  size: 5,
                  speed: 1.25
                }];

                let vectorCounter = 0;
                // エネミーショットを調査する
                for (j = 0; j < BOSS_SHOT_MAX_COUNT; j++) {
                  if (!bossShot[j].alive) {
                    if (boss[i].type == 0) {
                      // エネミーショットを新規にセットする

                      bossShot[j].set(boss[i].position, Vectors[vectorCounter], Vectors[vectorCounter].size || 5, Vectors[vectorCounter].speed || 3);
                      vectorCounter++;
                      if (vectorCounter >= Vectors.length) break;
                    }
                  }　 // 1個出現させたのでループを抜ける
                }
              }
              /*SHOT_*/
              bosscounter++;
              // パスをいったん閉じる
              ctx.closePath();
            }
            ctx.fill();
            // Boss の移動,球の発射,敵の表示
          }

          ctx.fillStyle = BOSS_SHOT_COLOR;
          ctx.beginPath();
          for (i = 0; i < BOSS_SHOT_MAX_COUNT; i++) {
            if (bossShot[i].alive) // continue;
            {
              bossShot[i].move();
              //console.log("bossShot 描画");
              ctx.arc(
                bossShot[i].position.x,
                bossShot[i].position.y,
                bossShot[i].size,
                0, Math.PI * 2, false
              );
              ctx.closePath();
            }
          }
          ctx.fill();
        }; //Boss4

        if (BOSS_SABHP == 3) {
          ctx.fillStyle = BOSS_COLOR;
          ctx.beginPath();
          for (i = 0; i < BOSS_MAX_COUNT; i++) {
            if (boss[i].alive) {
              /*boss[i].move();*/
              ctx.arc(
                boss[i].position.x,
                boss[i].position.y,
                boss[i].size,
                0, Math.PI * 2, false
              );
              /*boss[i].param++;*/
              if (bosscounter % 30 == 0) {
                a = boss[i].position.distance(chara.position);
                a.normalize();
                let Vectors = [{
                  x: a.x,
                  y: a.y,
                  size: 5,
                  speed: 1.25
                }];

                let vectorCounter = 0;
                for (j = 0; j < BOSS_SHOT_MAX_COUNT; j++) {
                  if (!bossShot[j].alive) {
                    if (boss[i].type == 0) {
                      bossShot[j].set(boss[i].position, Vectors[vectorCounter], Vectors[vectorCounter].size || 5, Vectors[vectorCounter].speed || 3);
                      vectorCounter++;
                      if (vectorCounter >= Vectors.length) break;
                    }
                  }　
                }
              }
              bosscounter++;
              ctx.closePath();
            }
            ctx.fill();
          }

          ctx.fillStyle = BOSS_SHOT_COLOR;
          ctx.beginPath();
          for (i = 0; i < BOSS_SHOT_MAX_COUNT; i++) {
            if (bossShot[i].alive) {
              bossShot[i].move();
              ctx.arc(
                bossShot[i].position.x,
                bossShot[i].position.y,
                bossShot[i].size,
                0, Math.PI * 2, false
              );
              ctx.closePath();
            }
          }
          ctx.fill();

          bossSABcounter++;
          if (bossSABcounter % 50 === 0) {
            for (i = 0; i < BOSSSAB_MAX_COUNT; i++) {
              if (!bossSAB[i].alive) {
                j = (bossSABcounter % 80) / 40;
                var bossSABSize = 20;
                p.x = screenCanvas.width / 2,
                  p.y = screenCanvas.height / 4,
                  bossSAB[i].set(p, bossSABSize, j << 0);
                break;
              }
            }
          } {
            ctx.fillStyle = BOSSSAB_COLOR;
            ctx.beginPath();
            for (i = 0; i < BOSSSAB_MAX_COUNT; i++) {
              if (bossSAB[i].alive) {
                bossSAB[i].move();
                ctx.arc(
                  bossSAB[i].position.x,
                  bossSAB[i].position.y,
                  bossSAB[i].size,
                  0, Math.PI * 2, false
                );
                ctx.closePath();
              }
            }
            ctx.fill();
          }
        }; //Boss3


        if (BOSS_SABHP == 2) {
          ctx.fillStyle = BOSS_COLOR;
          ctx.beginPath();
          for (i = 0; i < BOSS_MAX_COUNT; i++) {
            // エネミーの生存フラグをチェック
            if (boss[i].alive) {
              boss[i].move();
              ctx.arc(
                boss[i].position.x,
                boss[i].position.y,
                boss[i].size,
                0, Math.PI * 2, false
              );
              /*boss[i].param++;*/
              // ショットを打つかどうかパラメータの値からチェック                               
              if ( /*SHOT_*/ bosscounter % 30 == 0) {
                a = boss[i].position.distance(chara.position);
                a.normalize();
                let Vectors = [{
                  x: a.x,
                  y: a.y,
                  size: 5,
                  speed: 1.25
                }];

                let vectorCounter = 0;
                // エネミーショットを調査する
                for (j = 0; j < BOSS_SHOT_MAX_COUNT; j++) {
                  if (!bossShot[j].alive) {
                    if (boss[i].type == 0) {
                      // エネミーショットを新規にセットする
                      bossShot[j].set(boss[i].position, Vectors[vectorCounter], Vectors[vectorCounter].size || 5, Vectors[vectorCounter].speed || 3);
                      vectorCounter++;
                      if (vectorCounter >= Vectors.length) break;
                    }
                  }　 // 1個出現させたのでループを抜ける
                }
              }
              bosscounter++;
              // パスをいったん閉じる
              ctx.closePath();
            }
            ctx.fill();
            // Boss の移動,球の発射,敵の表示
          }

          ctx.fillStyle = BOSS_SHOT_COLOR;
          ctx.beginPath();
          for (i = 0; i < BOSS_SHOT_MAX_COUNT; i++) {
            if (bossShot[i].alive) // continue;
            {
              bossShot[i].move();
              ctx.arc(
                bossShot[i].position.x,
                bossShot[i].position.y,
                bossShot[i].size,
                0, Math.PI * 2, false
              );
              ctx.closePath();
            }
          }
          ctx.fill();
        }; //Boss2

        if (BOSS_SABHP == 1) {
          ctx.fillStyle = BOSS_COLOR;
          ctx.beginPath();
          for (i = 0; i < BOSS_MAX_COUNT; i++) {
            // エネミーの生存フラグをチェック
            if (boss[i].alive) {
              // エネミーを動かす
              /* boss[i].move();*/
              // エネミーを描くパスを設定
              ctx.arc(
                boss[i].position.x,
                boss[i].position.y,
                boss[i].size,
                0, Math.PI * 2, false
              );
              /*boss[i].param++;*/
              // ショットを打つかどうかパラメータの値からチェック                               
              if ( /*SHOT_*/ bosscounter % 30 == 0) {
                a = boss[i].position.distance(chara.position);
                a.normalize();
                let Vectors = [{
                  x: a.x,
                  y: a.y,
                  size: 5,
                  speed: 1.25
                }];

                let vectorCounter = 0;
                // エネミーショットを調査する
                for (j = 0; j < BOSS_SHOT_MAX_COUNT; j++) {
                  if (!bossShot[j].alive) {
                    if (boss[i].type == 0) {
                      // エネミーショットを新規にセットする

                      bossShot[j].set(boss[i].position, Vectors[vectorCounter], Vectors[vectorCounter].size || 5, Vectors[vectorCounter].speed || 3);
                      vectorCounter++;
                      if (vectorCounter >= Vectors.length) break;
                    }
                  }　 // 1個出現させたのでループを抜ける
                }
              }
              bosscounter++;
              // パスをいったん閉じる
              ctx.closePath();
            }
            ctx.fill();
            // Boss の移動,球の発射,敵の表示
          }

          ctx.fillStyle = BOSS_SHOT_COLOR;
          ctx.beginPath();
          for (i = 0; i < BOSS_SHOT_MAX_COUNT; i++) {
            if (bossShot[i].alive) // continue;
            {
              bossShot[i].move();
              ctx.arc(
                bossShot[i].position.x,
                bossShot[i].position.y,
                bossShot[i].size,
                0, Math.PI * 2, false
              );
              ctx.closePath();
            }
          }
          ctx.fill();
        }; //Boss1

      }
    }
    info.innerText = "Score : " + point + " || " + "Life : " + life + "\\" + BOSS_SABHP;
    info_2.innerText = "Boss : " + BOSS_COUNTER + " || " + "BOSS_HP : " + BOSS_HP;
    if (BOSS_SABHP == 4) {
      if (BOSS_HP <= 150) {
        BOSS_SABHP = 3;
        point += 100
      }
    }
    if (BOSS_SABHP == 3) {
      if (BOSS_HP <= 0) {
        BOSS_SABHP = 2;
        point += 150;
        BOSS_MAX_COUNT = 1;
        BOSS_HP = 450;
        BOSS_COUNTER = "式神";
        boss[0].alive = false;
        ChangeColor();
      }
    }
    if (BOSS_SABHP == 2) {
      if (BOSS_HP <= 250) {
        BOSS_SABHP = 1;
        point += 200
      }
    }
    if (BOSS_SABHP == 1) {
      if (BOSS_HP <= 0) {
        BOSS_SABHP = 0;
        point += 250;
        BOSS_MAX_COUNT = 0;
        BOSS_HP = 0;
      }
    }
    if (life < 0) ShowGameover("Score || " + point);
    else requestAnimationFrame(arguments.callee);
    if (BOSS_MAX_COUNT <= 0) ShowClear("GAME CLEAR\nScore||" + point);


  })();
};









// - event --------------------------------------------------------------------
function mouseMove(event) {
  mouse.x = event.clientX - screenCanvas.offsetLeft;
  mouse.y = event.clientY - screenCanvas.offsetTop;
}

function mouseDown(event) {
  fire = true;
  SHOT_counter = 0;
}

function mouseUp(event) {
  fire = false;
}

function keyDown(event) {
  var ck = event.keyCode;
  console.log(ck);
  // 通常
  if (ck === 27) {
    run = false;
    return;
  }
  if (ck === 32) {
    if (!fire)
      mouseDown();
    return;
  }
  if (ck === 101) {
    if (!fire)
      mouseDown();
    return;
  }
  Key = ck;
  // チート
  if (event.altKey && event.ctrlKey) {
    IsCheating = true;
  }
  if (ck === 83)
    IsSlow = true;

  if (event.shiftKey && event.ctrlKey) {
    Arecheating = true;
  }
  if (event.ctrlKey && ck === 90) {
    Wascheating = true;
  }
  if (ck === 71) {
    Syuugou = true;
  }
  if (ck === 82) {
    Kakusan = true;
  }
}

function keyUp(event) {
  var ck = event.keyCode;
  if (ck === 32) {
    mouseUp();
    return;
  }
  if (ck === 101) {
    mouseUp();
    return;
  }
  if (ck === 83) {
    IsSlow = false;
    return;
  }
  if (ck === 71) {
    Syuugou = false;
    return;
  }
  if (ck === 82) {
    Kakusan = false;
    return;
  }
  Key = 0;
  // チート
  if ((ck === 17) && (18)) {
    IsCheating = false;
  }
  if (ck === 16 && 17) {
    Arecheating = false;
  }
  if (event.ctrlKey && ck === 90) {
    Wascheating = false;
  }
}

function ChangeColor() {
  if (invincible) {
    CHARA_COLOR = 'rgba(50, 255, 50, 0.5)';
  } else if (Wascheating) {
    CHARA_COLOR = 'rgba(50, 255, 50, 0.5)';
  } else CHARA_COLOR = 'rgba(0,0,0,1)';
  if (BOSS_SABHP <= 2) {
    BOSS_COLOR = 'rgba(255,255,0,1)', BOSS_SHOT_COLOR = 'rgba(35, 71, 130,0.8)';
  }
  if (IsSlow) {
    CHARA_COLOR = 'rgba(50,50,50, 0.5)';
  }
}

function ShowGameover(text) {
  document.getElementById("gameover-wrap").classList.remove("hide");
  document.getElementById("gameover-wrap").classList.add("shown");
  document.getElementById("gameover-text").innerText = text;
}

function ShowClear(text) {
  document.getElementById("Clear-wrap").classList.remove("hide");
  document.getElementById("Clear-wrap").classList.add("shown2");
  document.getElementById("Clear-text").innerText = text;
};