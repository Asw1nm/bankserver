const jwt = require('jsonwebtoken')
const db = require('./db')

database={
    1000:{acno:1000,uname:"Neer",password:1000,balance:5000,transaction:[]},
    1001:{acno:1001,uname:"Vyom",password:1001,balance:5000,transaction:[]},
    1002:{acno:1002,uname:"Laisha",password:1002,balance:5000,transaction:[]}
  }

const register=(acno,password,uname)=>{

    return db.User.findOne({acno})
    .then(user=>{
      if(user){
        return{
          statusCode:422,
          status:false,
          message:"user already exist"
        }
      }
      else{
        const newUser= new db.User({
          acno,
          uname,
          password,
          balance:0,
          transaction:[]
        })
        newUser.save()
        return{
          statusCode:200,
          status:true,
          message:"successfully registered"
        }
      }
    })
    
}

const login=(acno,password)=>{
    
     return db.User.findOne({acno,password})
     .then(user=>{
      if(user){
        currentAcno=acno

         currentUname= user.uname

         const token = jwt.sign({
           currentAcno:acno
         },'supersecretkey123')

         return{
             statusCode:200,
             status:true,
             message:"successfully log in",
             currentAcno,
             currentUname,
             token
         }
      }
      else{
        return{
          statusCode:422,
          status:false,
          message:"incorrect password/account no"
        } 
      }
     })
     
  }

const deposit=(acno,password,amt)=>{
    var amount=parseInt(amt)
    
    return db.User.findOne({acno,password})
    .then(user=>{
      if(user){
        user.balance+=amount
        user.transaction.push({
          amount:amount,
          type:"Credit"
        })
        user.save()
        return{
          statusCode:200,
          status:true,
          message:amount+"successfully deposited and new balance is "+ user.balance
        }
      }
      else{
        return{
          statusCode:422,
          status:false,
          message:"incorrect password/account no"
        } 
      }
    })

  }

const withdraw=(req,acno,password,amt)=>{
    var amount =parseInt(amt)
    var currentAcno=req.currentAcno

  return db.User.findOne({acno,password})
  .then(user=>{
    
    if(user){
      if(currentAcno!=acno){
        return{
          statusCode:422,
          status:false,
          message:"operation denied"
        }
      }
      if(user.balance > amount){
        user.balance-=amount
        user.transaction.push({
          amount:amount,
          type:"debit"
        })
        user.save()
        return{
          statusCode:200,
          status:true,
          message:"successfully debited and new balance is "+ user.balance
        }
      }
      else{
        return{
          statusCode:422,
          status:false,
          message:"insufficient balance"
        }
      }
    }
    else{
      return{
        statusCode:422,
        status:false,
        message:"incorrect password/account no"
      } 
    }
  })

  }

const getTransaction=(acno)=>{

  return db.User.findOne({acno})
  .then(user=>{
    if(user){
      return{
        statusCode:200,
        status:true,
        transaction:user.transaction
      }
    }
    else{
      return{
        statusCode:422,
        status:false,
        message:"user doesnot exist"
      }
    }
  })

}

const deleteAcc =(acountNo)=>{
  return db.User.deleteOne({acountNo})
  .then(user=>{
    if(!user){
      return{
        statusCode:422,
        status:false,
        message:"operation failed"
      }
    }
    return{
      statusCode:200,
      status:true,
      message:"account no"+acountNo+"deleted"
    }
  })
}

module.exports={
    register,
    login,
    deposit,
    withdraw,
    getTransaction,
    deleteAcc
}