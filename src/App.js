import kaboom from "kaboom";
import * as React from "react";

const jump = () => {};
const Game = () => {
  const canvasRef = React.useRef(null);
  // just make sure this is only run once on mount so your game state is not messed up
  React.useEffect(() => {
    const k = kaboom({
      background: [134, 135, 247],
      width: 1080,
      height: 500,
      scale: 2,
      font: "apl386",
    });
    const music = k.play("gameSound");
    k.loadRoot("./sprites/");
    k.loadSprite("block", "block.png");
    k.loadSprite("trap_block", "block.png");
    k.loadSprite("mario", "mario.png");
    k.loadSprite("coin", "coin.png");
    k.loadSprite("mario2", "mario2.png");
    k.loadSprite("surprise", "surprise.png");
    k.loadSprite("unboxed", "unboxed.png");
    k.loadSprite("mushroom", "mushroom.png");
    k.loadSprite("pipe_up", "pipe_up.png");
    k.loadSprite("evil_mushroom", "evil_mushroom.png");
    k.loadSprite("block_blue", "block_blue.png");
    k.loadSprite("princes", "princes.png");
    k.loadSound("jumpSound", "jumpSound.mp3");
    k.loadSound("gameSound", "gameSound.mp3");

    let frms = 0;
    let frms2 = 0;
    let mvs = 0;
    const MOVE_SPEED = 300;
    // const FALL_DEATH = 2400;

    const dict1 = {
      coins: 0,
      surprise: 0,
    };

    k.scene(
      "game",
      ({ levelId, coins } = { levelId: 0, coins: dict1["coins"] }) => {
        k.gravity(3200);
        // let music = k.play("gameSound");
        const map = [
          "                                                    ",
          "                                                    ",
          "                                                    ",
          "                                                    ",
          "                   ?  ?=                 u          ",
          "                                  ===?   p          ",
          "  @      ? =                            ====        ",
          "                      x                        x    ",
          "                   ======    x                 =====",
          "                 x           e=                     ",
          "=====     x   ====           t     =========        ",
          "        ====                                        ",
          "                                                    ",
          "                                                    ",
          "                                                    ",
          "                                                    ",
          "                                                    ",
        ];
        const mapkeys = {
          width: 20,
          height: 20,
          "=": () => [k.sprite("block"), k.area(), k.solid(), "wall"],
          x: () => [k.sprite("coin"), k.body(), k.area(), "coin"],
          "?": () => [k.sprite("surprise"), k.area(), k.solid(), "surprise"],
          "!": () => [k.sprite("unboxed"), k.area(), k.solid(), "unboxed"],
          m: () => [k.sprite("mushroom"), k.area(), k.solid(), "mushroom"],
          p: () => [k.sprite("pipe_up"), k.area(), k.solid(), "pipe_up"],
          u: () => [k.sprite("pipe_up"), k.area(), k.solid(), "pip_up_top"],
          e: () => [k.sprite("evil_mushroom"), k.area(), "evil_mushroom"],
          t: () => [k.sprite("trap_block"), k.area(), k.solid(), "trap_block"],
        };
        const gameLevel = k.addLevel(map, mapkeys);

        const mario = k.add([
          k.sprite("mario"), // renders as ak.sprite
          k.pos(50, 80), //k.position in world
          k.area(), // has a collider
          k.body(), // responds to physics and gravity
          k.origin("bot"),
        ]);

        k.onKeyPress(["space", "up", "w"], () => {
          if (mario.isGrounded()) {
            mario.jump();
            k.play("jumpSound");
          }
        });

        k.onKeyDown(["left", "a"], () => {
          mario.flipX(-1);
          mario.move(-MOVE_SPEED, 0);
        });

        k.onKeyDown(["right", "d"], () => {
          mario.flipX();
          mario.move(MOVE_SPEED, 0);
        });

        k.onKeyRelease(["down", "s"], () => {
          mario.weight = 1;
        });

        k.onKeyPress("f", () => {
          k.fullscreen(!k.fullscreen());
        });

        k.action(() => {
          // k.add([k.pos(mario.pos.x, 60), k.text(dict1["coins"])]);
          if (mario.pos.y > 400) {
            k.go("lose");
          }
        });

        mario.onUpdate(() => {
          k.drawText({
            text: dict1["coins"],
            size: 48,
            font: "sink",
            width: 120,
            pos: k.vec2(mario.pos.x + 100 / 10, 10),
            color: k.rgb(0, 0, 255),
          });
          k.camPos(k.vec2(mario.pos.x + 450, mario.pos.y));
        });

        mario.onHeadbutt((obj) => {
          if (obj.is("surprise")) {
            gameLevel.spawn("x", obj.gridPos.sub(0, 0));
            k.destroy(obj);
            gameLevel.spawn("!", obj.gridPos.sub(0, 1));
          }
        });

        mario.onCollide("coin", (coin) => {
          dict1["coins"] += 1;
          k.destroy(coin);
          console.log("mario collides with  coin");
        });

        mario.onCollide("pip_up_top", (pip_up_top) => {
          k.onKeyDown(["down", "s"], () => {
            k.go("level2");
          });
        });

        mario.onCollide("evil_mushroom", (evil_mushroom) => {
          k.shake(60);
          k.destroyAll("trap_block");
        });
      }
    );

    k.scene("lose", () => {
      // music.pause();
      k.add([k.pos(160, 160), k.text(`You Lose!\n score: ${dict1["coins"]}`)]);
      k.onKeyPress(() => k.go("game"));
      dict1["coins"] = 0;
    });

    k.scene("win", () => {
      // music.pause();
      k.add([k.pos(160, 160), k.text(`You Win!\n score: ${dict1["coins"]}`)]);
      k.onKeyPress(() => k.go("game"));
    });

    k.scene(
      "level2",
      ({ levelId, coins } = { levelId: 0, coins: dict1["coins"] }) => {
        k.gravity(3200);
        // k.play("gameSound");
        const map = [
          "                                                    ",
          "                                                    ",
          "                                                    ",
          "                      ###         ###               ",
          "                                                    ",
          "                                                    ",
          "                                                    ",
          "                                                    ",
          "   o      o           oo          oo                ",
          "  oo      oo         ooo          ooo               ",
          " ooo      ooo       oooo          oooo              ",
          "oooo      oooo     ooooo   e  l   ooooo        r    ",
          "====tttttt==========================================",
          "                                                    ",
          "                                                    ",
          "                                                    ",
          "                                                    ",
        ];
        const mapkeys = {
          width: 20,
          height: 20,
          "=": () => [k.sprite("block"), k.area(), k.solid(), "wall"],
          x: () => [k.sprite("coin"), k.body(), k.area(), "coin"],
          "?": () => [k.sprite("surprise"), k.area(), k.solid(), "surprise"],
          "!": () => [k.sprite("unboxed"), k.area(), k.solid(), "unboxed"],
          m: () => [k.sprite("mushroom"), k.area(), k.solid(), "mushroom"],
          e: () => [k.sprite("evil_mushroom"), k.area(), "evil_mushroom"],
          l: () => [k.sprite("evil_mushroom"), k.area(), "evil_mushroom2"],
          t: () => [k.sprite("trap_block"), k.area(), k.solid(), "trap_block"],
          o: () => [k.sprite("block_blue"), k.area(), k.solid(), "block_blue"],
          r: () => [k.sprite("princes"), k.area(), k.solid(), "princes"],
          "#": () => [k.sprite("mario2"), k.area(), k.solid(), "mario2"],
        };
        const gameLevel = k.addLevel(map, mapkeys);
        const mario = k.add([
          k.sprite("mario"), // renders as ak.sprite
          k.pos(50, 80), //k.position in world
          k.area(), // has a collider
          k.body(), // responds to physics and gravity
          origin("bot"),
        ]);

        const pip_up_top = k.add([
          k.sprite("pipe_up"), // renders as ak.sprite
          k.pos(480.0392999999998, 120), //k.position in world
          k.area(), // has a collider
          k.body(), // responds to physics and gravity
          origin("bot"),
        ]);

        const pip_up_top2 = k.add([
          k.sprite("pipe_up"), // renders as ak.sprite
          k.pos(699, 120), //k.position in world
          k.area(), // has a collider
          k.body(), // responds to physics and gravity
          origin("bot"),
        ]);

        k.onUpdate("evil_mushroom", (evil_mushroom) => {
          frms += 1;
          if (frms === 20) {
            if (
              evil_mushroom.pos.x - 20 > 480.0392999999998 &&
              evil_mushroom.pos.x + 20 < 695.101300000001
            ) {
              if (Math.floor(Math.random() * 2) === 1) {
                evil_mushroom.pos.x += 20;
              } else {
                evil_mushroom.pos.x -= 20;
              }
            } else {
              if (evil_mushroom.pos.x - 20 > 480.0392999999998) {
                evil_mushroom.pos.x -= 20;
              } else {
                evil_mushroom.pos.x += 20;
              }
            }
            frms = 0;
          }
        });

        k.onUpdate("evil_mushroom2", (evil_mushroom2) => {
          frms2 += 1;
          if (frms2 === 20) {
            if (
              evil_mushroom2.pos.x - 20 > 480.0392999999998 &&
              evil_mushroom2.pos.x + 20 < 695.101300000001
            ) {
              if (Math.floor(Math.random() * 2) === 1) {
                evil_mushroom2.pos.x += 20;
              } else {
                evil_mushroom2.pos.x -= 20;
              }
            } else {
              if (evil_mushroom2.pos.x - 20 > 480.0392999999998) {
                evil_mushroom2.pos.x -= 20;
              } else {
                evil_mushroom2.pos.x += 20;
              }
            }
            frms2 = 0;
          }
        });

        k.onKeyPress(["space", "up", "w"], () => {
          if (mario.isGrounded()) {
            mario.jump();
            k.play("jumpSound");
          }
        });

        k.onKeyDown(["left", "a"], () => {
          mario.flipX(-1);
          mario.move(-MOVE_SPEED, 0);
        });

        k.onKeyDown(["right", "d"], () => {
          // mario.flipX(1);
          mario.flipX();
          mario.move(MOVE_SPEED, 0);
        });

        k.onKeyRelease(["down", "s"], () => {
          mario.weight = 1;
        });

        k.onKeyPress("f", () => {
          k.fullscreen(!k.fullscreen());
        });

        k.action(() => {
          if (mario.pos.y > 400) {
            k.go("lose");
          }
        });

        mario.onUpdate(() => {
          k.camPos(k.vec2(mario.pos.x + 450, mario.pos.y));
        });

        mario.onHeadbutt((obj) => {
          if (obj.is("surprise")) {
            gameLevel.spawn("x", obj.gridPos.sub(0, 0));
            k.destroy(obj);
            gameLevel.spawn("!", obj.gridPos.sub(0, 1));
          }
        });

        mario.onCollide("coin", (coin) => {
          dict1["coins"] += 1;
          k.destroy(coin);
          console.log("mario collides with  coin");
        });

        mario.onCollide("princes", () => {
          k.go("win");
        });

        mario.onCollide("evil_mushroom", () => {
          k.shake(60);
          // destroyAll("trap_block");
          k.go("lose");
        });

        mario.onCollide("mario2", () => {
          k.onKeyDown(["down", "s"], () => {
            if (mvs % 2 === 0) {
              mario.pos.x = pip_up_top2.pos.x;
            } else {
              mario.pos.x = pip_up_top.pos.x;
            }
            mvs++;
          });
        });

        mario.onCollide("trap_block", () => {
          mario.pos.x = 50;
          mario.pos.y = 80;
          k.shake(60);
          k.destroyAll("trap_block");
        });
      }
    );

    k.go("game");

    // write all your kaboom code here
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};
export default Game;
