const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/tasks', auth , async (req,res)=>{
    const tasksList = new Task({
      ...req.body,
      owner : req.user._id
    })
    try {
    await tasksList.save()
    res.status(200).send(tasksList)
    }
    catch(e){
      res.status(401).send(e)
    }
})
// for filtering,paginating and sorting out the data
//Get tasks?completed=true 
//Get tasks?limit=2&skip=2
//Get tasks?sortBy=CreatedAt_ascordesc
router.get('/tasks',auth,async (req,res)=>{
  const sort = {}
  const match = {owner : req.user._id}
  if(req.query.completed){
     match.completed = req.query.completed === 'true'
  }
  if(req.query.sortBy){
    const parts = req.query.sortBy.split('_')
    sort[parts[0]] = parts[1]
  }
  try {
    const task = await Task.find(match).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip)).sort(sort)
    res.status(200).send(task)
  } 
  catch(e){
    res.send(e)
  } 
})

//all codes revolves around try and catch

router.get('/tasks/:id',auth,async (req,res)=>{
  const _id = req.params.id  
  
   try{
    const task = await Task.findOne({_id , owner:req.user._id })
   if(!task){
    return res.status(400).send()
    } 
     res.status(200).send(task)
   }
   catch(e){
      res.status(400).send(e)
   }
})

router.patch('/tasks/:id' , auth , async (req,res)=>{
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description','completed']
  const isValidUpdateTask = updates.every((update)=>allowedUpdates.includes(update))
  if(!isValidUpdateTask){
   return res.status(400).send({error : 'Invalid update'})
  }
  try {
    const task = await Task.findOne({_id:req.params.id,owner:req.user._id})

   if(!task){
   return res.status(400).send()
   }
   updates.forEach((update)=> task[update] = req.body[update])
   await task.save()
   res.send(task)
  }
  catch(e){
    res.status(500).send()
  }
})

router.delete('/tasks/:id' , auth , async (req,res)=>{
    try {
    const deleteElement = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
    if(!deleteElement){
      return res.status(400).send()
    }
    res.send(deleteElement)
   }
   catch(e){
    res.status(500).send()
   }
  })

module.exports = router