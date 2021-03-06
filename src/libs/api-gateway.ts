import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
import { HttpStatusCode } from './HttpStatusCode';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export class MessageUtil {
  static success(response: Record<string, unknown>): APIGatewayProxyResult {
    return {
      statusCode: HttpStatusCode.OK,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(response),
    };
  }

  static error(code: number, message: string): APIGatewayProxyResult {
    return {
      statusCode: code,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message }),
    };
  }
}
