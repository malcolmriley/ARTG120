var Load = function(game) {};
Load.prototype =
{
	preload: function()
	{
		// Add loader
		this.loader = new LoadHelper(this.game, "progressbar_background", "progressbar");

		// Add tasks to loader
		this.loader.addTask(this, loadTextures, function(){ return (this.game.loader.progressFloat / 100); });

		// Perform all load tasks
		this.loader.loadAll();
		this.loader.addOnComplete(this, function(){ this.game.state.start("Menu"); });
	},

	create: function()
	{

	},

	update: function()
	{
		this.loader.update();
	}
}

function loadTextures() {

}

class LoadHelper {
	constructor(passedGame, passedBackdropKey, passedForegroundKey) {
		let initSprite = function(passedKey) {
			let instance = passedGame.add.sprite((passedGame.camera.width / 2), (passedGame.camera.height / 2), passedKey);
			instance.anchor.setTo(0.5, 0.5);
			return instance;
		}
		this.reference_game = passedGame;
		this.sprite_background = initSprite(passedBackdropKey);
		this.sprite_foreground = initSprite(passedForegroundKey);
		this.fullwidth = this.sprite_foreground.width;
		this.sprite_crop = new Phaser.Rectangle(0, 0, 0, this.sprite_foreground.height);
		this.sprite_foreground.crop(this.sprite_crop);
		this.sprite_foreground.visible = true;

		this.tasks = [];
		this.weight_total = 0;
		this.progress = 0;
	}

	loadAll() {
		this.tasks.forEach(function(task){ task.load() });
	}

	addOnComplete(passedReference, passedCallback) {
		this.onComplete = passedCallback.bind(passedReference);
	}

	addTask(passedReference, passedTask, passedProgressFunction, passedLoadWeight) {
		let taskWeight = (passedLoadWeight) ? passedLoadWeight : 1.0;
		this.tasks[this.tasks.length] = { load : passedTask.bind(passedReference), progress : passedProgressFunction.bind(passedReference), weight : taskWeight };
		this.weight_total += taskWeight;
	}

	update() {
		for (let iteratedTask of this.tasks) {
			this.progress += (iteratedTask.progress() * (iteratedTask.weight / this.weight_total));
		}
		this.sprite_crop.width = Math.floor(this.fullwidth * this.progress);
		this.sprite_foreground.updateCrop();
		if (this.onComplete) {
			if (this.progress >= 1.0) {
				this.onComplete();
			}
		}
	}
}
