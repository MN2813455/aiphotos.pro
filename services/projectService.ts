import { Project, GeneratedImage } from '../types';

const STORAGE_KEY = 'aiphotos_projects_v1';

export const getProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load projects", e);
    return [];
  }
};

export const saveProject = (project: Project): void => {
  const projects = getProjects();
  const existingIndex = projects.findIndex(p => p.id === project.id);
  
  if (existingIndex >= 0) {
    projects[existingIndex] = project;
  } else {
    projects.unshift(project);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error("Storage quota exceeded", e);
    // Simple eviction policy: remove oldest project if not current
    if (projects.length > 1) {
      projects.pop(); 
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  }
};

export const createProject = (name: string, description?: string): Project => {
  const newProject: Project = {
    id: Date.now().toString(),
    name,
    description,
    createdAt: Date.now(),
    images: []
  };
  saveProject(newProject);
  return newProject;
};

export const deleteProject = (id: string): Project[] => {
  const projects = getProjects().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  return projects;
};

export const addImageToProject = (projectId: string, image: GeneratedImage): Project | null => {
  const projects = getProjects();
  const projectIndex = projects.findIndex(p => p.id === projectId);
  
  if (projectIndex === -1) return null;
  
  const project = projects[projectIndex];
  project.images.unshift(image);
  project.coverImage = image.url; // Update cover
  
  saveProject(project);
  return project;
};
