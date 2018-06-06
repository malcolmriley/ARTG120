var Menu = function(game) {};
Menu.prototype =
{
	preload: function()
	{
		this.load.path = "../_Assets/images/";
		this.load.image("backdrop", "old_paper.png");
		this.load.image("button", "button.png");
		this.load.image("title", "title.png");
		this.load.image("text_credits", "text_credits.png");
		this.load.image("text_play", "text_play.png");
	},

	create: function()
	{

	},

	update: function()
	{
		
	}
}
