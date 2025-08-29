
export function createPayload<T>(model: T): { data: { attributes: T } } {
  return {
    data: {
      attributes: model
    }
  };
}

