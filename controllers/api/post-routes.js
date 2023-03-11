const router = require('express').Router();
const { Post, User ,Comment} = require('../../models');
const withAuth = require('../../utils/auth');

// get all posts
router.get('/', (req, res) => {
    Post.findAll({
      attributes: ['id', 'title', 'created_at'],
      order: [['created_at', 'DESC']]
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'title', 'contents','created_at'],
      include: [
         // include the Comment model here:
         {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

//need to add withauth
router.post('/', withAuth, (req, res) => {
    // expects {title: 'Taskmaster goes public!', content: 'blog contents', user_id: 1}
    Post.create({
      title: req.body.title,
      contents: req.body.contents,
      user_id: req.session.user_id
      //user_id : req.body.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

//need to add withauth
router.put('/:id', withAuth,(req, res) => {
    Post.update(
      {
        title: req.body.title,
        contents : req.body.contents
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

//need to add withauth
router.delete('/:id',withAuth, (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;