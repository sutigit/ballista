import express, { Router } from 'express';
import { type Response } from 'express';
import dotenv from 'dotenv';

// models
import projectModel, { type ProjectModel, ProjectUpdateSchema, ProjectCreateSchema } from '@/controllers/Project';

// middleware
import auth, { type AuthRequest } from '@/middleware/auth';

// Openai
import OpenAIThread from '@/api/openai/classes/Thread';
import OpenAIAssistant from '@/api/openai/classes/Assistant';
import { handleRunProcess, type RunProcessResponse } from '@/api/openai/utils/handleRunProcess';

// Openai types
import { Message } from 'openai/resources/beta/threads';


dotenv.config({ path: '.env.local' });
const projectRouter: Router = express.Router();

interface ProjectResponse {
  success: boolean;
  message: string;
  error: string;
}

interface ProjectGetAllResponse extends ProjectResponse {
  data: ProjectModel[];
}

interface ProjectGetResponse extends ProjectResponse {
  data: ProjectModel | null;
  chat: Message[];
}

interface ProjectCreateResponse extends ProjectResponse {
  data: ProjectModel | null;
}

interface ProjectUpdateResponse extends ProjectResponse {
  data: ProjectModel | null;
  assistantResponse: Message | null;
}

// Initialize OpenAI classes
const threadApi = new OpenAIThread();
const assistantApi = new OpenAIAssistant();

// GET ALL PROJECTS
projectRouter.get('/:userId/projects', auth, async (req: AuthRequest, res: Response<ProjectGetAllResponse>) => {
  try {
    const { userId } = req.params;

    // Ensure the authenticated user matches the user
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view projects.',
        error: 'Authorization Error',
        data: [],
      });
    }

    // Try to fetch all projects
    const projects: ProjectModel[] = await projectModel.findAll(userId);

    // Success
    res.status(200).json({
      success: true,
      message: 'Projects fetched successfully.',
      error: '',
      data: projects,
    });

  } catch (error) {
    console.error('Error fetching all projects:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching all projects.',
      error: 'Internal Server Error. Fetch all projects failed.',
      data: [],
    });
  }
});


// GET PROJECT
projectRouter.get('/:userId/projects/:projectId', auth, async (req: AuthRequest, res: Response<ProjectGetResponse>) => {
  try {
    const { userId, projectId } = req.params;

    // Ensure the authenticated user matches the user
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this project.',
        error: 'Authorization Error',
        data: null,
        chat: [],
      });
    }

    // Try to fetch project
    const project: ProjectModel | null = await projectModel.findById(userId, projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
        error: 'Internal Server Error. Project not found.',
        data: null,
        chat: [],
      });
    }

    // Try to fetch thread messages
    const chat: Message[] | undefined = await threadApi.listMessages(project.threadId, 'asc');
    if (!chat) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching project.',
        error: 'Internal Server Error. Fetching thread messages failed.',
        data: project,
        chat: [],
      });
    }

    // Success
    res.status(200).json({
      success: true,
      message: 'Project fetched successfully.',
      error: '',
      data: project,
      chat,
    });

  } catch (error) {
    console.error('Error fetching project:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching project.',
      error: 'Internal Server Error. Fetch project failed.',
      data: null,
      chat: [],
    });
  }
});



// CREATE A PROJECT
projectRouter.post('/:userId/projects', auth, async (req: AuthRequest, res: Response<ProjectCreateResponse>) => {
  try {
    const { userId } = req.params;
    const { name } = req.body;

    // Ensure the authenticated user matches the user
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to create projects.',
        error: 'Authorization Error',
        data: null,
      });
    }

    // Create a new Thread
    const thread = await threadApi.create();
    const threadId = thread?.id;
    if (!threadId) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred while creating project.',
        error: 'Internal Server Error. Thread creation failed.',
        data: null,
      });
    }

    // Create Data object
    const createData = { name, threadId };

    // Validate createData object
    const validatedData = ProjectCreateSchema.safeParse(createData);
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        message: 'An error occurred while creating project.',
        error: 'Internal Server Error. Create data validation failed.',
        data: null,
      });
    }

    // Create blank project
    const createdProject: ProjectModel = await projectModel.create(userId, validatedData.data);

    // Success
    res.status(200).json({
      success: true,
      message: 'Project created successfully.',
      error: '',
      data: createdProject,
    });

  } catch (error) {
    console.error('Error creating project:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while creating project.',
      error: 'Internal Server Error',
      data: null,
    });
  }
});



// DELETE A PROJECT
projectRouter.delete('/:userId/projects/:projectId', auth, async (req: AuthRequest, res: Response<ProjectResponse>) => {
  try {
    const { userId, projectId } = req.params;

    // Ensure the authenticated user matches the user
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this projects.',
        error: 'Authorization Error',
      });
    }

    // Check if project exists
    const project: ProjectModel | null = await projectModel.findById(userId, projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found.',
        error: 'Internal Server Error. Project not found.',
      });
    }

    // Delete project
    const deletedProject: ProjectModel = await projectModel.delete(userId, projectId);

    // Delete thread
    await threadApi.delete(deletedProject.threadId);

    // Success
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
      error: '',
    });

  } catch (error) {
    console.error('Error deleting project:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting project.',
      error: 'Internal Server Error',
    });
  }
});



// // UPDATE A PROJECT
// projectRouter.patch('/:userId/projects/:projectId', auth, async (req: AuthRequest, res: Response<ProjectUpdateResponse>) => {
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
//     const project: ProjectModel | null = await projectModel.findById(userId, projectId);
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
//     const updatedProject: ProjectModel = await projectModel.update(userId, projectId, validatedUpdateData.data);

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


export default projectRouter;
