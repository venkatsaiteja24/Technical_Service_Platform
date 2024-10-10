const asyncHandler = require ('express-async-handler')

// @desc Get Goals
// @route Get / api/goals
const getGoals = asyncHandler(async(req, res) => {
    res.status(200).json({message:"get goals"})
})

// @desc Post Goals
// @route Post / api/goals
const setGoal = asyncHandler(async(req, res) => {
   
    console.log(req.body.text)

    if(!req.body.text){
        res.status(400).json({message:'please add a text field'})
    }
    else{
        res.status(200).json({message:"set goals"})
    }
    
})

// @desc Put Goals
// @route Put / api/goals
const updateGoal = asyncHandler(async(req, res) => {
    res.status(200).json({message:`update goal ${req.params.id}`})
    
})

// @desc Delete Goals
// @route Delete / api/goals
const deleteGoal = asyncHandler(async(req, res) => {
    res.status(200).json({message:`delete goal ${req.params.id}`})
})

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}