import Project from '../models/Project';

class ProjectService {
  get_projects(): Project[] {
    const projects = localStorage.getItem('projects');
    return projects ? JSON.parse(projects) as Project[] : [];
  }

  get_project(id: number): Project | undefined {
    const projects = this.get_projects();
    return projects.find(project => project.id === id);
  }

  add_project(project: Project): void {
    const projects = this.get_projects();
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  update_project(updatedProject: Project): void {
    let projects = this.get_projects();
    projects = projects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
    );
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  delete_project(id: number): void {
    let projects = this.get_projects();
    projects = projects.filter(project => project.id !== id);
    localStorage.setItem('projects', JSON.stringify(projects));
  }
}

export default new ProjectService();