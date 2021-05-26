import {Clause} from "./Clause";

export class SendForm {
    clauses: any;

     constructor() {
     }

     addClause(clause: Clause){
      this.clauses.push(clause)
     }
}
