const express = require("express");
const router = express.Router();
const User = require("../models/candidate");
const { jwtAuthMiddleware, generateToken } = require("../jwt");
const Candidate = require("../models/candidate");

//check admin role

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      return { error: "User not found" };
    }
    if (user.role === "admin") {
      return true;
    }
    return false;
  } catch (err) {
    return { error: "Error checking admin role" };
  }
};

// const checkAdminRole = async(userID) => {
//     try{
//         const user = await User.findById(userID);
//        if(user.role === "admin")
//             return true;
//     }catch(err){
//         return false;
//     }
// }

//POST route to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: " user is not an admin" });

    const data = req.body; // Assuming the request body contains the User data

    // Create a new candidate document using the Mongoose model
    const newCandidate = new Candidate(data);

    // Save the new user to the database
    const response = await newCandidate.save();
    console.log("data saved");
    res.status(200).json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    //check admin
    if (!awaitcheckAdminRole(req.user.id))
      return res.status(403).json({ message: "user is not an admin" });

    const candidateID = req.params.id; // Extract the id from the URL parameter
    const updatedCandidateData = req.body; // Updated data for the candidate

    const response = await Person.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validation
      }
    );

    if (!response) {
      return res.status(403).json({ error: "candidate not found" });
    }

    console.log("candidate data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:candidateID", jwtAuthMiddleware, async (req, res) => {
  try {
    //check admin
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "user is not an admin" });

    const candidateID = req.params.id; // Extract the id from the URL parameter

    const response = await Person.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(403).json({ error: "candidate not found" });
    }

    console.log("candidate data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Post to add vote
router.post("/vote/:candidateID".jwtAuthMiddleware, async (req, res) => {
  //no admin can vote
  //users can only vote
  candidateID = req.params.candidateID;
  userId = req.user.id;

  try {
    //find candidate with a specified candidateID
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found" });
    }
    //find user with a specified userID
    const user = await User.findById((userId));
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    if (user.isVoted) {
      return res.status(400).json({ error: "user has already voted" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ error: "admin cannot vote" });
    }

    // Update the vote count for the candidate
    candidate.votes.push({ user: userId});
    candidate.voteCount++;
    await candidate.save();

    // Update the isVoted field for the user
    user.isVoted = true;
    await user.save();

    return res.status(200).json({ message: 'Vote recorded successfully' });
    
  } catch (error) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;