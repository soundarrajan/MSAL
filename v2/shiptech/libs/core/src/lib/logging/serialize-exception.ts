export interface SerializeException {
  __type: string;
  __dataType?: string;
  message?: string;
  stack?: string;
  name?: string;
}

/**
 * Returns an exception that can be safely sent to server as json.
 * @param exception
 */
export function serializeException(exception: any): SerializeException {
  if (!exception) {
    return { __type: 'unknown' };
  }

  const formattedException = { ...exception, __type: exception.constructor.name };

  // Note: Check if this is a browser error, e.g TypeError.
  // Note: calling JSON.stringify(TypeError) does not render all props.
  if (exception instanceof Error) {
    formattedException.message = exception.message;
    formattedException.stack = exception.stack;
    formattedException.name = exception.name;
  }

  // Note: We want to remove angular specifics so that the payload is small
  if (exception.ngDebugContext) {
    delete formattedException.ngDebugContext;
  }
  if (formattedException.ngErrorLogger) {
    delete formattedException.ngErrorLogger;
  }

  return formattedException;
}
