const express   = require('express')
const dotenv    = require('dotenv')
const firebird  = require('node-firebird')

const server    = express()

dotenv.config()
server.use(express.json())

const options = {
    host:       process.env.DB_HOST,
    port:       process.env.DB_PORT,
    database:   process.env.DB_FILE,
    user:       process.env.DB_USER,
    password:   process.env.DB_PWD,
}

server.get('/usuario', (req, res) => {

    firebird.attach(options, (err, db) => {

        if(err) {

            console.log(err)
            res.status(500).json(err)

        } else {

            db.query('SELECT ID, NOME, LOGIN FROM USUARIO', (err, result) => {
                
                if(err) {

                    console.log("ERRO: " + err)
                    return res.status(400).json(err)

                } else {

                    result.forEach(element => {
                        console.log(element)
                    });
   
                    db.detach();
                    return res.status(200).json(result) 
                }

            })

        }

    })

})

server.get('/usuario/:index', (req, res) => {

    const { index } = req.params

    firebird.attach(options, (err, db) => {

        if(err) {

            console.log(err)
            res.status(500).json(err)
    
        } else {
    
            db.query('SELECT ID, NOME, LOGIN, SENHA FROM USUARIO WHERE ID = ?', [index], (err, result) => {
    
                if(err) {

                    console.log("ERRO: " + err)
                    return res.status(400).json(err)

                } else {
    
                    if(result[0]) {

                        result.forEach(element => {
                            console.log(element)
                        });
           
                        db.detach();
                        return res.status(200).json(result)

                    } else {

                        db.detach();
                        return res.status(400).json({"Message": "Usuário não encontrado!"})
                        
                    }
                    
                }
    
            })
    
        }
    })

})

server.post('/usuario', /*checkUserExists,*/ (req, res) => {

    const{ nome, login, senha } = req.body

    firebird.attach(options, (err, db) => {

        if(err) {

            console.log(err)
            res.status(500).json(err)
    
        } else {
    
            db.query('INSERT INTO USUARIO (NOME, LOGIN, SENHA) VALUES (?,?,?) RETURNING ID, NOME, LOGIN', [nome, login, senha], (err, result) => {
    
                if(err) {

                    console.log("ERRO: " + err)
                    return res.status(400).json(err)

                } else {
                    
                    console.log(result)
                    db.detach();
                    return res.status(201).json(result)
                }
    
            })
    
        }
    })

})

server.put('/usuario/:index', (req, res) => {

    const { index }                 = req.params
    const { nome, login, senha }    = req.body

    firebird.attach(options, (err, db) => {

        if(err) {

            console.log(err)
            res.status(500).json(err)
    
        } else {
    
            db.query('UPDATE USUARIO SET NOME=?, LOGIN=?, SENHA=? WHERE ID=? RETURNING ID, NOME, LOGIN, SENHA', [nome, login, senha, index], (err, result) => {
    
                if(err) {

                    console.log("ERRO: " + err)
                    return res.status(400).json(err)

                } else {
                    if(result.ID) {

                        console.log(result)

                        db.detach();
                        return res.status(202).json(result)

                    } else {

                        db.detach();
                        return res.status(400).json({"Message": "Usuário não encontrado!"})

                    }
                    
                }
    
            })
    
        }
    })

})

server.delete('/usuario/:index', (req, res) => {

    const { index } = req.params

    firebird.attach(options, (err, db) => {

        if(err) {

            console.log(err)
            res.status(500).json(err)
    
        } else {
    
            db.query('DELETE FROM USUARIO WHERE ID=? RETURNING ID', [index], (err, result) => {
    
                if(err) {

                    console.log("ERRO: " + err)
                    return res.status(400).json(err)
                    
                } else {
                    
                    console.log(result)
                    db.detach();

                    if(result.ID) {
                        return res.status(202).json({"Message": "Usuário excluído!"})
                    } else {
                        return res.status(400).json({"Message": "Usuário não encontrado!"})
                    }
                    
                }
    
            })
    
        }
    })

})

server.listen(3000)