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
		game.stage.backgroundColor = '#f0f0f0';

		// Create House Grid
		group_houses = game.add.group();
		let startX = 200;
		let startY = 30;
		for(let row = 0; row < 3; row += 1) {
			for (let column = 0; column < 3; column += 1) {
				var house = group_houses.create(0, 0, "house");
				house.scale.setTo(0.15, 0.15);
				house.x = startX + row * (10 + house.width);
				house.y = startY + column * (10 + house.width);
				makeButton(house, this, goToInterior);
			}
		}

		// Create Player
		let player = game.add.sprite(0, 0, "character");
		player.scale.setTo(0.1, 0.1);

		// Create Text Overlay
		game.add.text(0, 0, "Town \n Click to enter house.");
	},

	update: function()
	{
		
	}
}

function goToInterior() {
	game.state.start('MiniGame');
}
