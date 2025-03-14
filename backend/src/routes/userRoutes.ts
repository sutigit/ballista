import express, { Router } from 'express';
import type { Response, Request } from 'express';

// models
import userModel, { type UserModelType } from '@/controllers/User';

// middleware
import auth, { type AuthRequest } from '@/middleware/auth';

const userRouter: Router = express.Router();

interface UserResponse {
  success: boolean;
  message: string;
  data: UserModelType | null;
  error: string;
}

interface UsersResponse {
  success: boolean;
  message: string;
  data: UserModelType[];
  error: string;
}

// GET ALL USERS
userRouter.get('/', async (_, res: Response<UsersResponse>) => {
  try {
    const users: UserModelType[] = await userModel.findAll();

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully.',
      data: users,
      error: '',
    });

  } catch (error) {
    console.error('Error fetching all users:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching all users.',
      data: [],
      error: 'Internal Server Error',
    });
  }
});

// GET A SPECIFIC USER
userRouter.get('/:userId', async (req: Request, res: Response<UserResponse>) => {
  try {
    const { userId }  = req.params;

    const user: UserModelType | null = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found.`,
        data: null,
        error: 'Not Found',
      });
    }

    res.status(200).json({
      success: true,
      message: `User with ID ${userId} fetched successfully.`,
      data: user,
      error: '',
    });

  } catch (error) {
    console.error('Error fetching user:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the user.',
      data: null,
      error: 'Internal Server Error',
    });
  }
});


// DELETE A USER
userRouter.delete('/:userId', auth, async (req: AuthRequest, res: Response<UserResponse>) => {
  try {
    const { userId }  = req.params;

    // Ensure the authenticated user matches the user being deleted
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this user.',
        data: null,
        error: 'Forbidden',
      });
    }

    // Check if the user exists
    const user: UserModelType | null = await userModel.findById(userId); 

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${userId} not found.`,
        data: null,
        error: 'Not Found',
      });
    }

    // Delete the user
    await userModel.delete(userId);

    // Success
    res.status(200).json({
      success: true,
      message: `User with ID ${userId} deleted successfully.`,
      data: user,
      error: '',
    });
    
  } catch (error) {
    console.error('Error deleting user:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the user.',
      data: null,
      error: 'Internal Server Error',
    });
  }
});


// UPDATE A USER (PATCH)
// userRouter.patch('/:userId', (req: Request<{ userId: string }>, res: Response<UserResponse>) => {

// });

export default userRouter;
