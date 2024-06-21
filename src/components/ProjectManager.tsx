import React, { useState, useEffect, ChangeEvent } from 'react';
import ProjectService from '../services/ProjectService';
import Project from '../models/Project';
import { Story, State, Priority } from '../models/Story';
import '../styles/project.css'
import StoryService from '../services/StoryService';

const ProjectManager: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProject, setActiveProject] = useState<number | null>(ProjectService.get_active());
    const [newProject, setNewProject] = useState<{ name: string, description: string}>({
      name: '',
      description: '',
    });
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [stories, setStories] = useState<Story[]>([]);
    const [newStory, setNewStory] = useState<Partial<Story>>({
      name: '',
      description: '',
      priority: Priority.LOW,
      project: activeProject,
      state: State.TODO,
      created: Date.now(),
      owner: 1,
    });
    const [editingStory, setEditingStory] = useState<Story | null>(null);
    useEffect(() => {
      setStories(StoryService.get_story_by_id(activeProject));
  }, [activeProject]);

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

    // active
    const handleSetActiveProject = (id: number) => {
      setActiveProject(id)
      ProjectService.set_active(id);
    }

    const handleShowAllProjects = () => {
      setActiveProject(null)
      ProjectService.clear_active();
    };

    // stories
    const handleStoryChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (editingStory) setEditingStory(prevState => ({ ...prevState, [name]: value }));
      else setNewStory(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddStory = () => {
      const storyToAdd = new Story(
        Date.now(),
        newStory.name || "",
        newStory.description || "",
        newStory.priority,
        activeProject,
        newStory.created || Date.now(),
        newStory.state,
        newStory.owner || 1,
      );
      StoryService.add_story(storyToAdd);
      setStories(StoryService.get_story_by_id(activeProject));
      setNewStory({
        name: '',
        description: '',
        priority: null,
        project: activeProject,
        created: Date.now(),
        state: null,
        owner: 1,
      });
  };

  const handleDeleteStory = (id: number) => {
    StoryService.delete_story(id);
      setStories(StoryService.get_story_by_id(activeProject));
  };

  const handleUpdateStory = () => {
    if (editingStory) {
        StoryService.update_story(editingStory);
        setStories(StoryService.get_story_by_id(activeProject));
        setEditingStory(null);
    }
};

  const handleEditStory = (story: Story) => {
    setEditingStory(story);
  };


    return (
      <div className="main-container">
        {activeProject === null ? (
        <>
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
            <button className="button" onClick={() => handleSetActiveProject(project.id)}>Set Active</button>
          </div>
        ))}
      </>
      ) : (
        <div>
          
            {projects.filter(project => project.id === activeProject).map(project => (
              <>
              <div key={project.id}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <button className="button" onClick={handleShowAllProjects}>Show All Projects</button>
                <div>
                  <button className="button"  onClick={() => handleEditProject(project)}>Edit</button>
                  <button className="button"  onClick={() => handleDeleteProject(project.id)}>Delete</button>
                  <button className="button"  onClick={() => handleAddStory}>Add Story</button>
                </div>
              </div>
              <div className="story-list">
              <h2>TODO</h2>
              {stories.filter(story => story.state === State.TODO).map(story => (
                  <div key={story.id} className="story-item">
                      <h3>{story.name}</h3>
                      <p>{story.description}</p>
                      <p>State: {story.state}</p>
                      <p>priority: {story.priority}</p>
                      <button onClick={() => handleEditStory(story)}>Edit</button>
                      <button onClick={() => handleDeleteStory(story.id)}>Delete</button>
                  </div>
              ))}
              <h2>DOING</h2>
              {stories.filter(story => story.state === State.DOING).map(story => (
                  <div key={story.id} className="story-item">
                      <h3>{story.name}</h3>
                      <p>{story.description}</p>
                      <p>State: {story.state}</p>
                      <p>priority: {story.priority}</p>
                      <button onClick={() => handleEditStory(story)}>Edit</button>
                      <button onClick={() => handleDeleteStory(story.id)}>Delete</button>
                  </div>
              ))}
              <h2>DONE</h2>
              {stories.filter(story => story.state === State.DONE).map(story => (
                  <div key={story.id} className="story-item">
                      <h3>{story.name}</h3>
                      <p>{story.description}</p>
                      <p>State: {story.state}</p>
                      <p>priority: {story.priority}</p>
                      <button onClick={() => handleEditStory(story)}>Edit</button>
                      <button onClick={() => handleDeleteStory(story.id)}>Delete</button>
                  </div>
              ))}
          </div>
          </>
            ))}
            {newStory && (
              <div className="edit-field">
                <div className="project-info">
                  <input
                      type="text"
                      name="name"
                      placeholder="Story title"
                      value={newStory.name}
                      onChange={handleStoryChange}
                  />
                  <input
                      type="text"
                      name="description"
                      placeholder="Story description"
                      value={newStory.description}
                      onChange={handleStoryChange}
                  />
                  <select value={newStory.state} name="state" id="" onChange={handleStoryChange}>
                    <option value={State.TODO}>Todo</option>
                    <option value={State.DOING}>Doing</option>
                    <option value={State.DONE}>Done</option>
                  </select>
                  <select value={newStory.priority} name="priority" id="" onChange={handleStoryChange}>
                    <option value={Priority.HIGH}>High</option>
                    <option value={Priority.MEDIUM}>Medium</option>
                    <option value={Priority.LOW}>Low</option>
                  </select>
                  <button className="button" onClick={handleAddStory}>Add Story</button>
                </div>
              </div>
            )}
            {editingStory && (
                <div className="edit-field">
                  <h2>Edit Story</h2>
                  <input type="text" name="name" value={editingStory.name} onChange={handleStoryChange}/>
                  <input type="text" name="description" value={editingStory.description} onChange={handleStoryChange}/>
                  <select name="state" value={editingStory.state} onChange={handleStoryChange}>
                      <option value={State.TODO}>Todo</option>
                      <option value={State.DOING}>Doing</option>
                      <option value={State.DONE}>Done</option>
                  </select>
                  <select name="priority" value={editingStory.priority} onChange={handleStoryChange}>
                      <option value={Priority.HIGH}>High</option>
                      <option value={Priority.MEDIUM}>Medium</option>
                      <option value={Priority.LOW}>Low</option>
                  </select>
                  <button className="button" onClick={handleUpdateStory}>Update</button>
                  <button className="button" onClick={() => setEditingStory(null)}>Cancel</button>
              </div>
            )}
        </div>
      )}

    </div>
  );
};

export default ProjectManager;