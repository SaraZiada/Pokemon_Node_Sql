const Sequelize = require('sequelize')

const sequelize = new Sequelize('mysql://root:@localhost/db_pokemon')

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    })

const getHeviestPokemon = function() {
        sequelize.query(`SELECT p_id,p_name 
                    FROM Pokemon 
                    where p_weight=(
                        Select Max(p_weight) 
                        from pokemon)`)
            .then(function([result]) {
                console.log(`Pokemon with id ${result[0].p_id} - name ${result[0].p_name} is the Heviest Pokemon`)
            })
    }
    // getHeviestPokemon()

const findByType = function(typeName) {
        sequelize.query(`Select p_name 
                    From pokemon as p join pokemon_type as pt 
                        on p.type_id = pt.ty_id
                    where pt.type = "${typeName}"`)
            .then(function([result]) {
                let names = result.map(r => r = r.p_name);
                console.log(names)
            })
    }
    // findByType("grass")

const findOwners = function(pokemonName) {
        sequelize.query(`SELECT DISTINCT(t.tr_name)
                    FROM Pokemon as p join pokemon_trainer as pk on p.p_id=pk.p_id join trainer as t on t.tr_id=pk.tr_id
                    where p.p_name="${pokemonName}"`)
            .then(function([result]) {
                let names = result.map(r => r = r.tr_name);
                console.log(names)
            })
    }
    // findOwners("gengar")

const findRoster = function(trainerName) {
        sequelize.query(`SELECT DISTINCT(p.p_name)
    FROM Pokemon as p join pokemon_trainer as pk on p.p_id=pk.p_id join trainer as t on t.tr_id=pk.tr_id
    where t.tr_name="${trainerName}"`)
            .then(function([result]) {
                let names = result.map(r => r = r.p_name);
                console.log(names)
            })
    }
    // findRoster("Loga")

const findMostOwnedPokemon = function() {
    sequelize.query(`SELECT p.p_name, pt.p_id, COUNT(pt.p_id)
    FROM pokemon_trainer as pt join pokemon as p 
        on p.p_id=pt.p_id
    GROUP BY p.p_id
    HAVING COUNT(pt.p_id) >= All
    (SELECT COUNT(p_id)
    FROM pokemon_trainer
    GROUP BY p_id)`)
        .then(function([result]) {
            let names = result.map(r => r = r.p_name);
            console.log(names)
        })
}

// findMostOwnedPokemon()