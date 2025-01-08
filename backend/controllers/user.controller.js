import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";

export const getUserProfile = async (req, res) => {
    const {username} = req.params;

    try {
        const user = await User.findOne({username}).select("-password");
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
}

export const followUnfollowUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userToFollow = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({error: "You cannot follow yourself"});
        }

        if (!userToFollow || !currentUser) {
            return res.status(404).json({error: "User not found"});
        }

        const isFollowing = currentUser.following.includes(id);
        
        if (isFollowing) {
            await User.findByIdAndUpdate(id, {
                $pull: {followers: req.user._id}
            });
            await User.findByIdAndUpdate(req.user._id, {
                $pull: {following: id}
            });
            res.status(200).json({message: `You have unfollowed ${userToFollow.username}`});
        } else {
            await User.findByIdAndUpdate(id, {
                $push: {followers: req.user._id}
            });
            await User.findByIdAndUpdate(req.user._id, {
                $push: {following: id}
            });
            const newNotification = new Notification({
                from: req.user._id,
                to: userToFollow._id,
                type: "follow"
            });

            await newNotification.save();

            res.status(200).json({message: `You are now following ${userToFollow.username}`});
        }




    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        const usersFollowedByCurrentUser = await User.findById(userId).select("following");

        const users = await User.aggregate([
            { $match: { _id: { $ne: userId } } },
            { $sample: { size: 10 } }
        ]);

        const filteredUsers = users.filter(user => !usersFollowedByCurrentUser.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 5);
        suggestedUsers.forEach(user => user.password = null);

        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
};

export const updateUser = async (req, res) => {
    const {username, fullName, email, currentPassword, newPassword, bio} = req.body;
    let {profilePicture, coverImage} = req.body;

    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
            return res.status(400).json({error: "Please enter both current password and new password"});
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({error: "Invalid password"});
            }
            if (newPassword.length < 6) {
                return res.status(400).json({error: "Password must be at least 6 characters long"});
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profilePicture) {
            if (user.profilePicture) {
                await cloudinary.uploader.destroy(user.profilePicture.split("/").pop().split(".")[0]);
            }

           const UploadedResponse = await cloudinary.uploader.upload(profilePicture)
           profilePicture = UploadedResponse.secure_url;
        }

        if (coverImage) {
            if (user.coverImage) {
                await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0]);
            }

            const UploadedResponse = await cloudinary.uploader.upload(coverImage)
            coverImage = UploadedResponse.secure_url;
        }

        user.username = username || user.username;
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.profilePicture = profilePicture || user.profilePicture;
        user.coverImage = coverImage || user.coverImage;

        user = await user.save();

        user.password = null;

        return res.status(200).json(user);


    } catch (error) {
        console.log(error.message);
        res.status(500).json({error: error.message});
    }
};