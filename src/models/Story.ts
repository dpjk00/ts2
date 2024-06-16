import Project from '../models/Project';
import User from '../models/User';

type Priority = 'Low' | 'Medium' | 'High';
type State = 'Todo' | 'Doing' | 'Done';

export default class Story {
  id: number;
  name: string;
  description: string;
  priority: Priority;
  project: Project;
  created: Date;
  state: State;
  owner: User;

  constructor(id: number, name: string, description: string, priority: Priority, project: Project, created: Date, state: State, owner: User) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.project = project;
    this.created = created;
    this.state = state;
    this.owner = owner
  }
}