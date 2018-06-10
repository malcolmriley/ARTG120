//this file just contains all the states for the game

game.state.add('Boot', Boot);
game.state.add('Load', Load);
game.state.add('Menu', Menu);
game.state.add('Credits', Credits);
game.state.add('Controls', Controls);
game.state.add('Town', Town);
game.state.add('Minigame_Wound', Minigame_Wound);
game.state.add("Minigame_Alchemy", Minigame_Alchemy);
game.state.add('GameOver', GameOver);
game.state.add('MiniGameOver', MiniGameOver);

game.state.start('Boot');
