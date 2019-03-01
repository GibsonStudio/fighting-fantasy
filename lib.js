
var hero = {};
hero.skill = 0;
hero.stamina = 0;
hero.luck = 0;
hero.inCombat = false;

var monster = {};
monster.skill = 10;
monster.stamina = 12;
monster.index = 1;
monster.indexImageCount = 5;

var luckEvent;

function init ()
{
  startNewGame();
}


function startNewGame ()
{

  hero.skill = 6 + getDice();
  hero.stamina = 12 + getDice() + getDice();
  hero.luck = 6 + getDice();
  hero.inCombat = false;
  updateHero();
  updateMonster();
  showScratches();
  $('#you-are-dead').hide();
  $('#fight-bg').hide();

  resetLuckTest();
  $('#dice-your').html('');
  $('#dice-monster').html('');
  $('#fight-message').html('');

}

function updateHero ()
{
  $('#skill').html(hero.skill);
  $('#stamina').html(hero.stamina);
  $('#luck').html(hero.luck);
}

function updateMonster ()
{
  $('#monster-skill').html(monster.skill);
  $('#monster-stamina').html(monster.stamina);
}

function testLuck ()
{

  if (hero.inCombat) { return false; }

  if (luckEvent) { console.log("already running"); return false; }
  $('#dice-monster').html('');
  if (hero.luck < 1) { indicateUnlucky(); return false; }
  var dice = [getDice(), getDice()];
  showDice(dice);
  if ((dice[0] + dice[1]) <= hero.luck) {
    indicateLucky();
  } else {
    indicateUnlucky();
  }
  hero.luck--;
  updateHero();
}


function resetLuckTest () {
  clearTimeout(luckEvent);
  luckEvent = false;
  $('#luck-output').html('');
  $('#luck-output').removeClass('green red');
  $('#dice-your').html('');
}

function indicateLucky () {
  $('#luck-output').html('Lucky');
  $('#luck-output').addClass('green');
  clearTimeout(luckEvent);
  luckEvent = setTimeout('resetLuckTest()', 2000);
}

function indicateUnlucky () {
  $('#luck-output').html('Unucky');
  $('#luck-output').addClass('red');
  clearTimeout(luckEvent);
  luckEvent = setTimeout('resetLuckTest()', 2000);
}


function rollDice ()
{
  if (luckEvent) { return false; }
  var dice = [getDice(), getDice()];
  showDice(dice);
}


function rollMonsterDice ()
{
  if (luckEvent) { return false; }
  var dice = [getDice(), getDice()];
  showMonsterDice(dice);
}


function showDice (dice)
{
  var html = '';
  for (var i = 0; i < dice.length; i++) {
    html += '<div class="dice dice-' + dice[i] + '"></div>';
  }
  $('#dice-your').html(html);
}

function showMonsterDice (dice)
{
  var html = '';
  for (var i = 0; i < dice.length; i++) {
    html += '<div class="dice dice-' + dice[i] + '"></div>';
  }
  $('#dice-monster').html(html);
}


function statClicked (e, stat)
{
  var elH = e.srcElement.clientHeight;
  var clickedY = e.offsetY;
  if (clickedY >= (elH / 2)) {
    if (hero[stat] > 0) { hero[stat]--; }
  } else {
    hero[stat]++;
  }
  updateHero();
}


function monsterStatClicked (e, stat)
{
  var elH = e.srcElement.clientHeight;
  var clickedY = e.offsetY;
  if (clickedY >= (elH / 2)) {
    if (monster[stat] > 0) { monster[stat]--; }
  } else {
    monster[stat]++;
  }
  updateMonster();
}


function fightMonster ()
{
  showScratches();
  if (hero.inCombat) {
    hero.inCombat = false;
    $('#fight-bg').hide();
  } else {
    hero.inCombat = true;
    $('#fight-message').html('');
    $('#fight-bg').show();
  }

}


function fightTurn ()
{

  if (hero.stamina == 0 || monster.stamina == 0) { return false; }

  var heroDice = [getDice(), getDice()];
  var monsterDice = [getDice(), getDice()];

  showDice(heroDice);
  showMonsterDice(monsterDice);

  if ((heroDice[0] + heroDice[1] + hero.skill) > (monsterDice[0] + monsterDice[1] + monster.skill)) {
    // you hurt monster
    $('#fight-message').html('You hurt the MONSTER');
    showScratches('monster');
    monster.stamina -= 2;
    if (monster.stamina < 0) { monster.stamina = 0; }
    if (monster.stamina == 0) { monsterDead(); }
    updateMonster();
  } else if ((heroDice[0] + heroDice[1] + hero.skill) < (monsterDice[0] + monsterDice[1] + monster.skill)) {
    // monster hurts you
    $('#fight-message').html('The monster hurt YOU');
    showScratches('hero');
    hero.stamina -= 2;
    if (hero.stamina < 0) { hero.stamina = 0; }
    if (hero.stamina == 0) { heroDead(); }
    updateHero();
  } else if ((heroDice[0] + heroDice[1] + hero.skill) == (monsterDice[0] + monsterDice[1] + monster.skill)) {
    // draw
    $('#fight-message').html('Draw!');
    showScratches();
  }

}


function monsterDead ()
{
  $('#fight-message').html('The monster is dead!');
}


function heroDead ()
{
  $('#you-are-dead').show();
}



function getDice ()
{
  return Math.floor(Math.random() * 6) + 1;
}


function showScratches (ent)
{
  $('#hero-scratches').hide();
  $('#monster-scratches').hide();
  if (ent == 'hero') {
    $('#hero-scratches').show();
  } else if (ent == 'monster') {
    $('#monster-scratches').show();
  }

}



function shuffleMonsterPortrait ()
{
  console.log('SSSS');
  monster.index++;
  if (monster.index > monster.indexImageCount) { monster.index = 1; }
  $('#monster-portrait').css('background-image', "url('img/monster_" + monster.index + ".png')");
}
