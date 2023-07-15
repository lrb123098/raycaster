import { Level } from "./level";
import { RayCaster } from "./raycaster";
import Camera from "./camera";
import Player from "./player";

const myLevelString = `
-######----------------------------------------------------------------######-
#                                                         #
|                                                         |
#                                                         #
|                                                         |
#                                                         #
|                                                         |
#                                                         #
|                                                         |
|                                                         |
|                 -----  --------------  -----                    |
|                                                         |
|                                                         |
|                 #                    #                    |
|                 |                    |                    |
|                 #         p          #                    |
|                 |                    |                    |
|                 #                    #                    |
|                                                         |
|                     -----------------                        |
|                                                         |
|                                                         |
#                                                         #
#                                                         #
#                                                         #
#                                                         #
#                                                         #
#                                                         #
-#-#-#-#--------------------------------------------------------------#-#-#-#-
`;

const myPlayer = new Player();
const myRayCaster = new RayCaster(myPlayer, new Camera([700, 450]), new Level(myLevelString));
//MyRayCaster.Render();

(function Render() {
  myPlayer.viewDirection += Player.rotateSpeed / 10;
  myRayCaster.render();
  window.requestAnimationFrame(Render);
})();