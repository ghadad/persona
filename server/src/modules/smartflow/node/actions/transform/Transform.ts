import BaseAction from "../../BaseAction";
import { sqlSchemaType } from "./schemas";
import { DataSource } from "typeorm";
class Transform extends BaseAction<sqlSchemaType> {
  constructor(data: sqlSchemaType, public db: DataSource) {
    super("transform", data);
  }

  async invoke(mapper: () => any): Promise<any> {
    return await mapper();
  }
}

export default Transform;
