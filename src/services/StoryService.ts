import {Story} from '../models/Story';

class StoryService {
  private static localStorageKey = 'stories';

  static get_stories(): Story[] {
    const storiesJson = localStorage.getItem(this.localStorageKey);
    if (storiesJson) return JSON.parse(storiesJson);
    return [];
  }

  static get_story(id: number): Story | undefined {
      const stories = this.get_stories();
      return stories.find(story => story.id === id);
  }

  static add_story(story: Story): void {
      let stories = this.get_stories();
      stories.push(story);
      localStorage.setItem(this.localStorageKey, JSON.stringify(stories));
  }

  static get_story_by_id(id: number): Story[] {
    const stories = this.get_stories();
    return stories.filter(story => story.project === id);
  }

  static update_story(updatedStory: Story): void {
      let stories = this.get_stories();
      const index = stories.findIndex(story => story.id === updatedStory.id);
      if (index !== -1) {
        stories[index] = updatedStory;
        localStorage.setItem(this.localStorageKey, JSON.stringify(stories));
      }
  }

  static delete_story(id: number): void {
      let stories = this.get_stories();
      const updatedStories = stories.filter(story => story.id !== id);
      localStorage.setItem(this.localStorageKey, JSON.stringify(updatedStories));
  }
}

export default StoryService;
