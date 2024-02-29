// Import required modules and models
const Blog = require('../models').blogs
const User = require('../models').users
const Comment = require('../models').comments
const Like = require('../models').likes
const Dislike = require('../models').dislikes

const fs = require('fs')
const slug = require('slug')
const { ServerError, UserExcludes } = require('../config/ServerUtils')

// Controller function to create a new blog
exports.CreateBlog = async (req, res) => {
    try {
        // Extract title and content from the request body
        const { title, content } = req.body
        if (!title || !content) return res.json({ status: 404, msg: `Incomplete request found` })

        // Make image not compulsory
        const image = req?.files?.image  // null or undefined
        let imageName;
        const slugData = slug(title, '-')
        const filePath = './public/blogs'

        // If an image is provided in the request
        if (image) {
            // Check image size and format
            if (image.size >= 1000000) return res.json({ status: 400, msg: `Cannot upload up to 1MB` })
            if (!image.mimetype.startsWith('image/')) return res.json({ status: 400, msg: `Invalid image format (jpg, jpeg, png, svg, gif, webp)` })

            // Check for the existence of the blog image path
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath)
            }

            // Generate a unique image name based on the blog title and current timestamp
            const date = new Date()
            imageName = `${slugData}-${date.getTime()}.jpg`
        }

        // Create a new blog in the database
        await Blog.create({
            title,
            content,
            slug: slugData,
            image: imageName,
            user: req.user
        })

        // If an image is provided, save it to the specified file path
        if (image) {
            await image.mv(`${filePath}/${imageName}`)
        }

        return res.json({ status: 200, msg: `Blog Created Successfully` })
    } catch (error) {
        ServerError(res, error)
    }
}

// Controller function to update an existing blog
exports.UpdateBlog = async (req, res) => {
    try {
        // Extract title, content, and blog id from the request body
        const { title, content, blogid } = req.body
        if (!title || !content || !blogid) return res.json({ status: 404, msg: `Incomplete request found` })

        // Find the blog in the database by its id
        const blog = await Blog.findOne({ where: { id: blogid } })
        if (!blog) return res.json({ status: 404, msg: 'blog not found' })

        // Check if the user making the request is the owner of the blog
        if (blog.user !== req.user) return res.json({ status: 403, msg: 'You are not authorized to access this information' })

        // Make image not compulsory
        const image = req?.files?.image  // null or undefined
        let imageName;
        const slugData = slug(title, '-')
        const filePath = './public/blogs'
        const currentImagePath = `${filePath}/${blog.image}`

        // If an image is provided in the request
        if (image) {
            // Check image size and format
            if (image.size >= 1000000) return res.json({ status: 400, msg: `Cannot upload up to 1MB` })
            if (!image.mimetype.startsWith('image/')) return res.json({ status: 400, msg: `Invalid image format (jpg, jpeg, png, svg, gif, webp)` })

            // Check for the existence of the current image path and delete it
            if (fs.existsSync(currentImagePath)) {
                fs.unlinkSync(currentImagePath)
            }

            // Check for the existence of the blog image path
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath)
            }

            // Generate a unique image name based on the blog title and current timestamp
            const date = new Date()
            imageName = `${slugData}-${date.getTime()}.jpg`
        } else {
            // If no new image is provided, use the existing image name
            imageName = blog.image
        }

        // Update the blog information in the database
        blog.title = title
        blog.image = imageName
        blog.content = content
        blog.slug = slugData

        await blog.save()

        // If an image is provided, save it to the specified file path
        if (image) {
            await image.mv(`${filePath}/${imageName}`)
        }

        return res.json({ status: 200, msg: `${blog.title}, updated successfully` })
    } catch (error) {
        ServerError(res, error)
    }
}

// Controller function to retrieve all blogs, ordered by creation date
exports.AllBlogs = async (req, res) => {
    try {
        // one to one
        const blogs = await Blog.findAll({
            include: [
                {
                    model: User,
                    as: 'bloguser',
                    attributes: {
                        exclude: UserExcludes
                    }
                },
                { model: Comment, as: 'comment' },
                { model: Like, as: 'blikes' },
                { model: Dislike, as: 'bdislikes' }
            ],

            order: [['createdAt', 'DESC']]
        })
        return res.json({ status: 200, msg: blogs })
    } catch (error) {
        ServerError(res, error)
    }
}

// Controller function to retrieve a single blog by its id
exports.SingleBlog = async (req, res) => {
    try {
        // Extract the blog id from the request parameters
        const { id } = req.params
        if (!id) return res.json({ status: 404, msg: 'Invalid blog id' })
        const blog = await Blog.findOne({
            where: { id },
            include: [
                { model: User, as: 'bloguser' },
                { model: Comment, as: 'comment', include: [{model: User, as: 'cuser'}] },
                { model: Like, as: 'blikes' },
                { model: Dislike, as: 'bdislikes' },
            ]
        })
        if (!blog) return res.json({ status: 404, msg: 'Blog not found' })
        const allcomments = await Comment.findAll({ order: [['createdAt', 'DESC']], include: [{model: User, as: 'cuser'}]  })
        const findBlogComments = allcomments.filter(ele => ele.blog === blog.id)
        const details = {
            blog,
            comments: findBlogComments
        }
        return res.json({ status: 200, msg: details })
    } catch (error) {
        ServerError(res, error)
    }
}

