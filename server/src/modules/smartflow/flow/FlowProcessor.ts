import FlowService from "./flow.service";

import { Flow } from "./flow.model";
import { Node } from "../node/node.model";
import NodeProcessor from "../node/NodeProcessor";

export default class FlowProcessor {
  flowService: FlowService;
  flow: Flow | null;
  nodes: Node[];
  nodeProcessors: NodeProcessor[] = [];
  constructor(readonly id: number) {
    this.flowService = new FlowService();
  }

  async init() {
    this.flow = await this.flowService.getFlowById(this.id);
    if (this.flow == null) {
      throw new Error("Flow not found");
    }
    this.nodes = await this.flowService.getNodes(this.id);
    await this.buildFlow();
  }

  getFlow() {
    return this.flow;
  }

  getNodes() {
    return this.nodes;
  }

  describe() {
    console.log("   describe flow # ", this.flow!.id);
    console.log("--------------------------------------------");
    console.log("   name : ", this.flow!.name);
    console.log("   title : ", this.flow!.title);
    console.log("   description : ", this.flow!.description);
    console.log(
      "   nodeProcessors : ",
      this.nodeProcessors.map(
        (p) =>
          `[${p.getNode().id} - ${p.getNode().type}] : ${
            p.getNode().name
          }  -> ${p.next?.getNode()?.id}`
      )
    );
    console.log("--------------------------------------------");
  }

  async buildFlow() {
    console.log("execute flow : ", this.flow!.id);
    //let dataPipe: any = [null];

    //let nextProcessor: NodeProcessor | null = null;
    let prevProcessor: NodeProcessor | null = null;

    for (const node of this.getNodes()) {
      const nodeProcessor = new NodeProcessor(node);
      await nodeProcessor.init();
      if (prevProcessor != null) {
        prevProcessor.setNextProcessor(nodeProcessor);
      }
      //prevProcessor?.describe();
      prevProcessor = nodeProcessor;

      this.nodeProcessors.push(nodeProcessor);
      /*
      const { actionType, action, functionString } = nodeProcessor.getNode()!;
        console.log(
        "->next",
        actionType,
        action,
        functionString,
        "\n===================================\n"
      );
*/
      if (nodeProcessor.getNode()?.type == "node") {
        /*         for (const data of dataPipe) {
          dataPipe = await nodeProcessor.execute();
          console.log("dataPipe", dataPipe);
          dataPipe = await nodeProcessor.execute(data);
        }
        */
      }
    }
  }

  async execute() {
    const p1 = this.nodeProcessors[0];
    //p1.describe();

    const data = [];
    for (let i = 0; i < 1000000; i++) {
      data.push({ id: i, name: "adam " + i, age: 20 + i, city: "tehran" });
    }
    let index = 0;
    for (let i = 0; i < data.length; i += 10000) {
      const dataChunk = data.slice(i, i + 10000);
      const promises = [];
      for (const d of dataChunk) {
        promises.push(p1.execute(d));
      }
      const result = await Promise.all(promises);

      console.log("usersChunk", ++index, result.length, result[0]);
    }
    /* 
    for (const p of this.nodeProcessors) {
      const { type, id } = p.getNode()!;
      const { actionType, action, functionString } = p.getNode();
      continue;
      console.log(
        "execute node # ",
        type,
        id,
        actionType,
        action,
        functionString,
        "\n===================================\n"
      );
    }
    */
  }
}
