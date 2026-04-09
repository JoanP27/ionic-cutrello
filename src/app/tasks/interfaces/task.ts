import { User } from "src/app/profile/interfaces/user";
import { TaskInsert } from "./task-insert";

export interface Task extends TaskInsert {
  id: number;
  title: string;
  description: string;
  status: number;
  creator: number;
  filepath: string;
  createdAt: string;
  deadLine: string;
  lat: number;
  lng: number;
  address: string;
  position: number;
  subtasks: SubTask[];
  mine: boolean;
}

export interface SubTask {
  id: number,
  description: string,
  completed: boolean
}

export interface Comment {
  id: number,
  taskId: number,
  comment: string,
  currentPage: number,
  hasNextPage: boolean,
  createdAt: string,
  user: User
}

export interface CommentResponse {
  comments: Comment[],
  
}

export interface SingleCommentResponse {
  comment: Comment
}