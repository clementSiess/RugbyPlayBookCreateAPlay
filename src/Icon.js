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
