const logger = require('../logging/logger')
const uuid4 = require('uuid4')
const Team = require('../models/teams')
const Post = require('../models/posts')

class PostController {
  static async createPost (userId, teamId, postContent) {
    try {
      const team = await Team.findOne({ where: { teamId } })
      if (!team) {
        return {
          error: true,
          message: 'No such team exists',
          code: 404
        }
      }

      const post = {
        postId: uuid4(),
        postContent: postContent,
        userId: userId,
        teamId: teamId
      }

      const newPost = await Post.create(post)
      return {
        error: false,
        message: 'Post Successfully Created',
        code: 201,
        post: newPost
      }
    } catch (err) {
      logger.error('An error occurred' + err)
      return {
        error: true,
        message: 'An Error Occurred' + err,
        code: 500
      }
    }
  }

  static async createMeet (userId, teamId) {
    try {
      const team = await Team.findOne({ where: { teamId } })
      if (!team) {
        return {
          error: true,
          message: 'No such team exists',
          code: 404
        }
      }

      const post = {
        postId: uuid4(),
        postContent: 'A meeting is going on',
        isMeeting: true,
        userId: userId,
        teamId: teamId
      }

      const newPost = await Post.create(post)
      return {
        error: false,
        message: 'Post Successfully Created',
        code: 201,
        post: newPost
      }
    } catch (err) {
      logger.error('An error occurred' + err)
      return {
        error: true,
        message: 'An Error Occurred' + err,
        code: 500
      }
    }
  }

  static async deletePost (userId, postId) {
    try {
      const post = await Post.findOne({ where: { postId } })
      if (!post) {
        return {
          error: true,
          message: 'No such post exists',
          code: 404
        }
      }
      const author = await Post.findOne({ where: { userId: userId } })
      if (!author) {
        return {
          error: true,
          message: 'Only post author can delete a post'
        }
      }
      Post.destroy({
        where: {
          postId: postId
        }
      })
      return {
        error: false,
        message: 'Post Successfully Deleted',
        code: 201
      }
    } catch (err) {
      logger.error('An error occurred' + err)
      return {
        error: true,
        message: 'An Error Occurred' + err,
        code: 500
      }
    }
  }

  static async likePost (postId, increment) {
    try {
      const filter = {
        where: {
          postId: postId
        }
      }
      const exists = await Post.findOne({ where: { postId: postId } })
      if (!exists) {
        return {
          error: true,
          message: 'No such post exists',
          code: 404
        }
      }
      const query = {
        like: +increment
      }
      await Post.increment(query, filter)
      return {
        error: false,
        message: 'Successfully liked post',
        code: 200
      }
    } catch (err) {
      logger.error('An error occurred' + err)
      return {
        error: true,
        message: 'An Error Occurred' + err,
        code: 500
      }
    }
  }

  static async fetchPost (postId) {
    try {
      const query = {
        where: {
          postId: postId
        },
        include:
          [
            {
              all: true
            }
          ]
      }
      const post = await Post.findOne(query)
      if (!post) {
        return {
          error: true,
          message: 'No such post found',
          code: 404
        }
      }
      return {
        error: false,
        message: 'Post details fetched successfully',
        code: 200,
        post: post
      }
    } catch (err) {
      logger.error('An error occurred' + err)
      return {
        error: true,
        message: 'An Error Occurred' + err,
        code: 500
      }
    }
  }
}

module.exports = PostController
