const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');


//POST route to add a User
router.post('/signup', async (req, res) =>{
    try{
        const data = req.body // Assuming the request body contains the User data

  // Create a new User document using the Mongoose model
        const newUser = new User(data);

        // Save the new user to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);

        res.status(200).json({response: response, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// Login Route
router.post('/login', async(req, res) => {
    try{
        // Extract aadhaarcardNumber and password from request body
        const {aadhaarcardnumber, password} = req.body;

        // Find the user by aadhaarcardNumber
        const user = await User.findOne({aadhaarcardnumber: aadhaarcardnumber});

        // If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // generate Token 
        const payload = {
            id: user.id,
        }
        const token = generateToken(payload);

        // resturn token as response
        res.json({token})
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await user.findById(userId);

        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.put('/profile/password', async (req, res)=>{
    try{
        const userId = req.user.id; // Extract the id from the token
        const {currentPassword, newPassword} = req.body; // Extract the current and new password from the request body

        // Find the user by id
        const user = await User.findById(userId);

         // If password does not match, return error
        if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // Update the password
        user.password = newPassword;
        await user.save();

        console.log('data updated');
        res.status(200).json(message, "Password updated successfully");
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.get('/find-duplicate', async (req, res) => {
  try {
    const email = "duplicate-email@example.com";
    const duplicateUser = await User.findOne({ email });
    if (duplicateUser) {
      return res.json(duplicateUser);
    }
    return res.status(404).json({ message: 'No duplicate user found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;