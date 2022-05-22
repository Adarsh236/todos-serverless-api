import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { MessageUtil } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import todosService from '../../services';

import { v4 } from 'uuid';
import { HttpStatusCode } from '@libs/HttpStatusCode';

export const getAllTodos = middyfy(async (): Promise<APIGatewayProxyResult> => {
  const todos = await todosService.getAllTodos();
  return MessageUtil.success({
    todos,
  });
});

export const createTodo = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      if (!event.body) {
        return MessageUtil.error(
          HttpStatusCode.BAD_REQUEST,
          'Empty request body'
        );
      }

      if (!event.body.title || !event.body.description) {
        return MessageUtil.error(
          HttpStatusCode.BAD_REQUEST,
          'Required both title & description'
        );
      }

      const id = v4();
      const todo = await todosService.createTodo({
        todosId: id,
        title: event.body.title,
        description: event.body.description,
        done: !!event.body.done,
      });
      return MessageUtil.success({
        todo,
      });
    } catch (e) {
      return MessageUtil.error(HttpStatusCode.INTERNAL_SERVER_ERROR, e);
    }
  }
);

export const deleteTodo = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters!.id;
    if (id === undefined) {
      return MessageUtil.error(
        HttpStatusCode.BAD_REQUEST,
        "Missing 'id' parameter in path"
      );
    }
    try {
      const todo = await todosService.deleteTodo(id);

      if (Object.keys(todo).length) {
        return MessageUtil.error(
          HttpStatusCode.NOT_FOUND,
          'Todo does not exist.'
        );
      }

      return MessageUtil.success({
        todo,
        id,
      });
    } catch (e) {
      return MessageUtil.error(HttpStatusCode.INTERNAL_SERVER_ERROR, e);
    }
  }
);
