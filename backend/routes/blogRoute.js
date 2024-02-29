const { CreateBlog, UpdateBlog, AllBlogs, SingleBlog, BlogsFromUser, DeleteBlog, CommentOnBlog, LikeBlogs, DislikeBlogs, LikeAndDislikeBlog, ViewUserAndBlogs } = require('../controllers/blogController')
const { UserMiddleware } = require('../middleware/auth')

const router = require('express').Router()

router.post('/create-blog', UserMiddleware, CreateBlog)
router.put('/update-blog', UserMiddleware, UpdateBlog)
router.get('/all', AllBlogs)
router.get('/single/:id', SingleBlog)
router.get('/user', UserMiddleware, BlogsFromUser)
router.post('/delete', UserMiddleware, DeleteBlog)

router.post('/togs', UserMiddleware, LikeAndDislikeBlog)
router.get('/user-blogs/:userid', ViewUserAndBlogs)


router.post('/comment/add', UserMiddleware, CommentOnBlog)


module.exports = router