// Controller function to retrieve all blogs created by a specific user, ordered by creation date
exports.BlogsFromUser = async (req, res) => {
    try {
        // Retrieve all blogs from the database created by the authenticated user, ordered by creation date in descending order
        const blogs = await Blog.findAll({
            where: { user: req.user },
            order: [['createdAt', 'DESC']],
            include: [
                { model: Comment, as: 'comment' },
                { model: Like, as: 'blikes' },
                { model: Dislike, as: 'bdislikes' }
            ]
        })

        return res.json({ status: 200, msg: blogs })
    } catch (error) {
        ServerError(res, error)
    }
}


// Controller function to delete a blog
exports.DeleteBlog = async (req, res) => {
    try {
        // Extract the blog id from the request body
        const { blogid } = req.body
        if (!blogid) return res.json({ status: 404, msg: `Blog Id is required` })

        // Find the blog in the database by its id
        const blog = await Blog.findOne({ where: { id: blogid } })
        if (!blog) return res.json({ status: 404, msg: 'Blog not found' })

        // Check if the user making the request is the owner of the blog
        if (blog.user !== req.user) return res.json({ status: 400, msg: 'You are not authorized to process this data' })

        // If the blog has an associated image, delete it from the file system
        const imagePath = `./public/blogs/${blog.image}`
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
        }

        // Delete the blog from the database
        await blog.destroy()

        return res.json({ status: 200, msg: "blog deleted successfully" })

    } catch (error) {
        ServerError(res, error)
    }
}


exports.CommentOnBlog = async (req, res) => {
    try {
        const { blogid, content } = req.body
        if (!blogid || !content) return res.json({ status: 404, msg: 'provide a valid request' })
        await Comment.create({ blog: blogid, content: content, user: req.user })
        return res.json({ status: 200, msg: 'Commented' })
    } catch (error) {
        ServerError(res, error)
    }
}


exports.LikeAndDislikeBlog = async (req, res) => {
    try {
        // enums
        // enums by array
        const tagOptions = [
            'like',
            'dislike'
        ]
        // enums object
        // const tagOptions = {
        //     like: 'like',
        //     dislike: 'dislike',
        // }
        // tag = either be a like or a dislike
        const { blogid, tag } = req.body
        if (!blogid || !tag) return res.json({ status: 404, msg: 'Provide a valid blog' })
        if (!tagOptions.includes(tag)) return res.json({ status: 404, msg: 'Provide a valid action on this request for liking / disliking a blog' })
        const blog = await Blog.findOne({ where: { id: blogid } })
        if (!blog) return res.json({ status: 404, msg: 'Blog not found' })
        // if tag ==== like
        if (tag === tagOptions[0]) {
            const item = await Like.findOne({ where: { blog: blogid, user: req.user } })
            if (!item) {
                // then like this blog
                await Like.create({
                    user: req.user,
                    blog: blog.id
                })
                const checkDislike = await Dislike.findOne({ where: { blog: blogid, user: req.user } })
                if (checkDislike) {
                    await checkDislike.destroy()
                }
            } else {
                // unlike the blog
                await item.destroy()
            }
        }

        if (tag === tagOptions[1]) {
            //if tag === dislike
            const item = await Dislike.findOne({ where: { blog: blogid, user: req.user } })
            if (!item) {
                // no dislikes yet
                await Dislike.create({
                    blog: blog.id,
                    user: req.user
                })
                const checkLike = await Like.findOne({ where: { blog: blogid, user: req.user } })
                if (checkLike) {
                    await checkLike.destroy()
                }
            } else {
                // un dislike
                await item.destroy()
            }
        }

        return res.json({ status: 200, msg: `Blog ${tag}d Successfully` })
    } catch (error) {
        ServerError(res, error)
    }
}

exports.ViewUserAndBlogs = async (req, res) => {
    try {
        const {userid} = req.params 
        if(!userid) return res.json({status: 404, msg: 'Provide a valid user account'})
        const user = await User.findOne({
            where: {id: userid}, 
            attributes: {
                exclude: UserExcludes
            },
            include: [{
                model: Blog, 
                as:'bloguser',
                include: [
                    { model: User, as: 'bloguser' },
                    { model: Comment, as: 'comment', include: [{model: User, as: 'cuser'}] },
                    { model: Like, as: 'blikes' },
                    { model: Dislike, as: 'bdislikes' },
                ]
            }]
        })
        if(!user) return res.json({status: 404, msg: 'Account does not exists'})
        return res.json({status: 200, msg: user})
    } catch (error) {
        ServerError(res, error)
    }
}