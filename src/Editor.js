var WaveForms = function (game) {
    
    var credits;
    var str = '';
    var spriteRugbyBall;
    var jersey1;
    var jersey2;
    var jersey3;
    var jersey4;
    var arrayOfPathes = [];
    var path1 = [];
    var biPath1 = 0;
    var path2 = [];
    var biPath2 = 0;
    var path3 = [];
    var biPath3 = 0;
    var path4 = [];
    var biPath4 = 0;
    var path5 = [];
    var biPath5 = 0;
    var points;
    var intro;
    
    this.bmd = null;
    this.icons = null;

    this.handles = null;
    this.overHandle = null;
    this.draggedHandle = null;

    this.interpolation = Phaser.Math.linearInterpolation;

    //  Assuming 640x480 game world within the 800x600 editor
    this.offset = new Phaser.Point(80, 40);

    //  Pre-defined paths
    if (localStorage['points'] !== null && localStorage['points'] !== undefined) {
        this.points = localStorage['points'] ? JSON.parse(localStorage['points']) : [];
    }else {
        
    this.points = [
        null,
        {
            //  Path 1
            'type': WaveForms.CATMULL,
            'closed': false,
            'x': [ 440, 430, 405, 385, 360, 345 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 2
            'type': WaveForms.CATMULL,
            'closed': false,
            'x': [ 50, 58, 56, 84, 92, 100 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 3
            'type': WaveForms.CATMULL,
            'closed': false,
            'x': [ 80, 88, 96, 114, 122, 140 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 4
            'type': WaveForms.CATMULL,
            'closed': false,
            'x': [ 100, 128, 136, 154, 172, 200 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 5
            'type': WaveForms.CATMULL,
            'closed': false,
            'x': [ 150, 178, 196, 234, 302, 340 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 6
            'type': WaveForms.CATMULL,
            'closed': false,
            'x': [ 300, 328, 356, 384, 412, 440 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        }

    ]; 
        
    }

    //  Current path data
    this.path = [];
    this.currentPath = null;
    this.enableSnap = false;
    this.editMode = false;
    this.closePath = false;
    this.catmullTool = null;
    this.editTool = null;
    this.currentMode = null;
    this.coords = null;
    this.hint = null;
    this.sprite;
    this.bi = 0;

};

WaveForms.LINEAR = 0;
WaveForms.BEZIER = 1;
WaveForms.CATMULL = 2;
WaveForms.CLOSEPATH = 3;
WaveForms.EDIT = 4;
WaveForms.SNAP = 5;
WaveForms.PATH = 6;
WaveForms.SPRITE = 7;
WaveForms.SAVE = 8;

WaveForms.prototype = {

    init: function () {

        console.log('game', this.game);
        this.game.renderer.renderSession.roundPixels = true;
        this.stage.backgroundColor = '#204090';
        

    },

    preload: function () {
        
        // See Here if there is a problem
        
    //     game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    
    //   //game.scale.refresh();
    
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        
        this.load.atlas('icons', 'assets/waveforms.png', 'assets/waveforms.json');
        this.load.bitmapFont('font', 'assets/font.png', 'assets/font.xml');
        this.load.image('jersey', 'assets/EauClaireJersey.png');
        this.load.image('jersey1', 'assets/EauClaireJersey.png');
        this.load.image('jersey2', 'assets/EauClaireJersey.png');
        this.load.image('jersey3', 'assets/EauClaireJersey.png');
        this.load.image('jersey4', 'assets/EauClaireJersey.png');
        this.load.image('rugbyBall', 'assets/rugbyBall2.png');

    },

    create: function () {

        this.add.sprite(0, 0, 'icons', 'rugbyPlay');

        this.bmd = this.add.bitmapData(this.game.width, this.game.height);
        this.bmd.addToWorld();
        
        if (localStorage['points'] !== null && localStorage['points'] !== undefined) {
            
            this.points = localStorage['points'] ? JSON.parse(localStorage['points']) : [];

        } else {

          this.setPath(1);
          this.setPath(2);
          this.setPath(3);
          this.setPath(4);
          this.setPath(5);
          this.setPath(6);
        }

        //  Create the icons
        this.icons = this.add.group();

        this.catmullTool =  this.icons.add(new Icon(this,   WaveForms.CATMULL,    177,    'catmull',  Phaser.Keyboard.M, false));
        this.editTool =     this.icons.add(new Icon(this,   WaveForms.EDIT,       241,    'edit',     Phaser.Keyboard.E, true));
        this.currentPath  = this.icons.add(new Icon(this,   WaveForms.PATH,       369,    'path1',    Phaser.Keyboard.ONE, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       401,    'path2',    Phaser.Keyboard.TWO, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       433,    'path3',    Phaser.Keyboard.THREE, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       465,    'path4',    Phaser.Keyboard.FOUR, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       497,    'path5',    Phaser.Keyboard.FIVE, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       529,    'path6',    Phaser.Keyboard.SIX, false));
                            this.icons.add(new Icon(this,   WaveForms.SPRITE,     305,    'sprite',   Phaser.Keyboard.SPACEBAR, true));
                            this.icons.add(new Icon(this,   WaveForms.SAVE,       561,    'save',     Phaser.Keyboard.V, false));

        this.icons.y = 644;


        //  Create the path drag handles
        this.handles = this.add.group();

        for (var h = 0; h < 64; h++)
        {
            this.handles.add(new Handle(this));
        }

        //  Set the sprite
        this.sprite = this.add.sprite(0, 0, 'jersey');
        this.sprite.scale.setTo(0.05, 0.05);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.visible = false;
        
        window.jersey1 = this.add.sprite(0, 0, 'jersey1');
        window.jersey1.scale.setTo(0.05, 0.05);
        window.jersey1.anchor.set(0.5, 0.5);
        window.jersey1.visible = false;
        
        window.jersey2 = this.add.sprite(0, 0, 'jersey2');
        window.jersey2.scale.setTo(0.05, 0.05);
        window.jersey2.anchor.set(0.5, 0.5);
        window.jersey2.visible = false;
        
        window.jersey3 = this.add.sprite(0, 0, 'jersey3');
        window.jersey3.scale.setTo(0.05, 0.05);
        window.jersey3.anchor.set(0.5, 0.5);
        window.jersey3.visible = false;
        
        window.jersey4 = this.add.sprite(0, 0, 'jersey4');
        window.jersey4.scale.setTo(0.05, 0.05);
        window.jersey4.anchor.set(0.5, 0.5);
        window.jersey4.visible = false;
        
        window.spriteRugbyBall = this.add.sprite(50, 50, 'rugbyBall');
        window.spriteRugbyBall.scale.setTo(0.2, 0.2);
        window.spriteRugbyBall.anchor.set(0.5);
        window.spriteRugbyBall.visible = false;

        //  Set Catmull
        this.currentMode = this.catmullTool;
        this.currentMode.select();

        //  Set Path 
        this.currentPath.select();
        //  Help text
        this.coords = this.add.bitmapText(744, 6, 'font', "X: 0\nY: 0", 16);

        this.hint = this.add.text(40,10, ' ', { font: '16px Arial', fill: '#fff' });

        //  Other keyboard shortcuts
        var randKey = this.input.keyboard.addKey(Phaser.Keyboard.R);
        randKey.onDown.add(this.setPath, this);

        this.createSplash();

    },

    createSplash: function () {

        this.intro = this.add.group();

        var str = "Create your own rugby plays\n\n Tap to start editing\n\n Use on Landscape mode \n\n for a better experience on mobile";

        var credits = this.add.bitmapText(0, 280, 'font', str, 20);
        //var credits = this.add.text(0, 280, str, { font: '24px Arial', fill: '#000' });
        credits.align = "center";
        credits.x = 400 - (credits.width / 2);

        this.intro.add(credits);

        this.input.onDown.addOnce(this.closeSplash, this);

    },

    closeSplash: function () {
 
        this.add.tween(this.intro).to( { alpha: 0 }, 500,  "Linear", true);
        this.add.tween(this.icons).to( { y: 536 }, 500,  "Linear", true, 250);

        this.changePath(this.currentPath);

        //  Input callbacks
        this.input.addMoveCallback(this.plot, this);
        this.input.onDown.add(this.addPoint, this);

    },

    setPath: function (p) {

        var py = this.points[p].y;

        for (var i = 0; i < py.length; i++) 
        {
            py[i] =  (450 + (-72 * i));//this.rnd.between(32, 432);

        }
        
    },

    setHint: function (str) {

        if (typeof str === 'string')
        {
            if (str === '')
            {
                if (this.editMode)
                {
                    this.hint.text = "Click to add a point\nSelect existing point to delete it";
                }
                else
                {
                    this.hint.text = "Drag a point";
                }
            }
            else
            {
                this.hint.text = str;
            }
        }
        else
        {
            switch (str)
            {

                case WaveForms.CATMULL:
                    this.hint.text = "Create Your Own Play";
                    break;

                case WaveForms.EDIT:
                    if (!this.editMode)
                    {
                        this.hint.text = "Edit Path";
                    }
                    break;

                case WaveForms.PATH:
                    this.hint.text = "Change Path";
                    break;

                case WaveForms.SPRITE:
                    this.hint.text = "Play Animation";
                    break;

                case WaveForms.SAVE:
                    this.hint.text = "Save The Play";
                    break;
            }

        }

    },

    selected: function (tool) {

        switch (tool.type)
        {
            case WaveForms.CATMULL:
                this.setCatmull(tool);
                break;

            case WaveForms.EDIT:
                this.toggleEdit(tool);
                break;

            case WaveForms.PATH:
                this.changePath(tool);
                break;

            case WaveForms.SPRITE:
                this.toggleSprite(tool);
                break;

            case WaveForms.SAVE:
                this.save(tool);
                tool.deselect();
                break;
        }

    },

    setCatmull: function (tool) {

        this.currentMode.deselect();
        this.currentMode = tool;
        this.currentMode.select();

        this.points[this.currentPath.pathIndex].type = WaveForms.CATMULL;

        this.interpolation = Phaser.Math.catmullRomInterpolation;
        this.plot(true);

    },

    toggleEdit: function () {

        this.editMode = (this.editMode) ? false : true;

        if (this.editMode)
        {
            this.hint.text = "Click to add a point\nSelect existing point to delete it";
        }
        else
        {
            this.hint.text = "Drag a point";
        }

    },

    addPoint: function (pointer) {

        if (!this.editMode || pointer.y >= 536)
        {
            return;
        }
        
        
        var x = this.points[this.currentPath.pathIndex].x;
        var y = this.points[this.currentPath.pathIndex].y;
        


        console.log('addPoint', this.overHandle);

        //  Did they click an existing node?
        if (this.overHandle !== null)
        {
            //  Delete handle
            this.overHandle.hide();

            x = [];
            y = [];

            var i = 0;

            //  Resequence remaining handles
            for (var h = 0; h < this.handles.children.length; h++)
            {
                var handle = this.handles.children[h];

                if (handle.exists)
                {
                    handle.index = i;
                    x[i] = handle.x - this.offset.x;
                    y[i] = handle.y - this.offset.y;
                    i++;
                }
            }

            if (this.points[this.currentPath.pathIndex].closed)
            {
                x.push(x[0]);
                y.push(y[0]);
            }

            this.points[this.currentPath.pathIndex].x = x;
            this.points[this.currentPath.pathIndex].y = y;

            this.hint.text = "Point deleted\nClick to add a new point\nSelect existing point to delete it";
        }
        else
        {
            if (this.points[this.currentPath.pathIndex].closed)
            {
                x.pop();
                y.pop();
            }

            //  Add node
            x.push(pointer.x - this.offset.x);
            y.push(pointer.y - this.offset.y);

            var i = x.length - 1;

            var handle = this.handles.getFirstExists(false);

            handle.show(i, x[i], y[i]);

            if (this.points[this.currentPath.pathIndex].closed)
            {
                x.push(x[0]);
                y.push(y[0]);
            }

            this.hint.text = "Point created\nClick to add another point\nSelect existing point to delete it";
        }
            
        this.plot(true);

    },

    changePath: function (tool) {

        //  Hide all the current handles first
        // Look in here to save the current Path Keep its value, and draw it in the next view
        this.handles.callAll('hide');

        this.draggedHandle = null;
        

            this.currentMode.deselect();
            this.currentPath.deselect();
        
            this.currentPath = tool;
            this.currentPath.select();
            
            var idx = this.currentPath.pathIndex;
        

        for (var i = 0; i < this.points[idx].x.length; i++)
        {
            var handle = this.handles.getFirstExists(false);

            handle.show(i, this.points[idx].x[i], this.points[idx].y[i]);
        }

        switch (this.points[idx].type)
        {
            case WaveForms.CATMULL:
                this.setCatmull(this.catmullTool);
                break;
        }

    },

    toggleSprite: function () {

        if (this.sprite.visible)
        {
            this.sprite.visible = false;
            window.spriteRugbyBall.visible = false;
            window.jersey1.visible = false;
            window.jersey2.visible = false;
            window.jersey3.visible = false;
            window.jersey4.visible = false;
        }
        else
        {
            this.bi = 0;
            window.biPath1 = 0;
            window.biPath2 = 0;
            window.biPath3 = 0;
            window.biPath4 = 0;
            window.biPath5 = 0;
            this.sprite.visible = true;
            window.spriteRugbyBall.visible = true;
            window.jersey1.visible = true;
            window.jersey2.visible = true;
            window.jersey3.visible = true;
            window.jersey4.visible = true;
        }

    },

    save: function () {

        this.setHint('Play saved');
        localStorage['points'] = (JSON.stringify(this.points));
        //console.log('Points' + localStorage['points'] );
    },

   plot: function (force, pointer) {

        if (typeof force === 'undefined' || force instanceof Phaser.Pointer) { force = false; }

        if (this.draggedHandle === null && !force)
        {
            return;
        }
		
		this.bmd.clear();

		for (var counter = 1; counter < this.points.length; counter++) {
			
			if (this.points[counter] == null) { continue;}
			
			var x = this.points[counter].x;
			var y = this.points[counter].y;

			var dh = this.draggedHandle;


			if (dh !== null && counter == this.currentPath.pathIndex) {

				x[dh.index] = dh.x - this.offset.x;
				y[dh.index] = dh.y - this.offset.y;

				if (this.closePath)
				{
					x[x.length - 1] = x[0];
					y[y.length - 1] = y[0];
				}

				var cx = Math.floor(dh.x - this.offset.x);
				var cy = Math.floor(dh.y - this.offset.y);
				this.coords.text = "Xx: " + cx + "\nY: " + cy;
			}

			
			var ix = 0;

			//  100 points per path segment
			var dx = 1 / (x.length * 100);

			this.path = [];

			for (var i = 0; i <= 1; i += dx)
			{
				var px = this.interpolation.call(Phaser.Math, x, i);
				var py = this.interpolation.call(Phaser.Math, y, i);

				var node = { x: px, y: py, angle: 0 };

				if (ix > 0)
				{
					node.angle = this.math.angleBetweenPoints(this.path[ix - 1], node);
				}

				this.path.push(node);

				ix++;
				if (counter == 1) {

				    this.bmd.rect(this.offset.x + px, this.offset.y + py, 1, 1, 'rgba(255, 255, 255, 1)');
				    window.path1 = this.path;
		            this.bi = 0;
		        
		            window.biPath1 = this.bi;
                
				} else if (counter == 2) {

				    this.bmd.rect(this.offset.x + px, this.offset.y + py, 1, 1, 'rgba(0, 0, 0, 1)');
				    window.path2 = this.path;
		            this.bi = 0;
		        
		            window.biPath2 = this.bi;
				
				}else if (counter == 3) {

				    this.bmd.rect(this.offset.x + px, this.offset.y + py, 1, 1, 'rgba(255, 0, 0, 1)');
				    window.path3 = this.path;
		            this.bi = 0;
		        
		            window.biPath3 = this.bi;
				
				}else if (counter == 4) {

				    this.bmd.rect(this.offset.x + px, this.offset.y + py, 1, 1, 'rgba(0, 0, 255, 1)');
				    window.path4 = this.path;
		            this.bi = 0;
		        
		            window.biPath4 = this.bi;
		        
				}else if (counter == 5) {

				    this.bmd.rect(this.offset.x + px, this.offset.y + py, 1, 1, 'rgba(0, 255, 255, 1)');
				    window.path5 = this.path;
		            this.bi = 0;
		        
		            window.biPath5 = this.bi;
				
				}else if (counter == 6) {

				    this.bmd.rect(this.offset.x + px, this.offset.y + py, 1, 1, 'rgba(255, 255, 0, 1)');
				
				}else{

				this.bmd.rect(this.offset.x + px, this.offset.y + py, 1, 1, 'rgba(0, 255, 0, 1)');
				
				}
				window.arrayOfPathes = [counter, this.path];
			}
			
		}
		
    },

    update: function () {

        if (this.sprite.visible)
        {
            this.bi += 2;

            if (this.bi >= this.path.length)
            {
                this.bi = 0;
                this.sprite.visible = false;
            }

            this.sprite.x = this.offset.x + this.path[this.bi].x;
            this.sprite.y = this.offset.y + this.path[this.bi].y;
            this.sprite.rotation = this.path[this.bi].angle + 165;
        }
        
        if (window.spriteRugbyBall.visible) {
            
            window.biPath1 += 2;

            if (window.biPath1 >= window.path1.length)
            {
                window.biPath1 = 0;
                window.spriteRugbyBall.visible = false;
            }

            window.spriteRugbyBall.x = this.offset.x + window.path1[window.biPath1].x;
            window.spriteRugbyBall.y = this.offset.y + window.path1[window.biPath1].y;
            window.spriteRugbyBall.rotation = window.path1[window.biPath1].angle + 22;
        }
        
        if (window.jersey1.visible) {
            
            window.biPath2 += 2;

            if (window.biPath2 >= window.path2.length)
            {
                window.biPath2 = 0;
                window.jersey1.visible = false;
            }

            window.jersey1.x = this.offset.x + window.path2[window.biPath2].x;
            window.jersey1.y = this.offset.y + window.path2[window.biPath2].y;
            window.jersey1.rotation = window.path2[window.biPath2].angle + 165;
        }
        
        if (window.jersey2.visible) {
            
            window.biPath3 += 2;

            if (window.biPath3 >= window.path3.length)
            {
                window.biPath3 = 0;
                window.jersey2.visible = false;
            }

            window.jersey2.x = this.offset.x + window.path3[window.biPath3].x;
            window.jersey2.y = this.offset.y + window.path3[window.biPath3].y;
            window.jersey2.rotation = window.path3[window.biPath3].angle + 165;
        }
        
        if (window.jersey3.visible) {
            
            window.biPath4 += 2;

            if (window.biPath4 >= window.path4.length)
            {
                window.biPath4 = 0;
                window.jersey3.visible = false;
            }

            window.jersey3.x = this.offset.x + window.path4[window.biPath4].x;
            window.jersey3.y = this.offset.y + window.path4[window.biPath4].y;
            window.jersey3.rotation = window.path4[window.biPath4].angle + 165;
        }
        
        if (window.jersey4.visible) {
            
            window.biPath5 += 2;

            if (window.biPath5 >= window.path5.length)
            {
                window.biPath5 = 0;
                window.jersey4.visible = false;
            }

            window.jersey4.x = this.offset.x + window.path5[window.biPath5].x;
            window.jersey4.y = this.offset.y + window.path5[window.biPath5].y;
            window.jersey4.rotation = window.path5[window.biPath5].angle + 165;
        }
    }
    
};

