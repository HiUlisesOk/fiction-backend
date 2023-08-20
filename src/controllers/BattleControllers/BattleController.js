// /// =========================================================================== ///
// /// =============================== BATTLE CONTROLLER ================================ ///
// /// =========================================================================== ///
//         /| ________________
// O|===|* > ________________/
//         \|

const { Op } = require("sequelize");
const {
  User,
  Post,
  Topic,
  Character,
  CharacterStats,
  Battle,
  BattleStats,
  BattleRounds,
  BattleTurn,
} = require("../../db");
const { generateDateOnly, generateDateTime } = require("../../utils/date");
const bcrypt = require("bcrypt");
const { uploadImage } = require("../imagesControllers");
const { rollDice } = require("../../utils/rollDice");

/// <=============== controller getAllCharacters ===============>
async function startBattle(CharID, objectiveID, actionType) {
  // console.log('CharID', CharID, 'StatsID', StatsID)
  if (!CharID) throw new Error("El CharID no es válido o no existe.");

  const character = await Character.findByPk(CharID);
  const charStats = await character.getCharacterStat();

  // console.log('character', character, 'charStats', charStats)

  if (!character) throw new Error("El character no es válido o no existe.");
  if (!charStats) throw new Error("El charStats no es válido o no existe.");



  const battleStats = await BattleStats.create({
    charID: CharID,
    charName: character.name,
    level: charStats.level,
    diceName: charStats.diceName,
    diceID: charStats.diceID,
    diceValue: charStats.diceValue,
    EXP: charStats.EXP,
    HP: charStats.HP,
    STR: charStats.STR,
    AGI: charStats.AGI,
    INT: charStats.INT,
    RES: charStats.RES,
    CHARM: charStats.CHARM,
    WIS: charStats.WIS,
  });

  // console.log('battleStats', battleStats)

  if (!battleStats) throw new Error("El battleStats no es válido o no existe.");

  const battle = await Battle.create({
    Chars: [CharID],
    WinnerID: null,
    LoserID: null,
  });

  if (!battle) throw new Error("El battle no es válido o no existe.");

  const round = await BattleRounds.create({
    Characters: [CharID],
    WinnerID: null,
  });

  //  console.log('round', round)

  if (!round) throw new Error("El round no es válido o no existe.");


  const battleRound = await BattleRounds.create({
    BattleID: battle.ID,
    Characters: [CharID],
    WinnerID: null,
  });

  if (!battleRound) throw new Error("El battleRound no es válido o no existe.");


  // Asociaciones
  await battleStats.setCharacter(character);
  await battleStats.setBattle(battle);

  await battle.addCharacters(character);
  await battle.addBattleStat(battleStats);
  await battle.addBattleRound(battleRound);

  await battleRound.setBattle(battle);
  await battleRound.addBattleStat(battleStats);



  const BattleID = battle.ID;

  const battleTurn = await takeTurn(CharID, BattleID, actionType, 0, objectiveID, 1);

  if (!battleTurn || !BattleID) throw new Error("El battleTurn no es válido o no existe.");

  // await battleRound.addBattleTurn(battleTurn);

  // console.log(await battle.getCharacters())
  return { battle, battleTurn };

}

