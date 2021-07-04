const Router = require('express').Router();
const authModal = require('../modals/user');
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs');
const validatetoken = require('../middleware/validateToken');

Router.get('/', (req, res) => {
    return res.status(200).json("ij")

})

Router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please add all fields" })
    }
    try {
        const isuserExist = await authModal.findOne({ email });
        if (isuserExist) {
            return res.status(422).json({ error: "Email Allready exists" })
        }
        const haspass = await bcryptjs.hash(password, 10);
        const newUser = new authModal({ name, email, password: haspass });
        const resp = await newUser.save();
        if (resp) {
            return res.status(201).json({ message: "user created", resp })
        }
    } catch (error) {
        return res.status(422).json({ error: "Something went wrong" })
    }
})


Router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please add all fields" })
    }
    try {
        const isuserExist = await authModal.findOne({ email });

        if (isuserExist) {
            const ispasswordisvalid = await bcryptjs.compare(password, isuserExist.password);
            if (ispasswordisvalid) {
                const token = jwt.sign({_id:isuserExist._id}, process.env.JWT_SECRET);
                
                const data = {
                    _id:isuserExist._id,
                    name:isuserExist.name,
                    email:isuserExist.email,
                    followers:{followers:isuserExist.followers},
                    following:{following:isuserExist.following}
                    
                }
                
                return res.status(201).json({ message: "Login successfully", token,data })
            } else {
                return res.status(422).json({ error: "Invalid password" })
            }
        } else {
            return res.status(422).json({ error: "Email not exists" })
        }

    } catch (error) {
        console.log(error);
        return res.status(422).json({ error: "Something went wrong" })
    }
})

Router.get('/protected',validatetoken,(req,res)=>{
    return res.status(200).json("oi")
})


Router.get('/myprofile',validatetoken,async (req,res)=>{
    try {
        const resp = await authModal.findById(req.user._id).select("-password");;
        if(resp){
            return res.status(201).json({ message: "my profile" ,resp})   
        }
    } catch (error) {
        return res.status(422).json({ error: "Something went wrong" })   
    }
})



module.exports = Router;