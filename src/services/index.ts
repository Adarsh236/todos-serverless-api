import dynamoDBClient from '../config/dynamoDBClient';
import TodoService from './todosService';

const todoService = new TodoService(dynamoDBClient());

export default todoService;
