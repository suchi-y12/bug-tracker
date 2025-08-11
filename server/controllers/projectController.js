import Project from '../models/Project.js';

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  const { name, description } = req.body;

  if (!name) return res.status(400).json({ msg: 'Project name is required' });

  try {
    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id]  // creator is first member
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get all projects for the user
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (creator only)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: 'Project not found' });

    if (project.createdBy.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    await project.deleteOne();
    res.json({ msg: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
