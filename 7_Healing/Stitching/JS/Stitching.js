var Stitching = function(game) {
    this.pointsArray = [];
    this.bezierGraphics;
};

Stitching.prototype = 
{
    preload: function()
    {
        
    },

    create: function()
    {
        for(var i = 0; i < 4; i++)
        {
            var draggablePoint = game.add.sprite(game.rnd.between(100, game.width - 100), game.rnd.between(100, gmae.height - 100), "point");
            draggablePoint.inputEnabled = true;
            
        }

    },

    update: function()
    {
        this.player.positon.x = game.input.mousePointer.x;
        this.player.positon.y = game.input.mousePointer.y;
    }
}