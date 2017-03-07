export class SqlBatch{


  constructor(query: string, params?: Array<any>){
      this.query = query;
      this.params = params;
  }


    query: string;
    params: Array<any>;
}