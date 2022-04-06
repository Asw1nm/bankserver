const express = require('express')

const dataService = require('./services/data.service')
const jwt= require('jsonwebtoken')

const cors = require('cors')

const app = express()

app.use(cors({
    origin:'http://localhost:4200'
}))

app.use(express.json())

// app.get('/',(req,res)=>{
//      res.status(401).send("its a get method")
// })

// app.post('/',(req,res)=>{
//     res.send("its a post method")
// })

// app.put('/',(req,res)=>{
//     res.send("its a put method")
// })

// app.patch('/',(req,res)=>{
//     res.send("its a patch method")
// })

// app.delete('/',(req,res)=>{
//     res.send("its a delete method")
// })

const appMiddleware = (req,res,next)=>{
    console.log("Application specific middleware")
    next()
}

app.use(appMiddleware)

const jwtMiddleware = (req,res,next)=>{
    try{
       const token = req.headers["x-access-token"]
       const data = jwt.verify(token,'supersecretkey123')
       req.currentAcno= data.currentAcno
       next()
    }
    catch{
        res.status(422).json({
            statusCode:422,
            status:false,
            message:"please log in"
        })
    }
}


app.post('/register',(req,res)=>{
     dataService.register(req.body.acno,req.body.password,req.body.uname)
     .then(result=>{
        res.status(result.statusCode).json(result)
     })
})

app.post('/login',(req,res)=>{
    dataService.login(req.body.acno,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result)
     })
})

app.post('/deposit',jwtMiddleware,(req,res)=>{
    dataService.deposit(req.body.acno,req.body.password,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
     })
})

app.post('/withdraw',jwtMiddleware,(req,res)=>{
    dataService.withdraw(req,req.body.acno,req.body.password,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
     })
})

app.post('/transaction',jwtMiddleware,(req,res)=>{
    dataService.getTransaction(req.body.acno,req.body.password,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
     })
})

app.delete('/deleteAcc/:acountNo',jwtMiddleware,(req,res)=>{
    dataService.deleteAcc(req.params.acountNo)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})

app.listen(3000,()=>{
    console.log("server start at port no:3000");
})

