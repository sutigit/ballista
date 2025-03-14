import express, { Router } from 'express';
import { type Response } from 'express';
import dotenv from 'dotenv';

// models
import screenModel,{ type ScreenModel } from '@/controllers/Screen';

// middleware
import auth, { type AuthRequest } from '@/middleware/auth';


dotenv.config({ path: '.env.local' });
const screenRouter: Router = express.Router();

interface ScreenResponse {
  success: boolean;
  message: string;
  error: string;
}

interface ScreenGetAllResponse extends ScreenResponse {
  data: ScreenModel[];
}

interface ScreenGetResponse extends ScreenResponse {
  data: ScreenModel | null;
}


// GET ALL SCREENS
screenRouter.get('/:userId/projects/:projectId/screens', auth, async (req: AuthRequest, res: Response<ScreenGetAllResponse>) => {
  try {
    const { userId, projectId } = req.params;

    // Ensure the authenticated user matches the user
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view screens.',
        error: 'Authorization Error',
        data: [],
      });
    }

    // Try to fetch all screens
    const screens: ScreenModel[] = await screenModel.findAll(projectId);

    // Success
    res.status(200).json({
      success: true,
      message: 'Screens fetched successfully.',
      error: '',
      data: screens,
    });

  } catch (error) {
    console.error('Error fetching all screens:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching all screens.',
      error: 'Internal Server Error. Fetch all screens failed.',
      data: [],
    });
  }
});


// GET SCREEN
screenRouter.get('/:userId/projects/:projectId/screens/:screenId', auth, async (req: AuthRequest, res: Response<ScreenGetResponse>) => {
  try {
    const { userId, projectId, screenId } = req.params;

    // Ensure the authenticated user matches the user
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this screen.',
        error: 'Authorization Error',
        data: null,
      });
    }

    // Try to fetch screen
    const screen: ScreenModel | null = await screenModel.findById(projectId, screenId);
    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found.',
        error: 'Internal Server Error. Screen not found.',
        data: null,
      });
    }

    // Success
    res.status(200).json({
      success: true,
      message: 'Screen fetched successfully.',
      error: '',
      data: screen,
    });

  } catch (error) {
    console.error('Error fetching screen:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching screen.',
      error: 'Internal Server Error. Fetch screen failed.',
      data: null,
    });
  }
});



// CREATE A SCREEN
// screenRouter.post('/:userId/projects/:projectId/screens', auth, async (req: AuthRequest, res: Response<ScreenGetResponse>) => {
//   try {
//     const { userId, projectId } = req.params;
//     const { name } = req.body;

//     // Ensure the authenticated user matches the user
//     if (req.user?.id !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'You are not authorized to create screen.',
//         error: 'Authorization Error',
//         data: null,
//       });
//     }

//     // Create Data object

//     // Validate createData object

//     // Create blank project
//     const createdScreen: ScreenModel = await screenModel.create(userId, validatedData.data);

//     // Success
//     res.status(200).json({
//       success: true,
//       message: 'Screen created successfully.',
//       error: '',
//       data: createdScreen,
//     });

//   } catch (error) {
//     console.error('Error creating screen:', error);

//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while creating screen.',
//       error: 'Internal Server Error',
//       data: null,
//     });
//   }
// });



// DELETE A PROJECT
screenRouter.delete('/:userId/projects/:projectId/screens/:screenId', auth, async (req: AuthRequest, res: Response<ScreenResponse>) => {
  try {
    const { userId, projectId, screenId } = req.params;

    // Ensure the authenticated user matches the user
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this screen.',
        error: 'Authorization Error',
      });
    }

    // Check if project exists
    const screen: ScreenModel | null = await screenModel.findById(projectId, screenId);
    if (!screen) {
      return res.status(404).json({
        success: false,
        message: 'Screen not found.',
        error: 'Internal Server Error. Screen not found.',
      });
    }

    // Delete project
    await screenModel.delete(projectId, screenId);

    // Success
    res.status(200).json({
      success: true,
      message: 'Screen deleted successfully.',
      error: '',
    });

  } catch (error) {
    console.error('Error deleting screen:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting screen.',
      error: 'Internal Server Error',
    });
  }
});



// // UPDATE A PROJECT
// screenRouter.patch('/:userId/projects/:projectId/screens/:projectId', auth, async (req: AuthRequest, res: Response<ProjectUpdateResponse>) => {
//   try {
//     const { userId, projectId } = req.params;
//     const { prompt } = req.body;

//     // Ensure the authenticated user matches the user
//     if (req.user?.id !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'You are not authorized to update this project.',
//         error: 'Authorization Error',
//         data: null,
//         assistantResponse: null,
//       });
//     }

//     // Check if project exists and fetch it
//     const project: ScreenModel | null = await screenModel.findById(userId, projectId);
//     if (!project) {
//       return res.status(404).json({
//         success: false,
//         message: 'Project not found.',
//         error: 'Internal Server Error. Project not found.',
//         data: null,
//         assistantResponse: null,
//       });
//     }

//     // Add layout, theme, and storyContent to Thread
//     const currentLayout = "This is the current layout of the fictional user interface: " + project.layout;
//     const currentTheme = "This is the current theme of the fictional user interface: " + project.theme;
//     const currentStoryContent = "This is the current story content of the ficitonal user interface: " + project.storyContent;
//     const systemInput = `${currentLayout} / ${currentTheme} / ${currentStoryContent}`;
//     await threadApi.addMessage("assistant", systemInput, project.threadId);

//     // Add prompt to Thread
//     await threadApi.addMessage("user", prompt, project.threadId);

//     // Run Thread
//     const run = await threadApi.run(project.threadId, assistantApi.id);
//     if (!run) {
//       return res.status(500).json({
//         success: false,
//         message: 'An error occurred while processing input.',
//         error: 'Internal Server Error. Run failed.',
//         data: null,
//         assistantResponse: null,
//       });
//     }

//     // Handle Thread Run Process
//     const response: RunProcessResponse | undefined = await handleRunProcess(run, project.threadId);
//     if (!response) {
//       return res.status(500).json({
//         success: false,
//         message: 'An error occurred while processing input.',
//         error: 'Internal Server Error. Run Process failed.',
//         data: null,
//         assistantResponse: null,
//       });
//     }

//     // Create updateData object
//     const updateData = {
//       name: project.name,
//       layout: response.project.layout,
//       theme: response.project.theme,
//       storyContent: response.project.storyContent,
//     }

//     // Validate updateData object
//     const validatedUpdateData = ProjectUpdateSchema.safeParse(updateData);
//     if (!validatedUpdateData.success) {
//       return res.status(400).json({
//         success: false,
//         message: 'An error occurred while updating project.',
//         error: 'Internal Server Error. Update data validation failed.',
//         data: null,
//         assistantResponse: null,
//       });
//     }

//     // Update project
//     const updatedProject: ScreenModel = await screenModel.update(userId, projectId, validatedUpdateData.data);

//     // Success
//     res.status(200).json({
//       success: true,
//       message: 'Project updated successfully.',
//       error: '',
//       data: updatedProject,
//       assistantResponse: response.assistantResponse,
//     });

//   } catch (error) {
//     console.error('Error updating project:', error);

//     res.status(500).json({
//       success: false,
//       message: 'An error occurred while updating project.',
//       error: 'Internal Server Error',
//       data: null,
//       assistantResponse: null,
//     });
//   }
// });


export default screenRouter;
