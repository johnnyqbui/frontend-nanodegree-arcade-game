/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 606;
    canvas.height = 606;
    ctx.translate(0, 20);
    doc.body.appendChild(canvas);
    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */

     // Counter for changing background color
    var counter = 0;

    // Function to Change background color
    function getRandomBgColor() {
        var colors = ['#00016B', '#9E8B00', '#871000', '#350006'];
        var getColor = Math.floor(Math.random() * 4);
        return colors[getColor];
    }

    // Used in conjunction with change background color
    function activate() {
        document.body.style.backgroundColor = getRandomBgColor();
    }

    // Set interval to change color
    function changeBgColor() {
        setInterval(function() {
            activate();
        }, 50);
    }

    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);

    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        player.collision();
        allObstacles.forEach(function(obstacle) {
            obstacle.collision();
        });
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        ctx.clearRect(0, -20, canvas.width, canvas.height);
        var colImages = [
                'images/grass-block.png', // Left Col is grass
                'images/grass-block.png', // Col 2 of 6 of grass
                'images/stone-block.png', // Col 3 of 6 of stone
                'images/stone-block.png', // Col 4 of 6 of stone
                'images/stone-block.png', // Col 5 of 6 of stone
                'images/water-block.png' // Col 6 of 6 of water
            ],
            numRows = 6,
            numCols = 6,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(colImages[col]), col * 101, row * 83);
            }
        }
        renderEntities();

        // Create random colors
        function getRandomColor() {
            var colors = ['#14EA2A', '#051BF9', '#BB39AE', '#FF6F00', '#CC000A', '#FFFA00'];
            var getColor = Math.floor(Math.random() * 6);
            return colors[getColor];
        }

        // Text change when level increases
        ctx.fillText("Level: " + player.level, 10, 35);
        ctx.font = "25px Comic Sans MS";
        if (player.level < 5) {
            ctx.fillText("Difficulty: EASY", 10, 10);
            ctx.font = "20px Comic Sans MS";
            ctx.fillStyle = "#35D32B";
        } else if (player.level < 10) {
            ctx.fillText("Difficulty: MEDIUM", 10, 10);
            ctx.font = "20px Comic Sans MS";
            ctx.fillStyle = '#3B68C3';
        } else if (player.level < 15) {
            ctx.fillText("Difficulty: HARD", 10, 10);
            ctx.font = "20px Comic Sans MS";
            ctx.fillStyle = '#BB39AE';
        } else if (player.level < 20) {
            ctx.fillText("Difficulty: VERY HARD", 10, 10);
            ctx.font = "20px Comic Sans MS";
            ctx.fillStyle = '#EC6F12';
        } else if (player.level < 25) {
            ctx.fillText("Difficulty: CHAOS", 10, 10);
            ctx.font = "20px Comic Sans MS";
            ctx.fillStyle = '#CC000A';
        } else if (player.level < 30) {
            ctx.fillText("Difficulty: BLACK FRIDAY SHOPPERS!", 10, 10);
            ctx.font = "20px Comic Sans MS";
            // Random colors for text
            ctx.fillStyle = getRandomColor(1);
        } else if (player.level < 35) {
            ctx.fillText("YOU WIN!", 10, 10);
            ctx.font = "20px Comic Sans MS";
            ctx.fillStyle = '#FF000A';
        } else if (player.level === 35) {
            ctx.fillText("YOU CAN STOP NOW! OK? YOU WON!", 10, 10);
            ctx.font = "20px Comic Sans MS";
        } else if (player.level === 36) {
            ctx.fillText("STOP NOW!", 10, 10);
            ctx.font = "20px Comic Sans MS";
        } else if (player.level === 37) {
            ctx.fillText("DON'T YOU DARE GO ANY FURTHER!", 10, 10);
            ctx.font = "20px Comic Sans MS";
        } else if (player.level === 38) {
            ctx.fillText("LAST CHANCE! I'M WARNING YOU!", 10, 10);
            ctx.font = "20px Comic Sans MS";
        } else if (player.level === 39) {
            ctx.fillText("YOU WILL FEEL MY WRATH!", 10, 10);
            ctx.font = "20px Comic Sans MS";
        } else {
            ctx.font = "33px Comic Sans MS";
            ctx.fillText("YOU SHALL NOT PASS! HAHAHAHA!", 10, 10);
            ctx.font = "20px Comic Sans MS";
            // Random colors for text
            ctx.fillStyle = getRandomColor();
            counter += 1;
            if (counter === 1) {
                // Random colors for background
                changeBgColor();
            }
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allItem.forEach(function(item) {
            item.render();
        });

        player.render();

        allObstacles.forEach(function(obstacle) {
            obstacle.render();
        });

        allEnemies.forEach(function(enemy) {
            enemy.render();
        });
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {

    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/good-bug.png',
        'images/char-boy.png',
        'images/char-horn-girl.png',
        'images/char-cat-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Rock.png',
        'images/Tree Ugly.png',
        'images/Tree Tall.png',
        'images/banana.png',
        'images/paper.png',
        'images/newspaper.png',
        'images/Gem-Orange.png',
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
