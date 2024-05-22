import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const post = await Post.find();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    return res.status(200).json(post);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    return res.status(200).json(post);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

   return res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

export const getComments=async(req,res)=>{
  try{
    const {postId}=req.params;
    const comments = await Post.findById(postId,'comments')
    if (!comments) {
      return res.status(404).json({ message: 'Post not found' });
    }
   return res.status(200).json(comments);
  }catch(err){
    return res.status(404).json({ message: err.message });
  }
}
export const addComment = async (req, res) => {
  try {
    const {postId,firstName, comment} = req.body;
    console.log(postId,firstName, comment)
    const newComment={firstName:firstName,commentContent:comment}
    // Ensure userId is provided, fallback to id if not
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {$push:{comments:newComment},
      new:true
      }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;

    // Find the post by its ID and remove the comment with the specified commentId
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(updatedPost);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};