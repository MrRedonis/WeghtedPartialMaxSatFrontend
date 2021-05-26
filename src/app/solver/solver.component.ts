import {Component, Input, NgModule, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {SendForm} from "../models/SendForm";
import {Clause} from "../models/Clause";
import {SolverService} from "../solver.service";
import {waitForAsync} from "@angular/core/testing";
import {Subscription} from "rxjs";

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
        // @ts-ignore
        var obj = JSON.parse(response);
        this.cost = obj.cost;
        this.solution = obj.solution;
        this.final_soft_clauses = obj.final_soft_clauses;
        this.final_hard_clauses = obj.final_hard_clauses;
        this.message = this.printResult();
      },
      error => {
            console.error(error);
            this.message = this.printUnsat()
        }
    )
    console.log(this.cost);
    console.log(this.solution);
    console.log(this.final_soft_clauses);
    console.log(this.final_hard_clauses);
  }

  prepareData(result: any){
    return JSON.parse(JSON.stringify(result));
  }

  printResult() {
    return("Maksymalna waga rozwiązania: " + (this.sumOfWeights-this.cost) +"\nRozwiązanie: "+ this.solution + "\nKlauzule \"soft\": " + this.final_soft_clauses + "\nKlauzule \"hard\": " + this.final_hard_clauses);
  }

  printUnsat() {
    return("UNSAT")
  }
}

