import userMiddleware from '../middlewares/user';
import { Request, Response, Router } from 'express';

import authMiddleware from '../middlewares/auth';
import Sub from '../entities/Sub';
import Post from '../entities/Post';
import Comment from '../entities/Comment';

const getPosts = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const perPage: number = (req.query.count || 8) as number;

  try {
    const posts = await Post.find({
      order: { createdAt: 'DESC' },
      relations: ['sub', 'votes', 'comments'],
      skip: currentPage * perPage,
      take: perPage,
    });

    if (res.locals.user) {
      posts.forEach((p) => p.setUserVote(res.locals.user));
    }

    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: '문제가 발생했습니다.' });
  }
};

const router = Router();

router.get('/', userMiddleware, getPosts);

export default router;
