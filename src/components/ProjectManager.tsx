import React, { useState, useEffect, ChangeEvent } from 'react';
import ProjectService from '../services/ProjectService';
import Project from '../models/Project';
import '../styles/project.css'

const ProjectManager: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProject, setNewProject] = useState<{ name: string, description: string}>({
      name: '',
      description: '',
    });
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    useEffect(() => {
      setProjects(ProjectService.get_projects());
    }, []);

    const handleAddProject = () => {
      const id = Date.now();
      const project = new Project(id, newProject.name, newProject.description)
      ProjectService.add_project(project);
      setProjects(ProjectService.get_projects());
    };

    const handleEditInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (editingProject) {
        const { name, value } = e.target;
        setEditingProject({ ...editingProject, [name]: value });
      }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
  };

  const handleUpdateProject = () => {
    if (editingProject) {
      ProjectService.update_project(editingProject);
      setProjects(ProjectService.get_projects());
      setEditingProject(null);
    }
  };

    const handleDeleteProject = (id: number) => {
      ProjectService.delete_project(id);
      setProjects(ProjectService.get_projects());
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewProject(prevState => ({ ...prevState, [name]: value }));
    };

    return (
      <div>
        <div className="project-info">
          <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={newProject.name}
              onChange={handleInputChange}
          />
          <input
              type="text"
              name="description"
              placeholder="Project Description"
              value={newProject.description}
              onChange={handleInputChange}
          />
          <button className="button" onClick={handleAddProject}>Add Project</button>
        </div>

        {editingProject && (
          <div className="edit-field">
            <h2>Edit Project</h2>
            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={editingProject.name}
              onChange={handleEditInputChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Project Description"
              value={editingProject.description}
              onChange={handleEditInputChange}
            />
            <button className="button" onClick={handleUpdateProject}>Update</button>
            <button className="button" onClick={() => setEditingProject(null)}>Cancel</button>
          </div>
        )}

        {projects.map(project => (
          <div className="project-item" key={project.id}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <button className="button" onClick={() => handleEditProject(project)}>Update</button>
            <button className="button" onClick={() => handleDeleteProject(project.id)}>Delete</button>
          </div>
        ))}
    </div>
  );
};

export default ProjectManager;