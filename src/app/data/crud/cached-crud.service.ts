import {IdHolder, NameHolder} from "../api.domain";
import {CachedCrudService} from "./cached-crud.service.interface";
import {AbstractSmallCachedCrudService} from "./small-cached-crud.service";

export abstract class AbstractCachedCrudService<D extends (IdHolder<I> & NameHolder), I> extends AbstractSmallCachedCrudService<D, D, I> implements CachedCrudService<D, I> {
}
