import {Component, Input, NgModule, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {SolverService} from "../solver.service";
@Component({
  selector: 'app-solver',
  templateUrl: './solver.component.html',
  styleUrls: ['./solver.component.css'],
  providers: [SolverService]
})

export class SolverComponent implements OnInit {
  formuls: any;
  form: FormGroup;
  private sumOfWeights: number = 0;
  private response: any;
  private cost: any;
  private solution: any;
  private final_soft_clauses: any;
  private final_hard_clauses: any;
  public message: string = '';
  private answer: any;

  constructor(public fb: FormBuilder, private api:SolverService) {
    this.form = this.fb.group({
      clauses: this.fb.array([]),
    });
  }

  newClause(variables: number[], weight: number): FormGroup {
    return this.fb.group({
      variables: this.fb.array(variables),
      weight: weight,
    })
  }

  get clauses() : FormArray {
    return this.form.get("clauses") as FormArray
  }

  addClause(variables: number[], weight: number) {
    this.clauses.push(this.newClause(variables, weight));
  }

  resetBuilder(){
    this.form.reset();
    this.form = this.fb.group({
      clauses: this.fb.array([]),
    });

  }

  ngOnInit(): void {}

  solve() {
    this.sumOfWeights = 0;
    this.resetBuilder();
    let clauses  = this.formuls.split("\n");
    for (let entry of clauses){
      let split = entry.split(" ");
      let new_split: number[] = [];
      for (let e of split){
        new_split.push(Number(e));
      }
      let first: number = Number(new_split.shift());
      this.sumOfWeights += first;
      this.addClause(new_split, first);
    }
    console.log("Form Submitted!");
    this.api.create(this.form.value).subscribe(
      response => {
        this.response = response;
        console.log(response);

        this.cost = this.response["cost"];
        this.solution = this.response["solution"];
        this.final_soft_clauses = this.response["final_soft_clauses"];
        this.final_hard_clauses = this.response["final_hard_clauses"];
        this.answer = this.response["answer"];

        if (this.answer == "SAT"){
          this.message = this.printResult();
        }
        else{
          this.message = this.printUnsat();
        }

      },
      error => {
            console.error(error);
            this.message = this.printError();
        }
    )
  }

  prepareOutputClauses(clauses: Array<Array<any>>){
    var output = "";

    if (clauses.length == 0){
      output = "None";
    }

    for (let i = 0; i < clauses.length; i++) {
      output += "(";
      output += clauses[i].toString();
      output += ")";
    }
    return output;
  }

  printResult() {
    return("SATISFIABLE\nMaksymalna waga rozwi??zania: " + (this.sumOfWeights-this.cost) +"\nRozwi??zanie: "+ this.solution + "\nKlauzule \"soft\": " + this.prepareOutputClauses(this.final_soft_clauses) + "\nKlauzule \"hard\": " + this.prepareOutputClauses(this.final_hard_clauses));
  }

  printUnsat() {
    return("UNSATISFIABLE");
  }

  printError() {
    return("ERROR");
  }
}

