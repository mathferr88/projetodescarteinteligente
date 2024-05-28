const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87ceeb',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('esteira', 'https://via.placeholder.com/800x50');
    this.load.image('item', 'https://via.placeholder.com/50');
    this.load.image('cesto', 'https://via.placeholder.com/100x100');
}

function create() {
    this.esteira = this.add.tileSprite(400, 100, 800, 50, 'esteira');

    this.items = this.physics.add.group();
    this.time.addEvent({
        delay: 2000,
        callback: addItem,
        callbackScope: this,
        loop: true
    });

    this.cestos = this.physics.add.staticGroup();
    this.cestos.create(150, 550, 'cesto').setScale(1).refreshBody();
    this.cestos.create(350, 550, 'cesto').setScale(1).refreshBody();
    this.cestos.create(550, 550, 'cesto').setScale(1).refreshBody();
    this.cestos.create(750, 550, 'cesto').setScale(1).refreshBody();

    this.input.on('dragstart', onDragStart, this);
    this.input.on('drag', onDrag, this);
    this.input.on('dragend', onDragEnd, this);

    this.score = 0;
    this.errors = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    this.errorsText = this.add.text(16, 50, 'Errors: 0', { fontSize: '32px', fill: '#000' });
}

function addItem() {
    const item = this.items.create(Phaser.Math.Between(100, 700), 0, 'item');
    item.setInteractive();
    this.input.setDraggable(item);
}

function onDragStart(pointer, gameObject) {
    gameObject.setTint(0xff0000);
}

function onDrag(pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
    gameObject.y = dragY;
}

function onDragEnd(pointer, gameObject) {
    gameObject.clearTint();

    if (checkOverlap(gameObject, this.cestos)) {
        gameObject.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    } else {
        gameObject.destroy();
        this.errors += 1;
        this.errorsText.setText('Errors: ' + this.errors);

        if (this.errors >= 5) {
            this.scene.restart();
            this.errors = 0;
            this.score = 0;
        }
    }
}

function checkOverlap(spriteA, groupB) {
    const boundsA = spriteA.getBounds();
    let overlap = false;

    groupB.children.iterate(function (child) {
        const boundsB = child.getBounds();
        if (Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB)) {
            overlap = true;
        }
    });

    return overlap;
}

function update() {
    this.esteira.tilePositionX += 2;
}