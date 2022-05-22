import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import Todo from '../model/Todo';

export default class TodoService {
  private TableName = 'TodosTable';

  constructor(private docClient: DocumentClient) {}

  async getAllTodos(): Promise<Todo[]> {
    const todos = await this.docClient
      .scan({
        TableName: this.TableName,
      })
      .promise();
    return todos.Items as Todo[];
  }

  async createTodo(todo: Todo): Promise<Todo> {
    await this.docClient
      .put({
        TableName: this.TableName,
        Item: todo,
      })
      .promise();
    return todo as Todo;
  }

  async deleteTodo(id: string): Promise<any> {
    return await this.docClient
      .delete({
        TableName: this.TableName,
        Key: {
          todosId: id,
        },
      })
      .promise();
  }
}
