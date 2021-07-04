const router = require('express').Router();
const validatetoken = require('../middleware/validateToken');
const postModal = require('../modals/post');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
})
   
var upload = multer({ storage: storage })

router.post('/createpost',upload.single('image'),validatetoken,async (req,res)=>{
    const {title,body} = req.body;
    let image = null;
    if (!title || !body) {
        return res.status(422).json({ error: "Please add all fields" })
    }
    if(req.file){
        image = req.file.filename;
    }
    try {
        const newPost = new postModal({title,body,photo:image,postedby:req.user._id});
        const resp = await newPost.save();
        if(resp){
            return res.status(201).json({ message: "new post created" })   
        }
    } catch (error) {
        console.log(error);
        return res.status(422).json({ error: "Something went wrong" })   
    }
})


router.get('/allpost',validatetoken,async (req,res)=>{
    try {
        const resp = await postModal.find({}).populate("postedby","_id name pic")
        if(resp){
            return res.status(201).json({ message: "all post" ,resp})   
        }
    } catch (error) {
        return res.status(422).json({ error: "Something went wrong" })   
    }
})


router.get('/mypost',validatetoken,async (req,res)=>{
    try {
        const resp = await postModal.find({postedby:req.user._id}).populate("postedby","_id name");
        if(resp){
            return res.status(201).json({ message: "my posts" ,resp})   
        }
    } catch (error) {
        return res.status(422).json({ error: "Something went wrong" })   
    }
})


router.put('/like',validatetoken,async (req,res)=>{
    const {postid} = req.body;
    try {
        const resp = await postModal.findByIdAndUpdate(postid,{
            $push:{
                likes:req.user._id
            }
        },{new:true}).populate("postedby","_id name");

        if(resp){
            return res.status(201).json({ message: "post liked" ,resp})   
        }
    } catch (error) {
        return res.status(422).json({ error: "Something went wrong" })   
    }
})

router.put('/dislike',validatetoken,async (req,res)=>{
    const {postid} = req.body;
    try {
        const resp = await postModal.findByIdAndUpdate(postid,{
            $pull:{
                likes:req.user._id
            }
        },{new:true}).populate("postedby","_id name");

        if(resp){
            return res.status(201).json({ message: "post dislike" ,resp})   
        }
    } catch (error) {
        return res.status(422).json({ error: "Something went wrong" })   
    }
})


router.put('/comment',validatetoken,async (req,res)=>{
    const {postid,text} = req.body;
    
    const comment = {
        text,
        commentedby:req.user._id
    }

    try {
        const resp = await postModal.findByIdAndUpdate(postid,{
            $push:{
                comments:comment
            }
        },{new:true}).populate("comments.commentedby","_id name");

        if(resp){
            return res.status(201).json({ message: "post liked" ,resp})   
        }
    } catch (error) {
        return res.status(422).json({ error: "Something went wrong" })   
    }
})


router.delete('/deletepost/:postid',validatetoken,async (req,res) => {
    try {
        const {postid} = req.params;
        const postget = await postModal.findOne({_id:postid}).populate("postedby","_id");
        console.log(postget);
        if(postget){
            console.log(postget.postedby._id);
            if(postget.postedby._id.toString() === req.user._id.toString()){
                const resp = await postget.remove();
                if(resp){
                    return res.status(201).json({ message: "post deleted",result:resp})   
                }
            }
        }else{
            return res.status(422).json({ message: "No post found try again" })   
        }
    } catch (error) {
        console.log(error);
        return res.status(422).json({ message: "Something went wrong" })   
    }
})


router.post('/getfollowpost',validatetoken,async (req,res)=>{
    const following = req.body.following;
    // console.log(following);
    try {
        const resp = await postModal.find({postedby:{
            $in:following
        }}).populate("postedby","_id name pic")
        // console.log(resp);
        if(resp){
            return res.status(201).json({ message: "all post" ,resp})   
        }
    } catch (error) {
        return res.status(422).json({ error: "Something went wrong" })   
    }
})

module.exports = router;