import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable} from "rxjs";

export abstract class AbstractDataSource<Dto> implements DataSource<Dto> {

  constructor(
    private readonly data: Observable<Dto[]>
  ) {
  }

  connect(collectionViewer: CollectionViewer): Observable<Dto[]> {
    return this.data;
  }

  disconnect(collectionViewer: CollectionViewer): void {
  }
}
