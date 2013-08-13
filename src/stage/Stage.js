/*
 * License
 * http://daishihmr.mit-license.org/
 */
(function() {

/**
 * @class
 */
gls2.Stage = tm.createClass(
/** @lends {gls2.Stage.prototype} */
{

    player: null,
    gameScene: null,

    /** @type {gls2.StageSequencer} */
    seq: null,

    frame: 0,

    init: function(gameScene) {
        var scene = this.gameScene = gameScene;
        this.player = gameScene.player;

        this.setupBackground();

        this.seq = gls2.StageSequencer();

        this.frame = 0;
    },

    setupBackground: function() {
    },

    update: function() {
        this.executeFrame(this.frame);
        this.frame += 1;
    },

    executeFrame: function(frame) {
        var data = this.seq.get(frame);
        if (data === null) {
            return;
        } else if (typeof(data.value) === "function") {
            data.value.call(this);
        } else if (gls2.EnemyUnit[data.value] !== undefined){
            var unit = gls2.EnemyUnit[data.value];
            if (unit !== null) {
                for (var i = 0; i < unit.length; i++) {
                    var enemy = this.launchEnemy(unit[i]);
                    if (data.stop) {
                        enemy.addEventListener("enemyconsumed", function() {
                            this.seq.stoping = false;
                        }.bind(this));
                    }
                }
            }
        }
    },

    launchEnemy: function(data) {
        this.gameScene.enemyCount += 1;
        return gls2.Enemy(this.gameScene, this, data.soft, data.hard)
            .setPosition(data.x, data.y)
            .addChildTo(this.gameScene)
            .onLaunch();
    },

    onDestroyEnemy: function(enemy) {
    },

});

/**
 * @static
 */
gls2.Stage.create = function(gameScene, stageNumber) {
    if (stageNumber === 0) {
        return gls2.Stage1(gameScene);
    }
};

/**
 * @class
 */
gls2.StageSequencer = tm.createClass(
/** @lengs {gls2.StageSequencer.prototype} */
{
    index: 0,
    data: null,

    /** 中ボス戦闘中 */
    stoping: false,

    init: function() {
        this.data = {};
    },

    add: function(count, value, isMBoss) {
        this.index += count;
        this.data[this.index] = {
            stop: isMBoss,
            value: value
        };
    },

    get: function(frame) {
        var data = this.data[frame];
        if (data === undefined) return null;
        if (data.stop === true) {
            this.stoping = true;
            return data;
        } else if (!this.stoping) {
            return data;
        } else {
            return null;
        }
    },
});

})();