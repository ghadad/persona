// create abstract base node class that have invoke ,initilize , parser , type
import { parse } from "yaml";

abstract class BaseAction<T> {
  constructor(private actionType: string, data: T) {}

  get type() {
    return this.actionType;
  }

  parse(text: string): T {
    const jsonRegex = /^\s*(\{|\[)/;
    if (jsonRegex.test(text)) {
      return JSON.parse(text);
    }
    return parse(text);
  }
}

export default BaseAction;
