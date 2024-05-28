const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#87ceeb',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

function preload() {
    // URLs de imagens de exemplo
    this.load.image('esteira', 'https://www.example.com/esteira.png'); // Atualize para a URL real da imagem
    this.load.image('item1', 'https://i.imgur.com/sGJeZMJ.png'); // Garrafa de plástico
    this.load.image('item2', 'https://i.imgur.com/3nN09jv.png'); // Papel amassado
    this.load.image('item3', 'https://i.imgur.com/GzVV9ef.png'); // Lata
    this.load.image('cesto1', 'https://i.imgur.com/z2b6VGX.png'); // Cesto de plástico
    this.load.image('cesto2', 'https://i.imgur.com/jI9yQid.png'); // Cesto de papel
    this.load.image('cesto3', 'https://i.imgur.com/7yZJ5zG.png'); // Cesto de metal
}

function create() {
    // Esteira rolante
    this.esteira = this.add.tileSprite(400, 100, 800, 50, 'esteira');

    // Grupo de itens de lixo
    this.items = this.physics.add.group();

    // Adicionar itens periodicamente
    this.time.addEvent({
        delay: 2000,
        callback: addItem,
        callbackScope: this,
        loop: true
    });

    // Grupo de cestos de reciclagem
    this.cestos = this.physics.add.staticGroup();
    this.cestos.create(150, 550, 'cesto1').setScale(1).refreshBody();
    this.cestos.create(350, 550, 'cesto2').setScale(1).refreshBody();
    this.cestos.create(550, 550, 'cesto3').setScale(1).refreshBody();

    // Permitir arrastar e soltar itens de lixo
    this.input.on('dragstart', onDragStart, this);
    this.input.on('drag', onDrag, this);
    this.input.on('dragend', onDragEnd, this);

    // Pontuação e erros
    this.score = 0;
    this.errors = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    this.errorsText = this.add.text(16, 50, 'Errors: 0', { fontSize: '32px', fill: '#000' });
}

function addItem() {
    const itemTypes = ['item1', 'item2', 'item3'];
    const itemType = Phaser.Utils.Array.GetRandom(itemTypes);
    const item = this.items.create(Phaser.Math.Between(100, 700), 0, itemType);
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
