var WaveForms = function (game) {

    this.bmd = null;
    this.icons = null;

    this.handles = null;
    this.overHandle = null;
    this.draggedHandle = null;

    this.interpolation = Phaser.Math.linearInterpolation;

    //  Assuming 640x480 game world within the 800x600 editor
    this.offset = new Phaser.Point(80, 32);

    //  Pre-defined paths
    this.points = [
        null,
        {
            //  Path 1
            'type': WaveForms.LINEAR,
            'closed': false,
            'x': [ 0, 128, 256, 384, 512, 640 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 2
            'type': WaveForms.LINEAR,
            'closed': false,
            'x': [ 0, 128, 256, 384, 512, 640 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 3
            'type': WaveForms.LINEAR,
            'closed': false,
            'x': [ 0, 128, 256, 384, 512, 640 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 4
            'type': WaveForms.LINEAR,
            'closed': false,
            'x': [ 0, 128, 256, 384, 512, 640 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 5
            'type': WaveForms.LINEAR,
            'closed': false,
            'x': [ 0, 128, 256, 384, 512, 640 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 6
            'type': WaveForms.LINEAR,
            'closed': false,
            'x': [ 0, 128, 256, 384, 512, 640 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 7
            'type': WaveForms.LINEAR,
            'closed': false,
            'x': [ 0, 128, 256, 384, 512, 640 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        },
        {
            //  Path 8
            'type': WaveForms.LINEAR,
            'closed': false,
            'x': [ 0, 128, 256, 384, 512, 640 ],
            'y': [ 240, 240, 240, 240, 240, 240 ]
        }
    ];

    //  Current path data
    this.path = [];

    this.currentPath = null;

    this.enableSnap = false;
    this.editMode = false;
    this.closePath = false;

    this.linearTool = null;
    this.bezierTool = null;
    this.catmullTool = null;
    this.closeTool = null;
    this.editTool = null;
    this.snapTool = null;

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

        this.load.atlas('icons', 'assets/waveforms.png', 'assets/waveforms.json');
        this.load.bitmapFont('font', 'assets/font.png', 'assets/font.xml');
        this.load.image('ship', 'assets/ship.png');

        //  Icons from CrackArt ST by Jan Borchers and Detlef Ruttger

    },

    create: function () {

        this.add.sprite(0, 0, 'icons', 'rugbyField');

        this.bmd = this.add.bitmapData(this.game.width, this.game.height);
        this.bmd.addToWorld();

        this.random(1);
        this.random(2);
        this.random(3);
        this.random(4);
        this.random(5);
        this.random(6);
        this.random(7);
        this.random(8);

        //  Create the icons
        this.icons = this.add.group();

        this.linearTool =   this.icons.add(new Icon(this,   WaveForms.LINEAR,     0,      'linear',   Phaser.Keyboard.L, false));
        this.bezierTool =   this.icons.add(new Icon(this,   WaveForms.BEZIER,     64,     'bezier',   Phaser.Keyboard.B, false));
        this.catmullTool =  this.icons.add(new Icon(this,   WaveForms.CATMULL,    128,    'catmull',  Phaser.Keyboard.M, false));
        this.closeTool =    this.icons.add(new Icon(this,   WaveForms.CLOSEPATH,  192,    'close',    Phaser.Keyboard.C, true));
        this.editTool =     this.icons.add(new Icon(this,   WaveForms.EDIT,       256,    'edit',     Phaser.Keyboard.E, true));
        this.snapTool =     this.icons.add(new Icon(this,   WaveForms.SNAP,       320,    'snap',     Phaser.Keyboard.S, true));
        this.currentPath =  this.icons.add(new Icon(this,   WaveForms.PATH,       384,    'path1',    Phaser.Keyboard.ONE, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       416,    'path2',    Phaser.Keyboard.TWO, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       448,    'path3',    Phaser.Keyboard.THREE, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       480,    'path4',    Phaser.Keyboard.FOUR, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       512,    'path5',    Phaser.Keyboard.FIVE, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       544,    'path6',    Phaser.Keyboard.SIX, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       576,    'path7',    Phaser.Keyboard.SEVEN, false));
                            this.icons.add(new Icon(this,   WaveForms.PATH,       608,    'path8',    Phaser.Keyboard.EIGHT, false));
                            this.icons.add(new Icon(this,   WaveForms.SPRITE,     640,    'sprite',   Phaser.Keyboard.SPACEBAR, true));
                            this.icons.add(new Icon(this,   WaveForms.SAVE,       704,    'save',     Phaser.Keyboard.V, false));

        this.icons.y = 600;

        this.phaserIcon = this.add.sprite(768, 536, 'icons', 'phaser');
        this.phaserIcon.inputEnabled = true;
        this.phaserIcon.events.onInputOver.add(function(sprite) {
            sprite.tint = 0xffff00;
        });
        this.phaserIcon.events.onInputOut.add(function(sprite) {
            sprite.tint = 0xffffff;
        });
        this.phaserIcon.events.onInputDown.add(function() {
            window.location.href = "http://phaser.io/waveforms";
        });

        //  Create the path drag handles
        this.handles = this.add.group();

        for (var h = 0; h < 64; h++)
        {
            this.handles.add(new Handle(this));
        }

        //  The test sprite
        this.sprite = this.add.sprite(0, 0, 'ship');
        this.sprite.anchor.set(0.5);
        this.sprite.visible = false;

        //  Set Linear
        this.currentMode = this.linearTool;
        this.currentMode.select();

        //  Set Path 1
        this.currentPath.select();

        //  Help text
        this.coords = this.add.bitmapText(744, 6, 'font', "X: 0\nY: 0", 16);
        this.hint = this.add.bitmapText(4, 6, 'font', " ", 16);

        //  Other keyboard shortcuts
        var randKey = this.input.keyboard.addKey(Phaser.Keyboard.R);
        randKey.onDown.add(this.random, this);

        this.createSplash();

    },

    createSplash: function () {

        this.intro = this.add.group();

        var fade = this.add.bitmapData(800, 600);
        fade.rect(0, 0, 800, 600, 'rgba(0,0,0,0.4)');

        var fadeContainer = this.intro.create(0, 0, fade);

        var logo = this.intro.create(100, 200, 'icons', 'logo')

        var str = "- Phaser WaveForms -\n\nBy Richard Davey, Photon Storm 2015\n\nhttp://phaser.io/waveforms/";

        var credits = this.add.bitmapText(0, 280, 'font', str, 16);
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

    random: function (p) {

        var py = this.points[p].y;

        for (var i = 0; i < py.length; i++)
        {
            py[i] = this.rnd.between(32, 432);
        }

    },

    setHint: function (str) {

        if (typeof str === 'string')
        {
            if (str === '')
            {
                if (this.editMode)
                {
                    this.hint.text = "Click to add a node\nSelect existing node to delete it";
                }
                else
                {
                    this.hint.text = "Drag a node";
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
                case WaveForms.LINEAR:
                    this.hint.text = "Set path type to Linear";
                    break;

                case WaveForms.BEZIER:
                    this.hint.text = "Set path type to Bezier";
                    break;

                case WaveForms.CATMULL:
                    this.hint.text = "Set path type to Catmull Rom";
                    break;

                case WaveForms.CLOSEPATH:
                    this.hint.text = "Toggle path closed or open ended";
                    break;

                case WaveForms.EDIT:
                    if (!this.editMode)
                    {
                        this.hint.text = "Toggle Edit Mode";
                    }
                    break;

                case WaveForms.SNAP:
                    this.hint.text = "Toggle Snap to Grid";
                    break;

                case WaveForms.PATH:
                    this.hint.text = "Change Path";
                    break;

                case WaveForms.SPRITE:
                    this.hint.text = "Toggle Sprite on Path";
                    break;

                case WaveForms.SAVE:
                    this.hint.text = "Save Path data to console.log";
                    break;
            }

        }

    },

    selected: function (tool) {

        switch (tool.type)
        {
            case WaveForms.LINEAR:
                this.setLinear(tool);
                break;

            case WaveForms.BEZIER:
                this.setBezier(tool);
                break;

            case WaveForms.CATMULL:
                this.setCatmull(tool);
                break;

            case WaveForms.CLOSEPATH:
                this.toggleClose(tool);
                break;

            case WaveForms.EDIT:
                this.toggleEdit(tool);
                break;

            case WaveForms.SNAP:
                this.toggleSnap(tool);
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

    setLinear: function (tool) {

        this.currentMode.deselect();
        this.currentMode = tool;
        this.currentMode.select();

        this.points[this.currentPath.pathIndex].type = WaveForms.LINEAR;

        this.interpolation = Phaser.Math.linearInterpolation;
        this.plot(true);

    },

    setBezier: function (tool) {

        this.currentMode.deselect();
        this.currentMode = tool;
        this.currentMode.select();

        this.points[this.currentPath.pathIndex].type = WaveForms.BEZIER;

        this.interpolation = Phaser.Math.bezierInterpolation;
        this.plot(true);

    },

    setCatmull: function (tool) {

        this.currentMode.deselect();
        this.currentMode = tool;
        this.currentMode.select();

        this.points[this.currentPath.pathIndex].type = WaveForms.CATMULL;

        this.interpolation = Phaser.Math.catmullRomInterpolation;
        this.plot(true);

    },

    toggleClose: function (tool) {

        var x = this.points[this.currentPath.pathIndex].x;
        var y = this.points[this.currentPath.pathIndex].y;

        if (this.closePath)
        {
            //  Remove the final points
            x.pop();
            y.pop();
        }
        else
        {
            //  Add the final points
            x.push(x[0]);
            y.push(y[0]);
        }

        this.closePath = (this.closePath) ? false : true;

        this.points[this.currentPath.pathIndex].closed = this.closePath;

        if (this.closePath)
        {
            tool.select();
        }
        else
        {
            tool.deselect();
        }

        this.plot(true);

    },

    toggleEdit: function () {

        this.editMode = (this.editMode) ? false : true;

        if (this.editMode)
        {
            this.hint.text = "Click to add a node\nSelect existing node to delete it";
        }
        else
        {
            this.hint.text = "Drag a node";
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

            this.hint.text = "Node deleted\nClick to add a new node\nSelect existing node to delete it";
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

            this.hint.text = "Node created\nClick to add another node\nSelect existing node to delete it";
        }
            
        this.plot(true);

    },

    toggleSnap: function () {

        this.enableSnap = (this.enableSnap) ? false : true;

        this.handles.callAll('updateSnap');

    },

    changePath: function (tool) {

        //  Hide all the current handles first
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

        //  Closed path?
        if (this.points[idx].closed)
        {
            this.closePath = true;
            this.closeTool.select();
        }
        else
        {
            this.closePath = false;
            this.closeTool.deselect();
        }

        switch (this.points[idx].type)
        {
            case WaveForms.LINEAR:
                this.setLinear(this.linearTool);
                break;

            case WaveForms.BEZIER:
                this.setBezier(this.bezierTool);
                break;

            case WaveForms.CATMULL:
                this.setCatmull(this.catmullTool);
                break;
        }

    },

    toggleSprite: function () {

        if (this.sprite.visible)
        {
            this.sprite.visible = false;
        }
        else
        {
            this.bi = 0;
            this.sprite.visible = true;
        }

    },

    save: function () {

        this.setHint('Check the console');
        // console.log(JSON.stringify(this.points[this.currentPath.pathIndex]));
        console.log(JSON.stringify(this.points));

    },

    plot: function (force, pointer) {

        if (typeof force === 'undefined' || force instanceof Phaser.Pointer) { force = false; }

        if (this.draggedHandle === null && !force)
        {
            return;
        }

        var x = this.points[this.currentPath.pathIndex].x;
        var y = this.points[this.currentPath.pathIndex].y;
        var dh = this.draggedHandle;

        if (dh !== null)
        {
            x[dh.index] = dh.x - this.offset.x;
            y[dh.index] = dh.y - this.offset.y;

            if (this.closePath)
            {
                x[x.length - 1] = x[0];
                y[y.length - 1] = y[0];
            }

            var cx = Math.floor(dh.x - this.offset.x);
            var cy = Math.floor(dh.y - this.offset.y);
            this.coords.text = "X: " + cx + "\nY: " + cy;
        }

        this.bmd.clear();

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

            this.bmd.rect(this.offset.x + px, this.offset.y + py, 1, 1, 'rgba(255, 255, 255, 1)');
        }

    },

    update: function () {

        if (this.sprite.visible)
        {
            this.bi += 2;

            if (this.bi >= this.path.length)
            {
                this.bi = 0;
            }

            this.sprite.x = this.offset.x + this.path[this.bi].x;
            this.sprite.y = this.offset.y + this.path[this.bi].y;
            this.sprite.rotation = this.path[this.bi].angle;
        }

    }

};

var Handle = function (editor) {

    this.editor = editor;

    Phaser.Sprite.call(this, editor.game, 0, 0, 'icons', 'marker-r');

    this.exists = false;
    this.visible = false;

    this.anchor.set(0.5);

    this.inputEnabled = true;

    this.input.enableDrag();

    this.events.onInputOver.add(this.onOver, this);
    this.events.onInputOut.add(this.onOut, this);
    this.events.onDragStart.add(this.dragStart, this);
    this.events.onDragStop.add(this.dragStop, this);

};

Handle.prototype = Object.create(Phaser.Sprite.prototype);
Handle.prototype.constructor = Handle;

Handle.prototype.show = function (index, x, y) {

    this.index = index;

    this.x = this.editor.offset.x + x;
    this.y = this.editor.offset.y + y;

    this.exists = true;
    this.visible = true;

    this.updateSnap();

};

Handle.prototype.hide = function () {

    this.exists = false;
    this.visible = false;

    this.editor.draggedHandle = null;
    this.editor.overHandle = null;

};

Handle.prototype.updateSnap = function () {

    if (this.editor.enableSnap)
    {
        this.input.enableSnap(20, 20, true, true);
    }
    else
    {
        this.input.disableSnap();
    }

};

Handle.prototype.onOver = function () {

    if (!this.exists)
    {
        return;
    }

    this.frameName = 'marker-g';

    var cx = Math.floor(this.x - this.editor.offset.x);
    var cy = Math.floor(this.y - this.editor.offset.y);

    this.editor.coords.text = "X: " + cx + "\nY: " + cy;
    this.editor.overHandle = this;

};

Handle.prototype.onOut = function () {

    if (!this.exists)
    {
        return;
    }

    this.frameName = 'marker-r';
    this.editor.overHandle = null;

};

Handle.prototype.dragStart = function () {

    if (!this.exists)
    {
        return;
    }

    this.frameName = 'marker-g';

    this.editor.draggedHandle = this;

    this.editor.setHint('Dragging node ' + this.index);

};

Handle.prototype.dragStop = function () {

    if (!this.exists)
    {
        return;
    }

    this.frameName = 'marker-r';
    this.editor.draggedHandle = null;

    this.editor.setHint('');

};

var Icon = function (editor, type, x, frame, key, toggle) {

    this.editor = editor;

    Phaser.Sprite.call(this, editor.game, x, 0, 'icons', frame);

    this.type = type;
    this.enabled = false;
    this.pathScreen = false;
    this.isToggle = toggle;

    if (frame.substr(0, 4) === 'path')
    {
        this.pathScreen = true;
        this.pathIndex = parseInt(frame.substr(4, 1), 10);
    }

    if (this.pathScreen)
    {
        this.outline = this.addChild(new Phaser.Sprite(this.game, 0, 0, 'icons', 'over-path'));
        this.active = this.addChild(new Phaser.Sprite(this.game, 0, 0, 'icons', 'active-path'));
        this.active.visible = false;
    }
    else
    {
        this.outline = this.addChild(new Phaser.Sprite(this.game, 0, 0, 'icons', 'over'));
    }

    this.outline.visible = false;

    this.inputEnabled = true;

    this.events.onInputOver.add(this.onOver, this);
    this.events.onInputOut.add(this.onOut, this);
    this.events.onInputDown.add(this.onDown, this);

    //  Keyboard shortcut
    this.shortcut = editor.input.keyboard.addKey(key);
    this.shortcut.onDown.add(this.onDown, this);

};

Icon.prototype = Object.create(Phaser.Sprite.prototype);
Icon.prototype.constructor = Icon;

Icon.prototype.select = function () {

    this.enabled = true;

    if (this.pathScreen)
    {
        this.active.visible = true;
    }
    else
    {
        this.outline.frameName = 'selected';
        this.outline.visible = true;
    }

};

Icon.prototype.deselect = function () {

    this.enabled = false;

    if (this.pathScreen)
    {
        this.active.visible = false;
    }
    else
    {
        this.outline.visible = false;
    }

};

Icon.prototype.onOver = function () {

    if (this.pathScreen)
    {
        this.outline.frameName = 'over-path';
    }
    else
    {
        this.outline.frameName = 'over';
    }

    this.outline.visible = true;

    this.editor.setHint(this.type);

};

Icon.prototype.onOut = function () {

    if (this.pathScreen)
    {
        this.outline.visible = false;
    }
    else
    {
        if (this.enabled)
        {
            this.outline.frameName = 'selected';
        }
        else
        {
            this.outline.visible = false;
        }
    }

    this.editor.setHint('');

};

Icon.prototype.onDown = function () {

    if (this.isToggle)
    {
        if (this.enabled)
        {
            this.deselect();
        }
        else
        {
            this.select();
        }
        
        this.editor.selected(this);
    }
    else
    {
        if (this.enabled)
        {
            return;
        }

        if (this.pathScreen)
        {
            this.active.visible = true;
        }
        else
        {
            this.outline.frameName = 'selected';
            this.outline.visible = true;
        }

        this.enabled = true;
        this.editor.selected(this);
    }

};
