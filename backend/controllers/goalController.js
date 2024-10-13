const asyncHandler = require ('express-async-handler')

const Goal = require('../models/goalModel')


// @desc Get Goals
// @route Get / api/goals
const getGoals = asyncHandler(async(req, res) => {

const goals = await Goal.find()

    res.status(200).json(goals)
})


// @desc Post Goals
// @route Post / api/goals
const setGoal = asyncHandler(async(req, res) => {
   
    console.log(req.body.text)

    if(!req.body.text){
        res.status(400).json({message:'please add a text field'})
    }
    else{

        const goal = await Goal.create({
            text: req.body.text
        })
        res.status(200).json(goal)
    }
    
})

// @desc Put Goals
// @route Put / api/goals
const updateGoal = asyncHandler(async(req, res) => {

    const goal = await Goal.findById(req.params.id)

    if(!goal) {
        res.status(400)
        throw new Error('Goal not found')
    } else {
        const updatedGoal = await Goal.findByIdAndUpdate(req.params.id,req.body, {
            new:true,
        })
        res.status(200).json(updatedGoal)
    }

   
    
})

// @desc Delete Goals
// @route Delete / api/goals
const deleteGoal = asyncHandler(async (req, res) => {
    // Attempt to find and delete the goal by its ID
    const goal = await Goal.findByIdAndDelete(req.params.id); // Correct method name

    // If no goal was found, respond with a 404 error
    if (!goal) {
        res.status(404); // Use 404 for not found
        throw new Error('Goal not found');
    }

    // Respond with a success message and the deleted goal ID
    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
}