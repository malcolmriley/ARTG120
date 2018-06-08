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
		this.loader.addTask(this.load, loadTextures, "../_Assets/images/", defaultProgress);
		this.loader.addTask(this.load, loadAudio, "../_Assets/sounds/", defaultProgress);

		// TODO: Add task for loading web fonts?

		// Perform all load tasks
		this.loader.addOnComplete(this, function(){ game.stage.backgroundColor = "#FFFFFF"; this.game.state.start("Menu"); });
		this.loader.loadAll();
	},

	create: function()
	{
		// Create global sound objects
		sound_click = game.add.audio("ominous");
		sound_mouseover = game.add.audio("thump");
	},

	update: function()
	{
		this.loader.update();
	}
}

function loadTextures() {
	// Menu
	this.image("backdrop", "old_paper.png");
	this.image("button", "button.png");
	this.image("title", "title.png");
	this.image("text_credits", "text_credits.png");
	this.image("text_play", "text_play.png");

	// Town
	this.image("character", "character.png");
	this.image("house", "house.png");

	// Alchemy
	this.image("backdrop", "old_paper.png");
	this.image("circle", "circle.png");
	this.image("bowl", "bowl.png");
	this.image("bottle_round", "bottle_round.png");
	this.image("retort", "retort.png");
	this.image("bottle_cork", "cork.png");
	this.image("table", "table.png");
	this.image("shelf", "shelf.png");
	this.image("stand_background", "stand_background.png");
	this.image("stand_foreground", "stand_foreground.png");
	this.image("burner", "burner.png");
	this.image("spill", "spill.png");
	this.spritesheet("liquid_bowl", "liquid_bowl.png", 113, 75);
	this.spritesheet("liquid_bottle",  "liquid_bottle.png", 75, 113);
	this.spritesheet("liquid_retort",  "liquid_retort.png", 150, 75);

	// Wound
	this.image("bg","old_paper.png");
	this.image("wound0","wound_0.png");
	this.image("wound1","wound_1.png");
	this.image("wound2","wound_2.png");
	this.image("wound3","wound_3.png");
	this.image("bowl","bowl.png");
	this.image("pestle","pestle.png");
	this.image("poultice","resin_huge.png");

	// Game Over
	this.image("grave", "grave.png");
	this.image("text_gameover", "text_gameover.png");
}

function loadAudio() {
	// Menu
	this.audio("thump", "thump.wav");
	this.audio("ominous", "ominous.wav");

	// Town
	this.audio("fx_door_creak", "door_open.wav");

	// Alchemy
	this.audio("pour", "water_pour.wav");
	this.audio("cork", "cork_out.wav");
	this.audio("clink_0", "bottle_clink_0.wav");
	this.audio("clink_1", "bottle_clink_1.wav");
	this.audio("metal_ping_1", "metal_ping_1.wav");
	this.audio("metal_ping_2", "metal_ping_2.wav");
	this.audio("metal_ping_3", "metal_ping_3.wav");
	this.audio("bottle_break", "bottle_break.wav");

	// Wound
	this.audio('background', ['Midnightcem.ogg', "Midnightcem.wav"]);
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
