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

    this.editor.setHint('Dragging point ' + this.index);

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
