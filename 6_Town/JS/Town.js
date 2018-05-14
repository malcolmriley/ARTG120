var Town = function(game) {};
Town.prototype =
{
	preload: function()
	{
		// TODO: Swap for atlas version.
		game.load.image("character", "../_Assets/images/character.png");
		game.load.image("house", "../_Assets/images/house.png");
	},

	create: function()
	{
		game.add.text(0, 0, "Town \n ENTER: MiniGame");
	  game.stage.backgroundColor = '#ffffff';

		// Create houses
		group_houses = game.add.group();
		let house = group_houses.create(0, 0, "house").scale.setTo(0.2, 0.2);
	},

	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
		{
			game.state.start('MiniGame');
		}
	}
}
