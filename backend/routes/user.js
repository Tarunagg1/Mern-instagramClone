const router = require('express').Router();
const validatetoken = require('../middleware/validateToken');
const postModal = require('../modals/post');
const userModal = require('../modals/user');

router.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModal.findById(id).select("-password");
        if (user) {
            const posts = await postModal.find({ postedby: id }).populate("postedby", "_id name");
            return res.status(200).json({ user, posts });
        }
    } catch (error) {
        return res.status(422).json({ message: "Something went wrong", error })
    }
})

router.put('/follow', validatetoken, async (req, res) => {
    const { followid } = req.body;
    try {
        const followers = await userModal.findByIdAndUpdate(followid, {
            $push: {
                followers: req.user._id
            }
        }, { new: true }).select("-password");

        const following = await userModal.findByIdAndUpdate(req.user._id, {
            $push: {
                following: followid
            }
        }, { new: true }).select("-password")
        return res.status(200).json({ message: "follow done", followers, following });
    } catch (error) {
        return res.status(422).json({ message: "Something went wrong", error })
    }
})

router.put('/unfollow', validatetoken, async (req, res) => {
    const { followid } = req.body;
    try {
        const followers = await userModal.findByIdAndUpdate(followid, {
            $pull: {
                followers: req.user._id
            }
        }, { new: true }).select("-password");

        const following = await userModal.findByIdAndUpdate(req.user._id, {
            $pull: {
                following: followid
            }
        }, { new: true }).select("-password")
        return res.status(200).json({ message: "follow done", followers, following });

    } catch (error) {
        return res.status(422).json({ message: "Something went wrong", error })
    }
})





module.exports = router;