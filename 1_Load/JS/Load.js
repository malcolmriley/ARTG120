var Load = function(game) {};
Load.prototype =
{
	preload: function()
	{
		// Set Background Color
		game.stage.backgroundColor = "#000000";

		// Add loader
		this.loader = new LoadHelper(this.game, "progressbar_background", "progressbar");

		// Add tasks to loader
		let defaultProgress = function(){ return (this.game.load.hasLoaded) ? 1.0 : (this.game.load.progressFloat / 100); };
		this.loader.addTask(this, loadTextures, "../_Assets/images/", defaultProgress);
		this.loader.addTask(this, loadAudio, "../_Assets/sounds/", defaultProgress);

		// TODO: Add task for loading web fonts?

		// Perform all load tasks
		this.loader.addOnComplete(this, function(){ game.stage.backgroundColor = "#FFFFFF"; this.game.state.start("Menu"); });
		this.loader.loadAll();
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
	// Menu
	this.load.image("backdrop", "old_paper.png");
	this.load.image("button", "button.png");
	this.load.image("title", "title.png");
	this.load.image("text_credits", "text_credits.png");
	this.load.image("text_play", "text_play.png");

	// Town
	game.load.image("character", "character.png");
	game.load.image("house", "house.png");

	// Alchemy
	this.load.image("backdrop", "old_paper.png");
	this.load.image("circle", "circle.png");
	this.load.image("bowl", "bowl.png");
	this.load.image("bottle_round", "bottle_round.png");
	this.load.image("retort", "retort.png");
	this.load.image("bottle_cork", "cork.png");
	this.load.image("table", "table.png");
	this.load.image("shelf", "shelf.png");
	this.load.image("stand_background", "stand_background.png");
	this.load.image("stand_foreground", "stand_foreground.png");
	this.load.image("burner", "burner.png");
	this.load.image("spill", "spill.png");
	this.load.spritesheet("liquid_bowl", "liquid_bowl.png", 113, 75);
	this.load.spritesheet("liquid_bottle",  "liquid_bottle.png", 75, 113);
	this.load.spritesheet("liquid_retort",  "liquid_retort.png", 150, 75);

	// Wound
	this.load.image("bg","old_paper.png");
	this.load.image("wound0","wound_0.png");
	this.load.image("wound1","wound_1.png");
	this.load.image("wound2","wound_2.png");
	this.load.image("wound3","wound_3.png");
	this.load.image("bowl","bowl.png");
	this.load.image("pestle","pestle.png");
	this.load.image("poultice","resin_huge.png");
}

function loadAudio() {
	// Menu
	this.load.audio("thump", "thump.wav");
	this.load.audio("ominous", "ominous.wav");

	// Town
	this.load.audio("fx_door_creak", "door_open.wav");

	// Alchemy
	this.load.audio("pour", "water_pour.wav");
	this.load.audio("cork", "cork_out.wav");
	this.load.audio("clink_0", "bottle_clink_0.wav");
	this.load.audio("clink_1", "bottle_clink_1.wav");
	this.load.audio("metal_ping_1", "metal_ping_1.wav");
	this.load.audio("metal_ping_2", "metal_ping_2.wav");
	this.load.audio("metal_ping_3", "metal_ping_3.wav");
	this.load.audio("bottle_break", "bottle_break.wav");

	// Wound
	this.load.audio('background', ['Midnightcem.ogg', "Midnightcem.wav"]);
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
		this.tasks.forEach(function(task){
			task.game.load.path = task.path;
			task.load();
			task.game.load.path = "";
		});
	}

	addOnComplete(passedReference, passedCallback) {
		this.onComplete = passedCallback.bind(passedReference);
	}

	addTask(passedReference, passedTask, passedPath, passedProgressFunction, passedLoadWeight) {
		let taskWeight = (passedLoadWeight) ? passedLoadWeight : 1.0;
		this.tasks[this.tasks.length] = {
			game : this.reference_game,
			load : passedTask.bind(passedReference),
			path : passedPath,
			progress : passedProgressFunction.bind(passedReference),
			weight : taskWeight
		};
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
