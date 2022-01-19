const Sequelize = require('sequelize')

const sequelize = new Sequelize('mysql://root:@localhost/db_pokemon')

const data = require('./data.json')

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    })


//--------------- GETTERS ----------------////
const getTownId = async function(townName) {
    let result = await sequelize.query(`Select t_id from Town where t_name ="${townName}"`)
    if (result[0].length === 0) {
        console.log(`Town Name ${townName} does not exist`)
            //status code 404
        return undefined;
    }
    return result[0][0].t_id;
}

const getTypeId = async function(typeName) {
    let result = await sequelize.query(`Select ty_id from Pokemon_Type where type ="${typeName}"`)
    if (result[0].length === 0) {
        console.log(`type Name ${typeName} does not exist`)
            //status code 404
        return undefined;
    }
    return result[0][0].ty_id;
}

const getTrainerId = async function(trainerName) {
    let result = await sequelize.query(`Select tr_id from Trainer where tr_name ="${trainerName}"`)
    if (result[0].length === 0) {
        console.log(`Trainer Name ${trainerName} does not exist`)
            //status code 404
        return undefined;
    }
    return result[0][0].tr_id;
}

const PokemonExist = async function(id) {
    let result = await sequelize.query(`Select p_id from Pokemon where p_id ="${id}"`)
    if (result[0].length === 0) {
        console.log(`Pokemon ID ${id} does not exist`)
            //status code 404
        return false;
    }
    return true;
}

//----------------ADDING -----------------////
const addTown = async function(name) {
    let townId = await getTownId(name);
    if (townId != undefined) {
        console.log(`${name} Already Exist in town table with id ${townId}`)
        return;
    }
    await sequelize.query(`INSERT INTO Town VALUES(null,"${name}")`)
        .then(function(result) {
            console.log(`Town ${name} with id ${result[0]} was added successfully to Town table`)
        })
}

const addPokemonType = async function(type) {
    let typeId = await getTypeId(type);
    if (typeId != undefined) {
        console.log(`${type} Already Exist in Pokemon_Type table with id ${typeId}`)
        return;
    }
    await sequelize.query(`INSERT INTO Pokemon_Type VALUES(null,"${type}")`)
        .then(function(result) {
            console.log(`Type ${type} with id ${result[0]} was added successfully to Pokemon_Type table`)
        })
}

const addTrainer = async function(name, townName) {

    let townId = await getTownId(townName);
    if (townId === undefined) return;

    let trainerId = await getTrainerId(name);
    if (trainerId != undefined) {
        console.log(`${name} Already Exist in Trainer table with id ${trainerId}`)
        return;
    }
    await sequelize.query(`INSERT INTO Trainer VALUES(null,"${name}","${townId}")`)
        .then(function(result) {
            console.log(`Trainer with id ${result[0]} was added successfully to Trainer table`)
        })
}

const addPokemon = async function(id, name, height, weight, typeName) {

    let typeId = await getTypeId(typeName);
    if (typeId === undefined) return;

    await sequelize.query(`INSERT INTO Pokemon VALUES(${id},"${name}",${height},${weight},${typeId})`)
        .then(function(result) {
            console.log(`Pokemon with id ${result[0]} was added successfully to Pokemon table`)
        }).catch(function(err) {
            if (err.parent) {
                if (err.parent.errno === 1062) {
                    console.log(`id ${id} Already Exist in Pokemon table`)
                }
            } else {
                console.log(err)
            }
        })
}

const recruitPokemonToTrainer = async function(pokemonId, trainerName) {
    let trainerId = await getTrainerId(trainerName)
    if (trainerId === undefined) return;

    if (!await PokemonExist(pokemonId)) return;

    sequelize.query(`INSERT INTO Pokemon_Trainer VALUES(${pokemonId},${trainerId})`)
        .then(function([result]) {
            console.log(`recruit Pokemon ${pokemonId} to Trainer ${trainerId}-${trainerName}`)
        }).catch(function(err) {
            if (err.parent) {
                if (err.parent.errno === 1062) {
                    console.log(`Already recruited Pokemon ${pokemonId} to Trainer ${trainerId}-${trainerName}`)
                        //status code 503
                }
            } else {
                console.log(err)
            }
        })
}


/// ADDING DATA FROM JSON FILE

const addData = async function(data) {

    for (let pokemon of data) {
        await addPokemonType(pokemon.type);
        await addPokemon(pokemon.id, pokemon.name, pokemon.height, pokemon.weight, pokemon.type);
        for (let owner of pokemon.ownedBy) {
            await addTown(owner.town);
            await addTrainer(owner.name, owner.town);
            await recruitPokemonToTrainer(pokemon.id, owner.name);
        }

    }
}
addData(data)