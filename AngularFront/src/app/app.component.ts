import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { __param } from 'tslib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  url="http://localhost:8080/calculate/expression";
  constructor(private http:HttpClient){};


  expression:string = '';
  result:string = '';
  floatingpoint:boolean= false;
  opPressed:boolean=false;
  evaluated:boolean=false;
  errorMsg:boolean=false;

  pressedNum(num:string)
  {
    if(this.errorMsg) {
      this.ClearAll();
      this.errorMsg=false;
    }

    if(this.evaluated){
      this.evaluated=false;
      this.expression='';
      this.result='';
    } 
    if (num=='.')
    {
      if(this.floatingpoint) return;
      this.floatingpoint=true;
    }
    this.expression=this.expression+num;
    this.opPressed=false;
  } 

  pressedOperator(op:string)
  {
    if(this.errorMsg) {
      this.ClearAll();
      this.errorMsg=false;
    }

    if(this.evaluated) {
      this.expression=this.result;
      this.result="";
      this.evaluated=false;
    }
    if(this.opPressed){
      this.expression=this.expression.slice(0,this.expression.length-1);
    }

    if( this.expression.length==0)
    {
      if(this.evaluated) this.expression=this.result;
      else return;
    } 

    this.opPressed = true;
    this.floatingpoint=false;
    this.expression=this.expression+op;
  }

  percentage(){
    if(this.errorMsg) {
      this.ClearAll();
      this.errorMsg=false;
    }
    if(this.evaluated) {
      this.expression=this.result;
      this.result="";
      this.evaluated=false;
    }
    this.expression=this.expression+'%';
  }

  Reciprocal(){
    if(this.errorMsg) {
      this.ClearAll();
      this.errorMsg=false;
    }
    if(this.evaluated) {
      this.expression=this.result;
      this.result="";
      this.evaluated=false;
    }
    
    let operators="+*-/^%"

    if( operators.indexOf( this.expression.charAt(this.expression.length-1)) !==-1)
      return
  
    let temp ='';
    let prevOpInd=-1
    let i=0;
    for(i=0;i<operators.length;i++)
    {
      let tempInd=Math.max(prevOpInd,this.expression.lastIndexOf(operators.charAt(i)))
      if(this.expression.charAt(tempInd)!=='%')
      prevOpInd=tempInd 
    }
        
    if(prevOpInd!=-1)
    temp=this.expression.slice(0,prevOpInd+1) + "1/" +this.expression.slice(prevOpInd+1)
    else
    temp="1/"+this.expression;
    this.expression=temp;
  }

  ClearAll(){
    this.expression='';
    this.result='';
    this.floatingpoint=false;
    this.opPressed=false;
    this.evaluated=false;
    this.errorMsg=false;
  }

  Erase(){
    if(this.errorMsg) {
      this.ClearAll();
      this.errorMsg=false;
    }
    if(this.evaluated)
    {
      this.result="";
      this.evaluated=false;
    }
    if(this.expression.length>0){
      let operators="+*-/^%"
      let c = this.expression.charAt(this.expression.length-1);
      this.expression=this.expression.slice(0,this.expression.length-1);
      //if c is an operator, we need to undo the flags to allow ourselves to use them correctly again
      if (c==='+' || c==='*'||c==='/'||c==='^' || c==='-')
      {
          this.opPressed=false;
          let pointInd=this.expression.lastIndexOf('.');
          let prevOpInd=-1
          let i=0;
          for(i=0;i<operators.length;i++)
             prevOpInd=Math.max(prevOpInd,this.expression.lastIndexOf(operators.charAt(i)))
          if(pointInd>prevOpInd) //there is a point before last operator
          {
            this.floatingpoint=true;
          }
          else
          {
            this.floatingpoint= false;
          }
      }
      if(c==='.')
        this.floatingpoint=false;
    }
    
  }

  evaluate()
  {
    const headers = new HttpHeaders({'Content-Type':"application/text"}) ;
      this.http.post(this.url,this.expression,{headers:headers,responseType:'text'
      }).subscribe((response)=>{
        this.result=response;
        if(this.result==='E')
            this.errorMsg= true;
        else {
          this.errorMsg=false;
          this.evaluated=true;
        }
            
      },(error)=>{
        console.error();
      });
  }

  switchSigns(){
    let operators="+*-/^%"
    //if -ve make it +ve and remove (-x) >> x
    //if +ve add (-x) 
    if(this.errorMsg) {
      this.ClearAll();
      this.errorMsg=false;
    }
    if(this.evaluated) {
      this.expression=this.result;
      this.result="";
      this.evaluated=false;
    }
    if(this.expression.length>0){
      let indNeg=this.expression.lastIndexOf('-');
      let indOp=-1
      let i=0
      for(i=0;i<operators.length;i++)
        {
          let temp=Math.max(indOp,this.expression.lastIndexOf(operators.charAt(i)))
          if(temp!=indNeg)
            indOp=temp;
        }
        
      let c = this.expression.charAt(this.expression.length-1);
      if(indNeg==indOp+1){
      //-ve switch to +ve
      //we want to remove  the -
      let temp=this.expression.slice(0,indNeg) +this.expression.slice(indNeg+1);
      this.expression= temp;
      }
      else //+ve to -ve
      {
        indOp=Math.max(indOp,indNeg);
        let temp=this.expression.slice(0,indOp+1) + "-" +this.expression.slice(indOp+1)+"";
        this.expression=temp;
      }
   }
  }

}