async function takeTurn(CharID, BattleID, actionType, actionType2, objectiveID, isFirstTurn = 0) {
  // Validar los parámetros de entrada
  if ((Number(actionType) === 1 || Number(actionType) === 2 || Number(actionType) === 4) && CharID === objectiveID) throw new Error("No puedes atacarte a ti mismo.");
  if ((Number(actionType2) === 1 || Number(actionType2) === 2 || Number(actionType2) === 4) && CharID === objectiveID) throw new Error("No puedes atacarte a ti mismo.");
  if (!CharID) throw new Error("El CharID no es válido o no existe.");
  if (!actionType) throw new Error("El action 1 no existe.");
  if (!objectiveID) throw new Error("El objectiveID no es válido o no existe.");

  // Definir los tipos de acción válidos
  const battleActions = { ATK: 1, DEF: 2, HEAL: 3, ILU: 4, SKIP: 5 };

  // Verificar que el tipo de acción sea válido
  let isValidAction = false;
  let isValidAction2 = false;

  for (let action in battleActions) {
    if (actionType == battleActions[action]) {
      isValidAction = true;
    }
    if (actionType2 && actionType2 == battleActions[action]) {
      isValidAction2 = true;
    }
  }
  if (isValidAction === false) throw new Error("El actionType no es válido o no existe.");
  if (actionType2 && isValidAction2 === false) throw new Error("El actionType no es válido o no existe.");

  // Verificar si el personaje existe y si la batalla está en curso
  const character = await Character.findByPk(CharID);
  if (!character) throw new Error("El personaje no es válido o no existe.");

  const battle = await Battle.findOne({
    where: {
      ID: BattleID,
      WinnerID: null, // Verificar que la batalla esté en curso y no haya ganador
    },
  });


  if (!battle) throw new Error("No hay ninguna batalla en curso con ese ID o la batalla ya ha finalizado y se ha declarado un ganador.");

  //Si el personaje no está en la batalla, lo incluimos
  const CharIsInBattle = await battle.Chars;

  if (!CharIsInBattle.includes(Number(CharID))) battle.update({ Chars: [...CharIsInBattle, Number(CharID)] });
  console.log('CharIsInBattle', await battle.Chars);
  // Obtener la ronda actual (Las rondas están en desuso actualmente y no cumplen función alguna)
  const battleRound = await BattleRounds.findOne({
    where: {
      BattleID: battle.ID,
    },
  });

  if (!battleRound) throw new Error("No hay ninguna ronda en curso.");

  const charStats = await character.getCharacterStat();
  // Obtener las estadísticas del personaje en esta batalla en particular
  const [battleStats, created] = await BattleStats.findOrCreate({
    where: {
      charID: CharID,
      BattleID: BattleID,
    }
    ,
    defaults: {
      charName: character.name,
      level: charStats.level,
      diceName: charStats.diceName,
      diceID: charStats.diceID,
      diceValue: charStats.diceValue,
      EXP: charStats.EXP,
      HP: charStats.HP,
      STR: charStats.STR,
      AGI: charStats.AGI,
      INT: charStats.INT,
      RES: charStats.RES,
      CHARM: charStats.CHARM,
      WIS: charStats.WIS,
    },
  });

  // The `battleStats` variable will now contain the found or created BattleStats record.
  // The `created` variable will be a boolean indicating if a new record was created or not.



  if (!battleStats) throw new Error("No se encontraron las estadísticas del personaje en esta batalla.");

  //Comprobamos si fuimos atacados en el turno anterior
  const opponentTurn = !isFirstTurn ? await BattleTurn.findOne({
    where: {
      objectiveID: [CharID],
      BattleID: BattleID,
      TurnResolved: false,
      CharID: { [Op.ne]: CharID },
    },
  }) : null;

  //Buscamos el número de turnos que lleva el personaje actualmente
  //(Sin contar el turno actual)
  const turnsLength = await BattleTurn.findAll({
    where: {
      CharID: CharID,
      BattleID: BattleID,
    }
  });
  //Buscamos los datos del turno anterior
  const lastTurn = await BattleTurn.findOne({
    where: {
      CharID: CharID,
      BattleID: BattleID,
      TurnResolved: true,
      TurnNumber: turnsLength.length,
    },
  });

  const prevHP = !lastTurn ? battleStats.HP : await lastTurn?.currentHP;
  // Simulación de la acción del personaje 
  // const battleActions = { ATK: 1, DEF: 2, HEAL: 3, ILU: 4, SKIP: 5 }
  let turnAction = { atk: 0, def: 0, heal: 0, ilu: 0, DEFAULT: false };
  switch (Number(actionType)) {
    case battleActions.ATK:
      turnAction = { ...turnAction, atk: battleStats.AGI * rollDice(battleStats.diceValue) + battleStats.STR };
      // console.log('actionType: ', actionType, battleActions, turnAction)
      break;
    case battleActions.DEF:
      if (opponentTurn?.atk === null || opponentTurn?.atk === undefined || opponentTurn?.atk === false || !opponentTurn?.atk) { turnAction = { ...turnAction, def: 0 }; }
      else {
        turnAction = { ...turnAction, def: battleStats.RES + rollDice(battleStats.diceValue) };
      }

      break;
    case battleActions.HEAL:
      turnAction = { ...turnAction, heal: battleStats.WIS + battleStats.RES + rollDice(battleStats.diceValue) + battleStats.INT };
      console.log('actionType: ', actionType, battleActions, turnAction, 'battleStats.HEAL ====>', battleStats);
      break;
    case battleActions.ILU:
      turnAction = { ...turnAction, ilu: battleStats.WIS + battleStats.CHARM + rollDice(battleStats.diceValue) + battleStats.INT };
      // console.log('actionType: ', actionType, battleActions, turnAction)
      break;
    case battleActions.SKIP:
      return true;
    default:
      turnAction = { ...turnAction, DEFAULT: true };
      // console.log('actionType: ', actionType, battleActions, turnAction)
      return "El personaje no ha realizado ninguna acción.";
  }

  let turnAction2 = { atk: 0, def: 0, heal: 0, ilu: 0, DEFAULT: false };

  switch (Number(actionType2)) {
    case battleActions.ATK:
      turnAction2 = { ...turnAction2, atk: battleStats.AGI * rollDice(battleStats.diceValue) + battleStats.STR };
      // console.log('actionType2: ', actionType2, battleActions, turnAction2)
      break;
    case battleActions.DEF:
      if (opponentTurn?.atk === null || opponentTurn?.atk === undefined || opponentTurn?.atk === false || !opponentTurn?.atk) { turnAction2 = { ...turnAction2, def: 0 }; }
      else {
        turnAction2 = { ...turnAction2, def: battleStats.RES + rollDice(battleStats.diceValue) };
      }

      break;
    case battleActions.HEAL:
      turnAction2 = { ...turnAction2, heal: battleStats.WIS + battleStats.RES + rollDice(battleStats.diceValue) + battleStats.INT };
      console.log('actionType2: ', actionType2, battleActions, turnAction2, 'battleStats.HEAL ====>', battleStats);
      break;
    case battleActions.ILU:
      turnAction2 = { ...turnAction2, ilu: battleStats.WIS + battleStats.CHARM + rollDice(battleStats.diceValue) + battleStats.INT };
      // console.log('actionType2: ', actionType2, battleActions, turnAction2)
      break;
    case battleActions.SKIP:
      break;
    default:
      break;
  }

  if (turnAction.SKIP) throw new Error("El personaje se ha saltado el turno.");
  if (turnAction.DEFAULT) throw new Error("El personaje no ha realizado ninguna acción.");


  //Calculamos el HP actual del personaje
  const calculateDamage = (opponentTurn?.atk || 0) - (turnAction?.def || 0) - (turnAction2?.def || 0);
  let newHp = prevHP - (calculateDamage >= 0 ? calculateDamage : 0) - (opponentTurn?.counter ? opponentTurn?.counter : 0);

  const selfHeal = turnAction?.heal + turnAction2?.heal || 0; // turnAction.heal es la cantidad de curación que se realiza en el turno.
  newHp += selfHeal; // Sumamos la curación al HP actual del personaje.
  newHp = Math.min(newHp, battleStats.HP); // Si el HP actual es mayor que el HP máximo, lo igualamos al HP máximo.
  newHp = Math.max(newHp, 0); // Si el HP actual es menor que 0, lo igualamos a 0.

  //Calculamos el ataque actual del personaje (El ataque es la suma de las propiedades atk de los dos actions)
  //Se asume que uno de los dos actions es 0, por lo que no se suma.
  // Además, si el ataque del oponente es menor que la defensa del personaje, se suma la diferencia entre la defensa del personaje y el ataque del oponente.
  const newDef = turnAction?.def + turnAction2?.def;
  const newCounter = opponentTurn?.atk < newDef ? newDef - opponentTurn?.atk : 0;
  const newAtk = turnAction?.atk + turnAction2?.atk;
  const newHeal = turnAction?.heal + turnAction2?.heal;
  const newIlu = turnAction?.ilu + turnAction2?.ilu;
  console.log('PrevHP: ', prevHP, 'NewHP: ', newHp, 'opponentTurnAtk: ', opponentTurn?.atk, 'turnAction: ', newDef, newAtk, newHeal, newIlu);

  const battleTurn = await BattleTurn.create({
    CharID: CharID,
    objectiveID: [objectiveID],
    TurnResolved: false,
    TurnNumber: turnsLength.length + 1,
    previusHP: prevHP,
    currentHP: newHp,
    atk: newAtk || 0,
    def: newDef || 0,
    heal: newHeal || 0,
    ilu: newIlu || 0,
    counter: newCounter || 0,
  });

  if (!battleTurn) throw new Error("No hay ningún turno en curso.");
  if (opponentTurn) BattleTurn.update(
    { TurnResolved: true }, // Los campos y sus nuevos valores a actualizar
    {
      where: {
        ID: opponentTurn.ID,
        objectiveID: [CharID],
        BattleID: BattleID,
        TurnResolved: false, // La condición para encontrar el turno a actualizar
      }
    }
  );
  console.log('battleTurn.currentHP', battleTurn.currentHP, 'battleStats.HP', battleStats.HP, 'newHp', newHp);
  // Comprobamos si el personaje ha muerto
  if (battleTurn.currentHP <= 0) {
    battleTurn.update(
      { TurnResolved: true }, // Los campos y sus nuevos valores a actualizar
      {
        where: {
          ID: battleTurn.ID,
          objectiveID: [CharID],
          BattleID: BattleID,
          TurnResolved: false, // La condición para encontrar el turno a actualizar
        }
      }
    );
    battle.update(
      { WinnerID: objectiveID, LoserID: CharID }, // Los campos y sus nuevos valores a actualizar
      {
        where: {
          ID: BattleID,
          WinnerID: null, // La condición para encontrar el turno a actualizar
        }
      }
    );
  }
  // Asociaciones
  await battleRound.addBattleTurn(battleTurn);

  await battleTurn.setBattle(battle);
  await battleTurn.setBattleRound(battleRound);
  await battleTurn.setCharacter(character);
  await battleTurn.setBattleStat(battleStats);

  // Guardar los cambios en la base de datos
  await battleTurn.save();
  await battleRound.save();
  await battle.save();

  // Devolver el resultado de la acción de ataque y el estado actual de la batalla
  return {
    opponentTurnAtk: opponentTurn?.atk,
    turnAction: {
      CharID: CharID,
      objectiveID: objectiveID,
      TurnResolved: false,
      TurnNumber: turnsLength.length + 1,
      previusHP: prevHP,
      currentHP: newHp,
      atk: newAtk || 0,
      def: newDef || 0,
      heal: newHeal || 0,
      ilu: newIlu || 0,
      counter: newCounter || 0,
      action1: actionType || '',
      action2: actionType2 || '',
    },
  };
}

async function getAllBattles() {
  const allBattles = await Battle.findAll();

  if (!allBattles) throw new Error('No hay batallas registradas.');

  return allBattles;
}

async function getBattleById(id) {
  const BattleById = await Battle.findOne({ where: { ID: id }, include: [BattleStats] });

  if (!BattleById) throw new Error('La batalla no existe o no pudo ser econtrada.');

  return BattleById;
}

async function getBattleStatsById(id) {
  const battleStats = await BattleStats.findByPk(id);

  if (!battleStats) throw new Error('Las estadísticas de batalla no existen o no pudieron ser econtradas.');

  return battleStats;
}

async function getBattleByCharacterId(id) {
  const battleStats = await battleStats.findOne({ where: { charID: id } });

  if (!battleStats) throw new Error('Las estadísticas de batalla no existen o no pudieron ser econtradas con este id.');

  return battleStats;
}


module.exports = {
  startBattle,
  takeTurn,
  getAllBattles,
  getBattleById,
  getBattleStatsById,
  getBattleByCharacterId,
};
