import BaseAction from "../../BaseAction";
import { sqlSchemaType } from "./schemas";
import { DataSource } from "typeorm";
class Sql extends BaseAction<sqlSchemaType> {
  constructor(private data: sqlSchemaType, public db: DataSource) {
    super("sql", data);
  }

  async invoke(params: any): Promise<any> {
    return await this.db.query(this.data.sql, params);
  }

  static convertToNamedParams(query: string, params: any) {
    const paramMap: any = {};
    let paramindex = 0;
    // Function to replace named with positional
    function namedToPositional(query: string) {
      return query.replace(/:\w+/g, (match) => {
        const paramName = match.slice(1);
        console.log("paramName:", paramName);

        // Increment occurrence counters

        if (paramMap[paramName]) {
        } else {
          paramindex++;
          paramMap[paramName] = paramindex;
        }
        return `$${paramMap[paramName]}`;
      });
    }

    // Replace named with positional
    const convertedQuery = namedToPositional(query);
    console.log("orig query:", query, "\nconvertedQuery:", convertedQuery);
    // Build parameter array matching positional order
    const paramArray = [] as any[];
    Object.keys(paramMap).forEach((key) => {
      console.log("key:", key);
      paramArray.push(params[key]);
    });

    console.log("paramArray:", paramArray);
    return [convertedQuery, paramArray];
  }
}

export default Sql;
