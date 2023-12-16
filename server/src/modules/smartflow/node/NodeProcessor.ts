import NodeService from "./node.service";
//import * as most from "most";

import { Node } from "./node.model";
import { DataSource } from "typeorm";
import Container from "typedi";

import Sql from "./actions/sql/Sql";

export default class NodeProcessor {
  nodeService: NodeService;
  node: Node | null;
  id: number;
  function: Function;
  postFunction: Function;
  db: DataSource;
  next: NodeProcessor | null;
  constructor(node: Node | number) {
    if (typeof node === "number") {
      this.id = node;
    } else {
      this.node = node;
    }
    this.nodeService = new NodeService();
    this.db = Container.get("connection");
  }

  async init() {
    if (this.id) {
      this.node = await this.nodeService.get(this.id);
    }
    if (this.node == null) {
      throw new Error("Node not found");
    }
    this.buildFunction();
    this.buildPostFunction();
    /* 
    console.log(
      await this.db.query(
        "select * from user where $1 = $1 and $2 > $1",
        [1, 5]
      )
    );
    const [query, params] = Sql.convertToNamedParams(
      "select * from user where id = :id and name = :name and :id = :id",
      {
        id: 1,
        name: "adam",
        dsdsd: 121,
        Sql: "select * from user",
        isFinite: "select * from user",
      }
    );
    console.log("query:", query, "params:", params);
    */
  }

  setNextProcessor(node: NodeProcessor) {
    console.log(
      "current Node",
      this.node?.id,
      "setNextProcessor",
      node.node!.id
    );
    this.next = node;
  }

  getNextProcessor() {
    return this.next;
  }

  describe() {
    console.log("   describe node # ", this.node!.type, this.node!.id);
    console.log("--------------------------------------------");
    console.log("   actionType : ", this.node!.actionType);
    console.log("   action : ", this.node!.action);
    console.log("   columns : ", this.node!.columns);
    console.log("   inputSchema : ", this.node!.inputSchema);
    console.log("   outputSchema : ", this.node!.outputSchema);
    console.log("   function : ", this.function.toString());
    console.log("--------------------------------------------");
  }

  buildFunction() {
    if (this.node!.actionType === "sql") {
      const [query, params] = Sql.convertToNamedParams(this.node!.action, {
        id: 1,
      });
      console.log("query:", query, "params:", params);
      this.function = new Function(
        "db",
        "Sql",
        "action",
        `return async (params) =>  { 
           const [rawQuery, rawParams] = Sql.convertToNamedParams(action,params);
           return await  db.query(rawQuery, rawParams);
        }`
      );
    } else if (this.node!.actionType === "csv") {
      this.function = new Function(
        "db",
        `return async (data) => { console.log("In Vsc!") ; return await true ;} `
      );
    } else if (this.node!.actionType === "shell") {
      this.function = new Function(
        "db",
        `return async (data) => { console.log('${
          this.node!.action
        }');return await data;}`
      );
    } else if (this.node!.actionType === "generic") {
      this.function = new Function(
        "db",
        `return async (data) => { await 1; ${this.node!.action} }`
      );
    }
    this.function = this.function(this.db, Sql, this.node!.action);
  }

  buildPostFunction() {
    this.postFunction = new Function(
      "db",
      "Sql",
      "action",
      `return async (data,result) =>  { 
        ${this.node!.postAction}
         return data;
      }`
    );
    this.postFunction = this.postFunction(this.db, Sql, this.node!.action);
  }

  getNode() {
    const functionString = this.function.toString();
    return { ...this.node, functionString };
  }

  getAction() {
    return this.node!.action;
  }

  async processNext(data: any) {
    const cloneData = { ...data };
    //console.log("Process Next node ", this.next?.node?.id);
    // this.next?.describe();
    if (this.next) {
      //console.log("THERE IS NEXT to execute");
      return await this.next.execute(cloneData);
    }
    return data;
  }

  async execute(data?: any): Promise<any> {
    const result = await this.function(data).catch((err: Error) => {
      console.log("Error in function", err);
      throw new Error("error in function execution:" + err.message);
    });

    data = await this.postFunction(data, result).catch((err: Error) => {
      console.log("Error in post function", err);
      throw new Error("error in post function execution:" + err.message);
    });

    //console.log(`Node : ${this.node!.id} => result : ${JSON.stringify(data)}}`);

    data = await this.processNext(data).catch((err: Error) => {
      console.log("Error in next function", err);
      throw new Error("error in next  function execution:" + err.message);
    });

    //console.log(`Node : ${this.node!.id} => result : ${JSON.stringify(data)}}`);
    return data;

    /* 
    console.log(`Node : ${this.node!.id} => result : ${data}}`);

    console.log("   execute node # ", this.node!.type, this.node!.id);
    console.log("--------------------------------------------");


    interface User {
      id: number;
      name: string;
      dep_id: number;
      address?: string;
      managerEmail?: string;
      processTime?: Date;
    }

    // 1. Fetch users

    const users: User[] = Array.from({ length: 1000000 }, (v, k) => ({
      id: k,
      name: "Adam",
      dep_id: 1,
    }));

    const stream = most.from(users);
    const returnValue: { status: string; data: any; station: number } = {
      status: "ok",
      data: [],
      station: this.node!.id,
    };

    for (let i = 0; i < users.length; i += 10000) {
      console.log("i", this.node!.id, i);
      await stream
        .slice(i, i + 100)
        .map(async (user) => {
          //     console.log("map 1", user);
          await new Promise((resolve) => setTimeout(resolve, 3));
          return await { ...user, managerEmail: "adam@gmail.com" };
        })
        .awaitPromises()
        .map(async (user) => {
          //     console.log("map 1", user);
          await new Promise((resolve) => setTimeout(resolve, 3));
          return await { ...user, managerEmail: "adam@gmail.com" };
        })
        .awaitPromises()
        .map(async (user) => {
          //     console.log("map 1", user);
          await new Promise((resolve) => setTimeout(resolve, 3));
          return await { ...user, managerEmail: "adam@gmail.com" };
        })
        .awaitPromises()
        .reduce((acc, item) => {
          acc.push(item);
          return acc;
        }, returnValue.data);
    }
    console.log("returnValue", returnValue["data"][0]);
*/
    return true;
  }
}
